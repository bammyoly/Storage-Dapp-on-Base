import { useEffect, useState } from "react";
import contractData from "../contracts/SimpleStorage.json";
import { ethers } from "ethers";
import { toast } from "react-hot-toast";



function Home() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [deploying, setDeploying] = useState(false);
  const [deployedAddress, setDeployedAddress] = useState(contractData.address || "");
  const [bytecodePresent] = useState(
    Boolean(contractData.bytecode || contractData.evm?.bytecode?.object)
  );
  const [inputValue, setInputValue] = useState("");
  const [storedValue, setStoredValue] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("frontend_deployed_address");
    if (saved) setDeployedAddress(saved);

    if (window.ethereum) {
      const prov = new ethers.providers.Web3Provider(window.ethereum, "any");
      setProvider(prov);

      prov.on("network", (newNetwork, oldNetwork) => {
        if (oldNetwork) {
          window.location.reload();
        }
      });
    }
  }, []);

  async function switchToBase() {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x2105" }], // Base Mainnet chainId
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        // Base not added → add it
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x2105",
              chainName: "Base Mainnet",
              nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
              rpcUrls: ["https://mainnet.base.org"],
              blockExplorerUrls: ["https://basescan.org"],
            },
          ],
        });
      } else {
        throw switchError;
      }
    }
  }

  async function connectWallet() {
    if (!provider) return alert("No provider found");
    try {
      // Ensure we are on Base Mainnet
      const network = await provider.getNetwork();
      if (network.chainId !== 8453) {
        setStatus("Switching to Base Mainnet...");
        await switchToBase();
      }

      // Request accounts
      await provider.send("eth_requestAccounts", []);
      const s = provider.getSigner();
      const addr = await s.getAddress();
      setSigner(s);
      setAccount(addr);
      setStatus(`Connected ${addr} on Base`);
    } catch (e) {
      console.error(e);
      setStatus("Connection failed");
    }
  }

  function disconnectWallet() {
    setSigner(null);
    setAccount(null);
    setStatus("Disconnected");
  }

  async function deployFromFrontend() {
    if (!signer) return alert("Connect wallet first");
    if (!bytecodePresent) return alert("No bytecode found in contract JSON.");
    try {
      setDeploying(true);
      setStatus("Deploying contract...");
      const factory = new ethers.ContractFactory(
        contractData.abi,
        contractData.bytecode || contractData.evm?.bytecode?.object,
        signer
      );
      const contract = await factory.deploy();
      setStatus("Waiting for confirmation...");
      await contract.deployed();

      const addr = contract.address;
      setDeployedAddress(addr);
      localStorage.setItem("frontend_deployed_address", addr);
      setStatus(`Contract deployed at ${addr}`);
      toast.success(
        <span>
          🎉 Contract deployed! <br />
          <a
            href={`https://basescan.org/address/${addr}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-500"
          >
            View on BaseScan
          </a>
        </span>,
        { duration: 18000 }
      );
    } catch (err) {
      console.error(err);
      setStatus("Deployment failed (see console)");
      toast.error("❌ Deployment failed. Check console for details.");
    } finally {
      setDeploying(false);
    }
  }

  async function setValueOnChain() {
    if (!signer) return alert("Connect wallet first");
    if (!deployedAddress) return alert("No deployed contract address set");
    try {
      setStatus("Sending tx...");
      const contract = new ethers.Contract(deployedAddress, contractData.abi, signer);
      const tx = await contract.setValue(Number(inputValue));
      await tx.wait();
      setStatus("Value set ✅");
      toast.success(
        <a
          href={`https://basescan.org/tx/${tx.hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-blue-500"
        >
          ✅ Tx confirmed! View on BaseScan
        </a>
      );

    } catch (e) {
      console.error(e);
      setStatus("setValue failed");
    }
  }

  async function getValueFromChain() {
    if (!provider) return alert("Connect wallet first");
    if (!deployedAddress) return alert("No deployed contract address set");
    try {
      setStatus("Reading value...");
      const contract = new ethers.Contract(deployedAddress, contractData.abi, provider);
      const val = await contract.getValue();
      setStoredValue(val.toString());
      setStatus("Value read ✅");
    } catch (e) {
      console.error(e);
      setStatus("getValue failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          A Simple Storage DApp
        </h1>
        <p className="text-gray-600 mb-6">
          Deploy and interact with your smart contract directly from the browser.
        </p>

        {!account ? (
          <button
            onClick={connectWallet}
            className="w-full py-3 px-6 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition mb-4"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="mb-4">
            <div className="text-sm text-gray-600 font-mono">
              Connected: {account}
            </div>
            <button
              onClick={disconnectWallet}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
            >
              Disconnect
            </button>
          </div>
        )}

        <div className="space-y-4">
          {bytecodePresent ? (
            <button
              onClick={deployFromFrontend}
              disabled={deploying}
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
            >
              {deploying ? "Deploying..." : "Deploy Contract"}
            </button>
          ) : (
            <div className="text-sm text-amber-600">
              Bytecode missing — update your deploy script.
            </div>
          )}

          <h4 className="mt-4 text-gray-800 font-medium">
            Interact with your contract
          </h4>

          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Value to store"
            className="w-full p-3 border rounded-lg"
          />

          <button
            onClick={setValueOnChain}
            className="w-full py-3 px-6 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Set Value
          </button>

          <button
            onClick={getValueFromChain}
            className="w-full py-3 px-6 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Get Value
          </button>

          <div className="text-gray-700 mt-2">
            Stored value:{" "}
            <span className="font-mono">{storedValue ?? "—"}</span>
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-6">
          Status: <span className="font-mono">{status}</span>
          <br />
          Contract Address:{" "}
          <span className="font-mono">{deployedAddress || "— none —"}</span>
        </div>
      </div>
    </div>
  );
}

export default Home;

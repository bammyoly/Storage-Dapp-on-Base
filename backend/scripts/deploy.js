const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

async function main() {
  // Compile before deploy (safety)
  await hre.run("compile");

  const Storage = await hre.ethers.getContractFactory("SimpleStorage");
  const storage = await Storage.deploy();
  await storage.deployed(); // ✅ v5 syntax

  const address = storage.address; // ✅ v5 syntax
  console.log("✅ SimpleStorage deployed to:", address);

  // Load artifact (ABI + bytecode) from Hardhat
  const artifactPath = path.join(
    __dirname,
    "../artifacts/contracts/SimpleStorage.sol/SimpleStorage.json"
  );
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  // Ensure frontend/contracts folder exists
  const contractsDir = path.join(__dirname, "../../frontend/src/contracts");
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  // Prepare output (address + ABI only)
  const output = {
    address,
    abi: artifact.abi,
    bytecode: artifact.bytecode,
  };

  // Write file for frontend
  fs.writeFileSync(
    path.join(contractsDir, "SimpleStorage.json"),
    JSON.stringify(output, null, 2)
  );

  console.log("📂 ABI + address written to frontend/src/contracts/SimpleStorage.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

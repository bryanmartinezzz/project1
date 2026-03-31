import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const StakeYourself = await hre.ethers.getContractFactory("StakeYourself");
  const contract = await StakeYourself.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("StakeYourself deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
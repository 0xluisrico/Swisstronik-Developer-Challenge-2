const hre = require("hardhat");

async function main() {
  const Storage = await hre.ethers.deployContract("Storage");

  await Storage.waitForDeployment();

  console.log(`Swisstronik contract deployed to ${Storage.target}`);
}

//DEFAULT BY HARDHAT:
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
var { ethers } = require("hardhat");

async function main() {
  const Storage = await ethers.deployContract(
    "Storage"
  );
  console.log(`Address deployed: ${await Storage.getAddress()}`);

  // Espera 10 confirmaciones
  var res = await Storage.waitForDeployment();
  await res.deploymentTransaction().wait(5);

  await hre.run("verify:verify", {
    address: await Storage.getAddress(),
    constructorArguments: [],
    contract :"contracts/Storage.sol:Storage",
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1; 
});
// scripts/get.js

const { ethers } = require("hardhat");

async function main() {
    // Reemplaza con la dirección del contrato desplegado
    const contractAddress = "0x563f85d0Cdf70BD7Bbc829f48324F3aEE50999f9";
    
    const Storage = await ethers.getContractFactory("Storage");
    const storageInstance = Storage.attach(contractAddress);

    const value = await storageInstance.readVarStorage();
    console.log(`El valor actual es: ${value.toString()}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

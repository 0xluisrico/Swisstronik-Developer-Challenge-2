// Import Hardhat and SwisstronikJS functions
const hre = require("hardhat");
const readline = require('readline');
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/swisstronik.js");

/**
 * Send a shielded transaction to the Swisstronik blockchain.
 *
 * @param {object} signer - The signer object for sending the transaction.
 * @param {string} destination - The address of the contract to interact with.
 * @param {string} data - Encoded data for the transaction.
 * @param {number} value - Amount of value to send with the transaction.
 *
 * @returns {Promise} - The transaction object.
 */
const sendShieldedTransaction = async (signer, destination, data, value) => {
  // Get the RPC link from the network configuration
  const rpclink = hre.network.config.url;

  // Encrypt transaction data
  const [encryptedData] = await encryptDataField(rpclink, data);

  // Construct and sign transaction with encrypted data
  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};
async function main() {
  // Address of the deployed contract
  const contractAddress = "0xbe4f9D67353BEBDad38d8dA2A71EB600Dd54c28a";

  // Get the signer (your account)
  const [signer] = await hre.ethers.getSigners();

  // Construct a contract instance
  const contractFactory = await hre.ethers.getContractFactory("Storage");
  const contract = contractFactory.attach(contractAddress);

  // Send a shielded transaction to set a message in the contract
  const functionName = "updateVarStorage";
  const valueToSet = 7;
  const setMessageTx = await sendShieldedTransaction(signer, contractAddress, contract.interface.encodeFunctionData(functionName, [valueToSet]), 0);
  await setMessageTx.wait();

  //It should return a TransactionResponse object
  console.log("Transaction Receipt: ", setMessageTx);
  console.log(`new value : ${valueToSet}`);
}

// Using async/await pattern to handle errors properly
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
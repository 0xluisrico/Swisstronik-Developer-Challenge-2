// Import Hardhat and SwisstronikJS functions
const hre = require("hardhat");
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/swisstronik.js");

/**
 * Send a shielded query/call to the Swisstronik blockchain.
 *
 * @param {object} provider - The provider object for making the call.
 * @param {string} destination - The address of the contract to call.
 * @param {string} data - Encoded data for the function call.
 *
 * @returns {Uint8Array} - Encrypted response from the blockchain.
 */
const sendShieldedQuery = async (provider, destination, data) => {
  // Get the RPC link from the network configuration
  const rpclink = hre.network.config.url;

  // Encrypt the call data using the SwisstronikJS function
  const [encryptedData, usedEncryptedKey] = await encryptDataField(rpclink, data);

  // Execute the call/query using the provider
  const response = await provider.call({
    to: destination,
    data: encryptedData,
  });

  // Decrypt the call result using SwisstronikJS function
  return await decryptNodeResponse(rpclink, response, usedEncryptedKey);
};

async function main() {
  // Address of the deployed contract
  const contractAddressSwisstronik ="0xbe4f9D67353BEBDad38d8dA2A71EB600Dd54c28a";

  // Get the signer (your account)
  const [signer] = await hre.ethers.getSigners();

  // Construct a contract instance
  const contractFactory = await hre.ethers.getContractFactory("Storage");
  
  const contractSwisstronik = contractFactory.attach(contractAddressSwisstronik);

  // Send a shielded query to retrieve data from the contract
  const functionName = "readVarStorage";
  const responseMessageSwisstronik = await sendShieldedQuery(signer.provider, contractAddressSwisstronik, contractSwisstronik.interface.encodeFunctionData(functionName));


  // Decode the Uint8Array response into a readable string
  console.log("Decoded response:", contractSwisstronik.interface.decodeFunctionResult(functionName, responseMessageSwisstronik)[0]);
}

// Using async/await pattern to handle errors properly
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

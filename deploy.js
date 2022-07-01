const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();
async function main() {
  // here we connect to our ganache rpc url
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  // get private key from our first ganache account
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  // grab our abi from our contract
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");
  // grab our bytecode from our contract
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf-8"
  );
  // cunstruct our contract
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying contract...");
  // deploy our contract and returns the promise
  const contract = await contractFactory.deploy();
  // we wait for the contract to be mined
  await contract.deployTransaction.wait(1);
  // call our retrieve function from our contract
  const currentFavoriteNumber = await contract.retrieve();
  // should be 0
  console.log(`Current favorite number : ${currentFavoriteNumber.toString()}`);
  // call our store functuon from our contract and enter a new favorite number solidity will know if we enter a string number
  const transactionResponse = await contract.store("7");
  // we wait for the transaction to be mined
  const transactionReceipt = await transactionResponse.wait(1);
  // call our retrieve function from our contract with the updated value
  const updatedfavoriteNumber = await contract.retrieve();
  console.log(`Updated favorite number : ${updatedfavoriteNumber.toString()}`);
}

main();

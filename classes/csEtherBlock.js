
var express = require('express');
var router = express.Router();
const { ethers } = require('ethers');
const contract = require("../utils/YSTRAToken.json");

const contractAddress = process.env.CONTRACT_ADDRESS // '0x41aCbfce44D04D84adfA483FF6b6E8a4Af833319'
const privateKey=process.env.PRIVATE_KEY_WALLET //"1276a043d16c3945f40201fc0b2d1f448a1d1f1172c02a817bf1b28552fc2488"
const API_KEY = process.env.API_KEY_ETH //"GHUU2HQ487TJ41WFC9T8FRI3BW8SE3XRN5"

class EthBlock {
    constructor() {        
    }
    
    async MintNFT(to,uri) {
        try {
     
          // Get contract ABI and address 
          const abi = contract.abi
          // Create a contract instance
      
          const provider2 = new ethers.providers.EtherscanProvider('goerli', API_KEY)
          const signer2 = new ethers.Wallet(privateKey, provider2)
          const myNftContract = new ethers.Contract(contractAddress, abi, signer2)
      
          const tx = await myNftContract.safeMint( to, uri );
          console.log('ok2',tx)
          //sendTransaction({ to, uri });
          await tx.wait();          
          return {result:true, hash:tx.hash}
        } catch (e) {
          const error = e.toString();          
          return {result:false};
        }
      }


}


module.exports = { EthBlock };
import { ethers } from "hardhat";
import { config as dotEnvConfig } from "dotenv";

dotEnvConfig();

const fs = require('fs');

const targetDir:string = './test/txt/';

fs.mkdirSync(targetDir, { recursive: true });

const ERC721SmartContractAddressBuffer:any = fs.readFileSync(`${targetDir}ERC721.txt`);

const ERC721SmartContractAddress:string = ERC721SmartContractAddressBuffer.toString();

const ERC1155SmartContractAddressBuffer:any = fs.readFileSync(`${targetDir}ERC1155.txt`);

const ERC1155SmartContractAddress:string = ERC1155SmartContractAddressBuffer.toString();

console.log("ERC721SmartContractAddress", ERC721SmartContractAddress);

console.log("ERC1155SmartContractAddress", ERC1155SmartContractAddress);

const Snippets = require("../libs/Snippets");

const LINKED_LIBRARY: string | undefined = process.env.LINKED_LIBRARY;

const LOGGER_LIBRARY: string | undefined = process.env.LOGGER_LIBRARY;

const CONTRACT_NAME: string | undefined = process.env.CONTRACT_NAME_MKTP;
const CONTRACT_SYMBOL: string | undefined = process.env.CONTRACT_SYMBOL_MKTP;

const CONTRACT_URI: string | undefined = Snippets.fromStringToBytes32(process.env.CONTRACT_URI_MKTP);
const ADMIN_ACCOUNTS: Array<string> | any = process.env.ADMIN_ACCOUNTS?.toString().split(",");
const LISTING_FEE_ETH: number | any = Snippets.ethersToWei(process.env.LISTING_FEE_ETH);

const abiKeys = [
    "bytes32",
    "address[]",
    "uint256"
  ];

  const abiValues = [
    CONTRACT_URI,
    ADMIN_ACCOUNTS,
    LISTING_FEE_ETH
  ]

  // Do not edit the lines below

  const abi: any = ethers.AbiCoder.defaultAbiCoder();

  const abiEncoded: any = abi.encode(abiKeys, abiValues);

  interface IConfig {
    CONTRACT_NAME: string | undefined;
    CONTRACT_SYMBOL: string | undefined;
    ABI_KEYS: Array<string>;
    ABI_VALUES: Array<any>;
    ABI_ENCODED: string;
    LINKED_LIBRARY: string | undefined;
    LOGGER_LIBRARY: string | undefined;
  }

  const config:IConfig = {
    CONTRACT_NAME: CONTRACT_NAME,
    CONTRACT_SYMBOL: CONTRACT_SYMBOL,
    ABI_KEYS: abiKeys,
    ABI_VALUES: abiValues,
    ABI_ENCODED: abiEncoded,
    LINKED_LIBRARY: LINKED_LIBRARY,
    LOGGER_LIBRARY: LOGGER_LIBRARY
  }

 module.exports = config;
import { ethers } from "hardhat";
import { config as dotEnvConfig } from "dotenv";

dotEnvConfig();

const Snippets = require("../libs/Snippets");

const LINKED_LIBRARY: string | undefined = process.env.LINKED_LIBRARY;

const LOGGER_LIBRARY: string | undefined = process.env.LOGGER_LIBRARY;

const CONTRACT_NAME: string | undefined = process.env.CONTRACT_NAME_721;
const CONTRACT_SYMBOL: string | undefined = process.env.CONTRACT_SYMBOL_721;

const CONTRACT_URI: string | undefined = Snippets.fromStringToBytes32(process.env.CONTRACT_URI_721);
const BASE_URI: string | undefined = process.env.BASE_URI_721;
const MAXIMUM_SUPPLY: number | any = parseInt(`${process.env.MAXIMUM_SUPPLY_721}`);
const ROYALTY_PERCENTAGE: number | any = process.env.ROYALTY_PERCENTAGE_721;
const ROYALTY_FRACTION: number | undefined = parseFloat(`${ROYALTY_PERCENTAGE}`) * 100;
const ROYALTY_RECEIVER: string | undefined = process.env.ROYALTY_RECEIVER_721;
const ADMIN_ACCOUNTS: Array<string> | any = process.env.ADMIN_ACCOUNTS?.toString().split(",");
const MINTER_ACCOUNTS: Array<string> | any = process.env.MINTER_ACCOUNTS?.toString().split(",");
const MINTING_FEE_ETH: number | any = Snippets.ethersToWei(process.env.MINTING_FEE_ETH_721);
const COLLECTION_CATEGORY: number | any = process.env.COLLECTION_CATEGORY_721;
const IS_PAUSABLE: boolean | any = process.env.IS_PAUSABLE_721;
const IS_BURNABLE: boolean | any = process.env.IS_BURNABLE_721;

const abiKeys = [
    "bytes32",
    "string",
    "uint256",
    "uint96",
    "address",
    "address[]",
    "address[]",
    "uint256",
    "uint256",
    "bool",
    "bool",
  ];

  const abiValues = [
    CONTRACT_URI,
    BASE_URI,
    MAXIMUM_SUPPLY,
    ROYALTY_FRACTION,
    ROYALTY_RECEIVER,
    ADMIN_ACCOUNTS,
    MINTER_ACCOUNTS,
    MINTING_FEE_ETH,
    COLLECTION_CATEGORY,
    IS_PAUSABLE,
    IS_BURNABLE,
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
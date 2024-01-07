import { ethers } from "hardhat";
import { config as dotEnvConfig } from "dotenv";

dotEnvConfig();

const Snippets = require("../libs/Snippets");

const LINKED_LIBRARY: string | undefined = process.env.LINKED_LIBRARY;

const LOGGER_LIBRARY: string | undefined = process.env.LOGGER_LIBRARY;

const CONTRACT_NAME: string | undefined = process.env.CONTRACT_NAME_1155;
const CONTRACT_SYMBOL: string | undefined = process.env.CONTRACT_SYMBOL_1155;

const BASE_URI: string | undefined = process.env.BASE_URI_1155;
const MAXIMUM_SUPPLY: number | any = parseInt(`${process.env.MAXIMUM_SUPPLY_1155}`);
const ROYALTY_PERCENTAGE: number | any = process.env.ROYALTY_PERCENTAGE_1155;
const ROYALTY_FRACTION: number | undefined = parseFloat(`${ROYALTY_PERCENTAGE}`) * 100;
const ADMIN_ACCOUNTS: Array<string> | any = process.env.ADMIN_ACCOUNTS?.toString().split(",");
const MINTER_ACCOUNTS: Array<string> | any = process.env.MINTER_ACCOUNTS?.toString().split(",");
const MINTING_FEE_ETH: number | any = Snippets.ethersToWei(process.env.MINTING_FEE_ETH_1155);
const IS_PAUSABLE: boolean | any = process.env.IS_PAUSABLE_1155;
const IS_BURNABLE: boolean | any = process.env.IS_BURNABLE_1155;

const abiKeys = [
    "bool",
    "bool",
    "address[]",
    "address[]",
    "uint96",
    "uint256",
    "uint256",
    "string"
  ];

  const abiValues = [
    IS_PAUSABLE,
    IS_BURNABLE,
    ADMIN_ACCOUNTS,
    MINTER_ACCOUNTS,
    ROYALTY_FRACTION,
    MINTING_FEE_ETH,
    MAXIMUM_SUPPLY,
    BASE_URI
  ]

  console.log(abiValues);

  // Do not edit the lines below

  const abi: any = ethers.AbiCoder.defaultAbiCoder();

  const abiEncoded: any = abi.encode(abiKeys, abiValues);

  interface IConfig {
    BASE_URI: string | undefined;
    ABI_KEYS: Array<string>;
    ABI_VALUES: Array<any>;
    ABI_ENCODED: string;
    LINKED_LIBRARY: string | undefined;
    LOGGER_LIBRARY: string | undefined;
  }

  const config:IConfig = {
    BASE_URI: BASE_URI,
    ABI_KEYS: abiKeys,
    ABI_VALUES: abiValues,
    ABI_ENCODED: abiEncoded,
    LINKED_LIBRARY: LINKED_LIBRARY,
    LOGGER_LIBRARY: LOGGER_LIBRARY
  }

 module.exports = config;
import { config as dotEnvConfig } from "dotenv";

dotEnvConfig();

const CONTRACT_FILE: string | undefined = process.env.CONTRACT_FILE_MCF;
const CONTRACT_NAME: string | undefined = process.env.CONTRACT_NAME_MCF;
const CONTRACT_SYMBOL: string | undefined = process.env.CONTRACT_SYMBOL_MCF;
const CONTRACT_JWLMCF_TREASURY_ACCOUNT: string | undefined = process.env.CONTRACT_JWLMCF_TREASURY_ACCOUNT;
const CONTRACT_JWLTKN_PER_BLOCK: number | undefined = parseInt(String(process.env.CONTRACT_JWLTKN_PER_BLOCK));
const CONTRACT_JWLMCF_START_BLOCK: number | undefined = parseInt(String(process.env.CONTRACT_JWLMCF_START_BLOCK));
const CONTRACT_JWLMCF_MULTIPLIER: number | undefined = parseInt(String(process.env.CONTRACT_JWLMCF_MULTIPLIER));
const CONTRACT_JWLMCF_ALLOCATION_POINT: number | undefined = parseInt(String(process.env.CONTRACT_JWLMCF_ALLOCATION_POINT));

const CONTRACT_FILE_TKN: string | undefined = String(process.env.CONTRACT_FILE_TKN);
const CONTRACT_NAME_TKN: string | undefined = String(process.env.CONTRACT_NAME_TKN);
const CONTRACT_SYMBOL_TKN: string | undefined = String(process.env.CONTRACT_SYMBOL_TKN);
const CONTRACT_DECIMALS_TKN: number | undefined = parseInt(String(process.env.CONTRACT_DECIMALS_TKN));
const CONTRACT_INITIAL_SUPPLY_DAO: number | undefined = parseInt(String(process.env.CONTRACT_INITIAL_SUPPLY_DAO));
const CONTRACT_MAXIMUM_SUPPLY_DAO: number | undefined = parseInt(String(process.env.CONTRACT_MAXIMUM_SUPPLY_DAO));

  // Do not edit the lines below

  interface IConfig {
    CONTRACT_FILE: string | undefined;
    CONTRACT_NAME: string | undefined;
    CONTRACT_SYMBOL: string | undefined;
    CONTRACT_JWLMCF_TREASURY_ACCOUNT: string | undefined;
    CONTRACT_JWLTKN_PER_BLOCK:  number | undefined;
    CONTRACT_JWLMCF_START_BLOCK:  number | undefined;
    CONTRACT_JWLMCF_MULTIPLIER: number | undefined;
    CONTRACT_FILE_TKN: string | undefined;
    CONTRACT_NAME_TKN: string | undefined;
    CONTRACT_SYMBOL_TKN: string | undefined;
    CONTRACT_DECIMALS_TKN: number | undefined;
    CONTRACT_INITIAL_SUPPLY_DAO: number | undefined;
    CONTRACT_MAXIMUM_SUPPLY_DAO: number | undefined;
    CONTRACT_JWLMCF_ALLOCATION_POINT:  number | undefined;
  }

  const config:IConfig = {
    CONTRACT_FILE: CONTRACT_FILE,
    CONTRACT_NAME: CONTRACT_NAME,
    CONTRACT_SYMBOL: CONTRACT_SYMBOL,
    CONTRACT_JWLMCF_TREASURY_ACCOUNT: CONTRACT_JWLMCF_TREASURY_ACCOUNT,
    CONTRACT_JWLTKN_PER_BLOCK:  CONTRACT_JWLTKN_PER_BLOCK,
    CONTRACT_JWLMCF_START_BLOCK:  CONTRACT_JWLMCF_START_BLOCK,
    CONTRACT_JWLMCF_MULTIPLIER: CONTRACT_JWLMCF_MULTIPLIER,
    CONTRACT_FILE_TKN: CONTRACT_FILE_TKN,
    CONTRACT_NAME_TKN: CONTRACT_NAME_TKN,
    CONTRACT_SYMBOL_TKN: CONTRACT_SYMBOL_TKN,
    CONTRACT_DECIMALS_TKN: CONTRACT_DECIMALS_TKN,
    CONTRACT_INITIAL_SUPPLY_DAO: CONTRACT_INITIAL_SUPPLY_DAO,
    CONTRACT_MAXIMUM_SUPPLY_DAO: CONTRACT_MAXIMUM_SUPPLY_DAO,
    CONTRACT_JWLMCF_ALLOCATION_POINT: CONTRACT_JWLMCF_ALLOCATION_POINT
  }

 module.exports = config;
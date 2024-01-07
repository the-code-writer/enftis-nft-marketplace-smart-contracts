import { ethers } from "hardhat";
import { config as dotEnvConfig } from "dotenv";

dotEnvConfig();

const LINKED_LIBRARY: string | undefined = process.env.LINKED_LIBRARY;

const ADDRESS_ZERO: string | undefined = process.env.ADDRESS_ZERO;

const CONTRACT_NAME: string | undefined = process.env.CONTRACT_NAME_DAO;
const CONTRACT_SYMBOL: string | undefined = process.env.CONTRACT_SYMBOL_DAO;
const CONTRACT_INITIAL_SUPPLY: string | undefined = process.env.CONTRACT_INITIAL_SUPPLY_DAO;
const CONTRACT_MAXIMUM_SUPPLY: string | undefined = process.env.CONTRACT_MAXIMUM_SUPPLY_DAO;
const CONTRACT_TOTAL_FUNDS: string | undefined = process.env.CONTRACT_TOTAL_FUNDS_DAO;
const CONTRACT_PETTY_FUNDS: string | undefined = process.env.CONTRACT_PETTY_FUNDS_DAO;

const CONTRACT_MINIMUM_DELAY: string | undefined = process.env.CONTRACT_MINIMUM_DELAY_DAO;
const CONTRACT_VOTING_DELAY: string | undefined = process.env.CONTRACT_VOTING_DELAY_DAO;
const CONTRACT_VOTING_PERIOD: string | undefined = process.env.CONTRACT_VOTING_PERIOD_DAO;
const CONTRACT_QUORUM_PERCENTAGE: string | undefined = process.env.CONTRACT_QUORUM_PERCENTAGE_DAO;
const CONTRACT_PROPOSAL_THRESHOLD: string | undefined = process.env.CONTRACT_PROPOSAL_THRESHOLD_DAO;

const CONTRACT_FILE_TKN: string | undefined = String(process.env.CONTRACT_FILE_TKN);
const CONTRACT_NAME_TKN: string | undefined = String(process.env.CONTRACT_NAME_TKN);
const CONTRACT_SYMBOL_TKN: string | undefined = String(process.env.CONTRACT_SYMBOL_TKN);
const CONTRACT_DECIMALS_TKN: number | undefined = parseInt(String(process.env.CONTRACT_DECIMALS_TKN));
const CONTRACT_INITIAL_SUPPLY_DAO: number | undefined = parseInt(String(process.env.CONTRACT_INITIAL_SUPPLY_DAO));
const CONTRACT_MAXIMUM_SUPPLY_DAO: number | undefined = parseInt(String(process.env.CONTRACT_MAXIMUM_SUPPLY_DAO));

  // Do not edit the lines below

  interface IConfig {
    CONTRACT_NAME: string | undefined;
    CONTRACT_SYMBOL: string | undefined;
    CONTRACT_INITIAL_SUPPLY: string | undefined;
    CONTRACT_MAXIMUM_SUPPLY:  string | undefined;
    CONTRACT_TOTAL_FUNDS:  string | undefined;
    CONTRACT_PETTY_FUNDS:  string | undefined;
    CONTRACT_MINIMUM_DELAY: string | undefined,
    CONTRACT_VOTING_DELAY: string | undefined,
    CONTRACT_VOTING_PERIOD: string | undefined,
    CONTRACT_QUORUM_PERCENTAGE: string | undefined,
    CONTRACT_PROPOSAL_THRESHOLD: string | undefined,
    LINKED_LIBRARY: string | undefined;
    ADDRESS_ZERO: string | undefined;
    CONTRACT_FILE_TKN: string | undefined;
    CONTRACT_NAME_TKN: string | undefined;
    CONTRACT_SYMBOL_TKN: string | undefined;
    CONTRACT_DECIMALS_TKN: number | undefined;
    CONTRACT_INITIAL_SUPPLY_DAO: number | undefined;
    CONTRACT_MAXIMUM_SUPPLY_DAO: number | undefined;
  }

  const config:IConfig = {
    CONTRACT_NAME: CONTRACT_NAME,
    CONTRACT_SYMBOL: CONTRACT_SYMBOL,
    CONTRACT_INITIAL_SUPPLY: CONTRACT_INITIAL_SUPPLY,
    CONTRACT_MAXIMUM_SUPPLY: CONTRACT_MAXIMUM_SUPPLY,
    CONTRACT_TOTAL_FUNDS: CONTRACT_TOTAL_FUNDS,
    CONTRACT_PETTY_FUNDS: CONTRACT_PETTY_FUNDS,
    CONTRACT_MINIMUM_DELAY: CONTRACT_MINIMUM_DELAY,
    CONTRACT_VOTING_DELAY: CONTRACT_VOTING_DELAY,
    CONTRACT_VOTING_PERIOD: CONTRACT_VOTING_PERIOD,
    CONTRACT_QUORUM_PERCENTAGE: CONTRACT_QUORUM_PERCENTAGE,
    CONTRACT_PROPOSAL_THRESHOLD: CONTRACT_PROPOSAL_THRESHOLD,
    LINKED_LIBRARY: LINKED_LIBRARY,
    ADDRESS_ZERO: ADDRESS_ZERO,
    CONTRACT_FILE_TKN: CONTRACT_FILE_TKN,
    CONTRACT_NAME_TKN: CONTRACT_NAME_TKN,
    CONTRACT_SYMBOL_TKN: CONTRACT_SYMBOL_TKN,
    CONTRACT_DECIMALS_TKN: CONTRACT_DECIMALS_TKN,
    CONTRACT_INITIAL_SUPPLY_DAO: CONTRACT_INITIAL_SUPPLY_DAO,
    CONTRACT_MAXIMUM_SUPPLY_DAO: CONTRACT_MAXIMUM_SUPPLY_DAO
  }

 module.exports = config;
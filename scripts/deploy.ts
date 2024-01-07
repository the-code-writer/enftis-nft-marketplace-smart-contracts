import { ethers } from "hardhat";
import { config as dotEnvConfig } from "dotenv";
const Snippets = require("./libs/Snippets");

dotEnvConfig();

async function main() {
  // This is just a convenience check
  if (typeof network !== "undefined" && network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  async (_: any, { ethers }: any) => {
    await ethers.provider.getBlockNumber().then((blockNumber: number) => {
      console.log("Current block number: " + blockNumber);
    });
  };

  const [deployer] = await ethers.getSigners();

  const CONTRACT_FILE: any = process.env.CONTRACT_FILE;

  const CONTRACT_PARAMS:any = require(`./contract-configs/${CONTRACT_FILE}Config.ts`)

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account Balance:", (await deployer.getBalance()).toString());

  console.log(
    "Deploy with the following arguments",
    CONTRACT_PARAMS.ABI_VALUES
  );

  const ContractLinkedLibrary = await ethers.getContractFactory(CONTRACT_PARAMS.LINKED_LIBRARY);
  const contractLinkedLibrary = await ContractLinkedLibrary.deploy();
  await contractLinkedLibrary.deployed();

  const SmartContract: any = await ethers.getContractFactory(
    CONTRACT_FILE,
    {
      libraries: {
        Snippets: contractLinkedLibrary.address,
      },
    }
  );

  const _smartContract = await SmartContract.deploy(
    CONTRACT_PARAMS.CONTRACT_NAME,
    CONTRACT_PARAMS.CONTRACT_SYMBOL,
    CONTRACT_PARAMS.ABI_ENCODED
  );

  await _smartContract.deployed();

  console.log(
    `\n\nSmartContract '${CONTRACT_PARAMS.CONTRACT_NAME} (${CONTRACT_PARAMS.CONTRACT_SYMBOL})' deployed! 
    \n\nCONTRACT:\n${
      _smartContract.address
    }
    \n\nABI_DATA:\n${
      CONTRACT_PARAMS.ABI_ENCODED
    }\n\n
    `
  );

  Snippets.saveFrontendFiles(_smartContract, CONTRACT_FILE);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(
    () => process.exit(0)
  )
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

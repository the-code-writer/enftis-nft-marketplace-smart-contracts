import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

const fs = require('fs');

let loggerSmartContractInstance: any;
let loggerSmartContractAddress:any;

describe("ERC00Logger", async function () {

    beforeEach(async () => {

        const { contractLogger, loggerAddress } = await loadFixture(deploySmartContract);

        loggerSmartContractInstance = contractLogger;

        loggerSmartContractAddress = loggerAddress;

    });

    const deploySmartContract = async (): Promise<{ contractLogger: any, loggerAddress :any}> => {

        const ContractLogger = await ethers.getContractFactory(process.env.LOGGER_LIBRARY);
        const contractLogger = await ContractLogger.deploy();
        await contractLogger.waitForDeployment();

        const loggerAddress: string = await contractLogger.getAddress();

        const targetDir: string = './test/txt/';

        fs.mkdirSync(targetDir, { recursive: true });

        fs.writeFileSync(`${targetDir}ERCLogger.txt`, loggerAddress);

        console.log("    Logger Contract : ", loggerAddress);

        return { contractLogger, loggerAddress }
    
    }

    describe("Deployment", async function () {

        it("Should deploy the contract successfully!", async function () {

            expect(await loggerSmartContractInstance.getAddress()).to.be.properAddress;

            expect(loggerSmartContractAddress).to.be.properAddress;

            expect(await loggerSmartContractInstance.getAddress()).to.be.equal(loggerSmartContractAddress);

            const targetDir: string = './test/txt/';

            const loggerAddressBuffer: any = fs.readFileSync(`${targetDir}ERCLogger.txt`);

            const loggerAddress: string = loggerAddressBuffer.toString();

            expect(loggerAddress).to.be.properAddress;

            expect(await loggerSmartContractInstance.getAddress()).to.be.equal(loggerAddress);

        });

    });

    await new Promise(res => setTimeout(() => res(null), 5000));

});

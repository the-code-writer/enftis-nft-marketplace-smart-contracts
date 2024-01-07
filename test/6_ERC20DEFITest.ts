import {loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import {expect} from "chai";
import {ethers} from "hardhat";
import {
    moveBlocks, moveTime
} from "../scripts/helpers/deployer-helper";
import { MaxUint256 } from "ethers";
import { getAddress } from 'viem';

const fs = require('fs');

const Snippets = require("../scripts/libs/Snippets");

const provider: any = ethers.getDefaultProvider();

const targetDir: string = './test/txt/';

fs.mkdirSync(targetDir, {recursive: true});

const CHAIN_IDS: Array<any> = process.env.CHAIN_IDS !== null ? String(process.env.CHAIN_IDS).split(",") : [];

export const poolDb = [
    {
        'lptoken': 'JWLX',
        'rwdtoken': 'JWLX',
    },
]

describe(`${process.env.CONTRACT_FILE_MCF}`, async function () {
    let ERCJWLXTKNSmartContract: any;
    let ERCJouelMasterChefSmartContract: any;

    let deployerWallet:any, aliceWallet:any, bobWallet:any, charlieWallet:any, donWallet:any, args:any;

    let deployerWalletAccount:any;
    let aliceWalletAccount:any;
    let bobWalletAccount:any;
    let charlieWalletAccount:any;
    let donWalletAccount:any;

    beforeEach(async () => {

        const { smartContract, governanceTokenSmartContract, _deployerWallet, _aliceWallet, _bobWallet, _charlieWallet, _donWallet, _args } = await loadFixture(deploySmartContract);

        ERCJouelMasterChefSmartContract = smartContract;
        ERCJWLXTKNSmartContract = governanceTokenSmartContract;
        deployerWallet = _deployerWallet;
        aliceWallet = _aliceWallet;
        bobWallet = _bobWallet;
        charlieWallet = _charlieWallet;
        donWallet = _donWallet;
        args = _args;

        deployerWalletAccount = await ERCJouelMasterChefSmartContract.connect(deployerWallet);
        aliceWalletAccount = await ERCJouelMasterChefSmartContract.connect(aliceWallet);
        bobWalletAccount = await ERCJouelMasterChefSmartContract.connect(bobWallet);
        charlieWalletAccount = await ERCJouelMasterChefSmartContract.connect(charlieWallet);
        donWalletAccount = await ERCJouelMasterChefSmartContract.connect(donWallet);

    });

    const deploySmartContract = async (): Promise<any> => {

        const [_deployerWallet, _aliceWallet, _bobWallet, _charlieWallet, _donWallet] = await ethers.getSigners();

        //console.log("      💰  Deploying contracts with the account:", deployerWallet.address);

        //console.log("      💴  Account balance:", (await provider.getBalance(deployerWallet.address)).toString());

        const CONTRACT_FILE: any = process.env.CONTRACT_FILE_MCF;

        const CONTRACT_PARAMS: any = require(`../scripts/contract-configs/${CONTRACT_FILE}.Config.ts`)

        // console.log( "Deploy with the following arguments", CONTRACT_PARAMS );

        // ++++++++++++

        //JWLXTKN
        const ERCJWLXTKNSmartContractAddressBuffer: any = fs.readFileSync(`${targetDir}JWLXTKN.txt`);

        const ERCJWLXTKNSmartContractAddress: string = ERCJWLXTKNSmartContractAddressBuffer.toString();

        const ERCJWLXTKNSmartContractABIBuffer: any = fs.readFileSync(`./artifacts/contracts/JWLXTKN.sol/JWLXTKN.json`);

        const ERCJWLXTKNSmartContractABI: string = ERCJWLXTKNSmartContractABIBuffer.toString();

        const ERCJWLXTKNSmartContractABIObject: any = JSON.parse(ERCJWLXTKNSmartContractABI);

        const ercJWLXTKNSmartContract = new ethers.Contract(ERCJWLXTKNSmartContractAddress, ERCJWLXTKNSmartContractABIObject.abi, provider);

        // Deploy token

        const ercJouelMasterChefSmartContract: any = await ethers.getContractFactory(CONTRACT_FILE);

        console.log([
            ERCJWLXTKNSmartContractAddress,
            await ercJWLXTKNSmartContract.getAddress(),
            CONTRACT_PARAMS.CONTRACT_JWLMCF_TREASURY_ACCOUNT,
            Snippets.ethersToWei(CONTRACT_PARAMS.CONTRACT_JWLTKN_PER_BLOCK),
            CONTRACT_PARAMS.CONTRACT_JWLMCF_START_BLOCK,
            CONTRACT_PARAMS.CONTRACT_JWLMCF_MULTIPLIER,
            CONTRACT_PARAMS.CONTRACT_JWLMCF_ALLOCATION_POINT
        ]);

        ERCJouelMasterChefSmartContract = await ercJouelMasterChefSmartContract.deploy(
            await ercJWLXTKNSmartContract.getAddress(),
            CONTRACT_PARAMS.CONTRACT_JWLMCF_TREASURY_ACCOUNT,
            Snippets.ethersToWei(CONTRACT_PARAMS.CONTRACT_JWLTKN_PER_BLOCK),
            CONTRACT_PARAMS.CONTRACT_JWLMCF_START_BLOCK,
            CONTRACT_PARAMS.CONTRACT_JWLMCF_MULTIPLIER,
            CONTRACT_PARAMS.CONTRACT_JWLMCF_ALLOCATION_POINT
        );

        await ERCJouelMasterChefSmartContract.waitForDeployment();

        CHAIN_IDS.map(async (chain: any) => {

            const path: any = `../frontend/src/_services/providers/data/context/libs/artifacts/${chain}`;

            if (!fs.existsSync(path)) {
                fs.mkdirSync(path, { recursive: true });
            }

            // Addresses

            const smartContractAddress: string = await ERCJouelMasterChefSmartContract.getAddress();

            fs.writeFileSync(
                `${path}/ERCDEFIFactoryAddress.json`,
                `{ "address": "${smartContractAddress}" }`
            );

            // Contracts

            fs.copyFile('./artifacts/contracts/ERCDEFIFactory.sol/ERCDEFIFactory.json', `${path}/ERCDEFIFactoryContract.json`, (err: any) => {
                if (err) throw err;
                console.log('Artifact file [ ERCDEFIFactory + Address ] copied successfully!');
            });

        })

        ERCJouelMasterChefSmartContract.on(
            "*",
            (event: any) => {

                //console.log(`EVENT: ERCJouelMasterChefSmartContract\n`, event.event, event.args, event.eventSignature);

            }
        )

        // ++++++++++++

        const _args:any = {
            contractGVNAddress: ERCJWLXTKNSmartContractAddress,
            contractGVNFile: CONTRACT_PARAMS.CONTRACT_FILE_TKN,
            contractGVNName: CONTRACT_PARAMS.CONTRACT_NAME_TKN,
            contractGVNSymbol: CONTRACT_PARAMS.CONTRACT_SYMBOL_TKN,
            contractGVNDecimals: CONTRACT_PARAMS.CONTRACT_DECIMALS_TKN,
            contractGVNInitialSupply: CONTRACT_PARAMS.CONTRACT_INITIAL_SUPPLY_DAO,
            contractGVNTotalSupply: CONTRACT_PARAMS.CONTRACT_MAXIMUM_SUPPLY_DAO,
            contractTreasuryAccount: CONTRACT_PARAMS.CONTRACT_JWLMCF_TREASURY_ACCOUNT,
            contractTokensPerBlock: CONTRACT_PARAMS.CONTRACT_JWLTKN_PER_BLOCK,
            contractStartBlock: CONTRACT_PARAMS.CONTRACT_JWLMCF_START_BLOCK,
            contractMultiplier: CONTRACT_PARAMS.CONTRACT_JWLMCF_MULTIPLIER,
            contractAllocPoint: CONTRACT_PARAMS.CONTRACT_JWLMCF_ALLOCATION_POINT,
            contractABI: CONTRACT_PARAMS.ABI_VALUES,
            contractENC: CONTRACT_PARAMS.ABI_ENCODED,
            contractParams: CONTRACT_PARAMS
        }

        console.log("  Arguments ...", _args);

        return { smartContract: ERCJouelMasterChefSmartContract, governanceTokenSmartContract: ercJWLXTKNSmartContract, _deployerWallet, _aliceWallet, _bobWallet, _charlieWallet, _donWallet, _args };

    }

    describe("Deployment", () => {

        it("Should deploy the contract successfully!", async function () {

            //console.log("  Deploying Contract ...", await ERCGovernanceDAOSmartContract.getAddress());

            expect(await ERCJouelMasterChefSmartContract.getAddress()).to.be.properAddress;

        });

    });

    describe("Jouel Masterchef Contract", () => {

        describe("JWLXTKN Governance Token", () => {

            it("Has an address", async () => {

                const address: any = await ERCJWLXTKNSmartContract.getAddress();

                //console.log(address);

                expect(address).to.equal(args.contractGVNAddress);

            });

            it("Has a name", async () => {

                const name: any = await ERCJWLXTKNSmartContract.connect(deployerWallet).name();

                //console.log(name);

                expect(name).to.equal(args.contractGVNName);

            });

            it("Has a symbol", async () => {

                const symbol: any = await ERCJWLXTKNSmartContract.connect(deployerWallet).symbol();

                //console.log(symbol);

                expect(symbol).to.equal(args.contractGVNSymbol);

            });

            it("Has 18 decimals", async () => {

                const decimals: bigint = await ERCJWLXTKNSmartContract.connect(deployerWallet).decimals();

                //console.log(decimals);

                expect(decimals).to.equal(BigInt(args.contractGVNDecimals));

            });

            it("Has a total supply", async () => {

                const totalSupply: bigint = await ERCJWLXTKNSmartContract.connect(deployerWallet).totalSupply();

                //console.log(totalSupply, args);

                expect(totalSupply).to.equal(Snippets.ethersToWei(args.contractGVNInitialSupply));

            });

            it("Has its own balance in JWLTKN", async () => {

                const balance: bigint = await ERCJWLXTKNSmartContract.connect(deployerWallet).balanceOf(await ERCJWLXTKNSmartContract.getAddress());

                //console.log(balance);

                expect(balance).to.equal(BigInt(0));

            });

            it("Shows a balance of a accounts", async () => {

                let balance: bigint = await ERCJWLXTKNSmartContract.connect(deployerWallet).balanceOf(deployerWallet.address);

                const amountForEachVoter:number = Math.floor(args.contractGVNInitialSupply/10/6);

                //console.log(balance, amountForEachVoter);

                let bal:any = Snippets.ethersToWei((args.contractGVNInitialSupply - amountForEachVoter*6));

                expect(balance).to.equal(bal);

                balance = await ERCJWLXTKNSmartContract.connect(deployerWallet).balanceOf(aliceWallet.address);

                //console.log(balance);

                expect(balance).to.equal(0);

                balance = await ERCJWLXTKNSmartContract.connect(deployerWallet).balanceOf(bobWallet.address);

                //console.log(balance);

                expect(balance).to.equal(0);

                balance = await ERCJWLXTKNSmartContract.connect(deployerWallet).balanceOf(charlieWallet.address);

                //console.log(bal, balance);

                expect(balance).to.equal(Snippets.ethersToWei(amountForEachVoter*2));

                balance = await ERCJWLXTKNSmartContract.connect(deployerWallet).balanceOf(donWallet.address);

                //console.log(bal, balance);

                expect(balance).to.equal(Snippets.ethersToWei(amountForEachVoter));

            });

            it("Transfers tokens", async () => {

                const amountForEachVoter:number = Math.floor(args.contractGVNInitialSupply/10/6);

                let balance: bigint = await ERCJWLXTKNSmartContract.connect(deployerWallet).balanceOf(deployerWallet.address);

                let balOfDeployerWallet:bigint = Snippets.ethersToWei((args.contractGVNInitialSupply - amountForEachVoter*6));

                //console.log(balance, amountForEachVoter);

                await expect(ERCJWLXTKNSmartContract.connect(deployerWallet).transfer(
                    aliceWallet.address, 
                    balOfDeployerWallet*BigInt(2)
                ))
                .to.be.revertedWithCustomError(ERCJWLXTKNSmartContract, "ERC20InsufficientBalance")
                .withArgs(
                    deployerWallet.address, 
                    balOfDeployerWallet, 
                    balOfDeployerWallet*BigInt(2)
                );

                await ERCJWLXTKNSmartContract.connect(deployerWallet).transfer(
                    aliceWallet.address, 
                    balOfDeployerWallet/BigInt(2)
                )

                balance = await ERCJWLXTKNSmartContract.connect(deployerWallet).balanceOf(aliceWallet.address);

                expect(balance).to.equal(balOfDeployerWallet/BigInt(2));

                balance = await ERCJWLXTKNSmartContract.connect(deployerWallet).balanceOf(deployerWallet.address);

                expect(balance).to.equal(balOfDeployerWallet-balOfDeployerWallet/BigInt(2));

            });

            it("Approves tokens to be spent", async () => {

                const amountForEachVoter:number = Math.floor(args.contractGVNInitialSupply/10/6);

                let balance: bigint = await ERCJWLXTKNSmartContract.connect(deployerWallet).balanceOf(deployerWallet.address);

                let bal:bigint = Snippets.ethersToWei((args.contractGVNInitialSupply - amountForEachVoter*6));

                expect(balance).to.equal(bal);

                balance = await ERCJWLXTKNSmartContract.connect(deployerWallet).balanceOf(aliceWallet.address);

                expect(balance).to.equal(0);

                await expect(ERCJWLXTKNSmartContract.connect(aliceWallet).transfer(
                    bobWallet.address, 
                    Snippets.ethersToWei(1)
                ))
                .to.be.revertedWithCustomError(ERCJWLXTKNSmartContract, "ERC20InsufficientBalance")
                .withArgs(
                    aliceWallet.address, 
                    0, 
                    Snippets.ethersToWei(1)
                );

                await ERCJWLXTKNSmartContract.connect(deployerWallet).transfer(
                    aliceWallet.address, 
                    (bal/BigInt(3))
                )

                balance = await ERCJWLXTKNSmartContract.connect(deployerWallet).balanceOf(aliceWallet.address);

                bal = Snippets.ethersToWei((args.contractGVNInitialSupply - amountForEachVoter*6))/BigInt(3);

                expect(balance).to.equal(bal);

                balance = await ERCJWLXTKNSmartContract.connect(deployerWallet).balanceOf(deployerWallet.address);

                const originalDeployerWalletBal:bigint = Snippets.ethersToWei((args.contractGVNInitialSupply - amountForEachVoter*6));

                bal = originalDeployerWalletBal - originalDeployerWalletBal/BigInt(3);

                expect(balance).to.equal(bal);

                await expect(ERCJWLXTKNSmartContract.connect(aliceWallet).transferFrom(
                    deployerWallet,
                    bobWallet.address, 
                    Snippets.ethersToWei(1)
                ))
                .to.be.revertedWithCustomError(ERCJWLXTKNSmartContract, "ERC20InsufficientAllowance")
                .withArgs(
                    aliceWallet.address, 
                    0, 
                    Snippets.ethersToWei(1)
                );

                await ERCJWLXTKNSmartContract.connect(deployerWallet).approve(
                    aliceWallet.address, 
                    Snippets.ethersToWei(1)
                )

                await ERCJWLXTKNSmartContract.connect(aliceWallet).transferFrom(
                    deployerWallet,
                    bobWallet.address, 
                    Snippets.ethersToWei(1)
                )

                // Deployer - Less 1 token
                balance = await ERCJWLXTKNSmartContract.connect(deployerWallet).balanceOf(deployerWallet.address);

                bal = bal - Snippets.ethersToWei(1)

                expect(balance).to.equal(bal);

                // Alice - No change
                balance = await ERCJWLXTKNSmartContract.connect(deployerWallet).balanceOf(aliceWallet.address);

                bal = Snippets.ethersToWei((args.contractGVNInitialSupply - amountForEachVoter*6))/BigInt(3);

                expect(balance).to.equal(bal);

                // Bob - More 1 token
                balance = await ERCJWLXTKNSmartContract.connect(deployerWallet).balanceOf(bobWallet.address);

                expect(balance).to.equal(Snippets.ethersToWei(1));

            });

            it("Mint additional tokens", async () => {

                const amountForEachVoter:number = Math.floor(args.contractGVNInitialSupply/10/6);

                let balance: bigint = await ERCJWLXTKNSmartContract.connect(deployerWallet).balanceOf(deployerWallet.address);

                let bal:bigint = Snippets.ethersToWei((args.contractGVNInitialSupply - amountForEachVoter*6));

                expect(balance).to.equal(bal);

                await expect(ERCJWLXTKNSmartContract.connect(aliceWallet).mint(
                    bobWallet.address, 
                    Snippets.ethersToWei(1)
                ))
                .to.be.revertedWithCustomError(ERCJWLXTKNSmartContract, "AccessControlUnauthorizedAccount");

                balance = await ERCJWLXTKNSmartContract.connect(deployerWallet).balanceOf(aliceWallet.address);

                expect(balance).to.equal(0);

                let overflowSupply:bigint = Snippets.ethersToWei((args.contractGVNTotalSupply + 1));

                await expect(ERCJWLXTKNSmartContract.connect(deployerWallet).mint(
                    aliceWallet.address, 
                    0
                ))
                .to.be.revertedWith("INVALID_AMOUNT");

                await expect(ERCJWLXTKNSmartContract.connect(deployerWallet).mint(
                    aliceWallet.address, 
                    overflowSupply
                ))
                .to.be.revertedWithCustomError(ERCJWLXTKNSmartContract, "ERC20ExceededCap")
                .withArgs(
                    overflowSupply + await ERCJWLXTKNSmartContract.connect(deployerWallet).totalSupply(),
                    Snippets.ethersToWei(args.contractGVNTotalSupply)
                )

                await expect(ERCJWLXTKNSmartContract.connect(deployerWallet).mint(
                    aliceWallet.address, 
                    MaxUint256 
                ))
                .to.be.revertedWith("TOKEN_SUPPLY_OVERFLOW");

                await ERCJWLXTKNSmartContract.connect(deployerWallet).mint(
                    aliceWallet.address, 
                    Snippets.ethersToWei(100)
                )

                balance = await ERCJWLXTKNSmartContract.connect(deployerWallet).balanceOf(aliceWallet.address);

                expect(balance).to.equal(Snippets.ethersToWei(100));

                balance = await ERCJWLXTKNSmartContract.connect(deployerWallet).balanceOf(deployerWallet.address);

                expect(balance).to.equal(bal);

                const newTotalSupply: bigint = await ERCJWLXTKNSmartContract.connect(deployerWallet).totalSupply();

                //console.log(newTotalSupply);

                expect(newTotalSupply).to.equal(Snippets.ethersToWei(args.contractGVNInitialSupply) + Snippets.ethersToWei(100));

            });

            it("Burn tokens", async () => {

                const amountForEachVoter:number = Math.floor(args.contractGVNInitialSupply/10/6);

                let balance: bigint = await ERCJWLXTKNSmartContract.connect(deployerWallet).balanceOf(deployerWallet.address);

                let bal:bigint = Snippets.ethersToWei((args.contractGVNInitialSupply - amountForEachVoter*6));

                expect(balance).to.equal(bal);

                balance = await ERCJWLXTKNSmartContract.connect(deployerWallet).balanceOf(aliceWallet.address);

                expect(balance).to.equal(0);

                await expect(ERCJWLXTKNSmartContract.connect(aliceWallet).burn(
                    Snippets.ethersToWei(1)
                ))
                .to.be.revertedWithCustomError(ERCJWLXTKNSmartContract, "ERC20InsufficientBalance");

                await ERCJWLXTKNSmartContract.connect(deployerWallet).burn(
                    Snippets.ethersToWei(50)
                )

                balance = await ERCJWLXTKNSmartContract.connect(deployerWallet).balanceOf(deployerWallet.address);

                expect(balance).to.equal(bal - Snippets.ethersToWei(50));

                const newTotalSupply: bigint = await ERCJWLXTKNSmartContract.connect(deployerWallet).totalSupply();

                //console.log(newTotalSupply);

                expect(newTotalSupply).to.equal(Snippets.ethersToWei(args.contractGVNInitialSupply) - Snippets.ethersToWei(50));

            });

        });

        describe("Staking Contract", () => {

            it("Has pools", async () => {

                const name: any = await ERCJouelMasterChefSmartContract.connect(deployerWallet).poolLength();

                //console.log(name);

                expect(name).to.equal(1);

            });

            it("Retrieve initial variables", async () => {

                const developerTreasuryWalletAccount: any = await ERCJouelMasterChefSmartContract.connect(deployerWallet).developerTreasuryWalletAccount();

                expect(developerTreasuryWalletAccount).to.equal(args.contractTreasuryAccount);

                const jouelTokenRewardPerBlock: any = await ERCJouelMasterChefSmartContract.connect(deployerWallet).jouelTokenRewardPerBlock();

                expect(jouelTokenRewardPerBlock).to.equal(Snippets.ethersToWei(args.contractTokensPerBlock));

                const totalAllocation: any = await ERCJouelMasterChefSmartContract.connect(deployerWallet).totalAllocation();

                expect(totalAllocation).to.equal(args.contractAllocPoint);

                const startBlock: any = await ERCJouelMasterChefSmartContract.connect(deployerWallet).startBlock();

                expect(startBlock).to.equal(args.contractStartBlock);

                const BONUS_MULTIPLIER: any = await ERCJouelMasterChefSmartContract.connect(deployerWallet).BONUS_MULTIPLIER();

                expect(BONUS_MULTIPLIER).to.equal(args.contractMultiplier);

            });

            it("Retrieve available pools", async () => {

                const pools: any = await ERCJouelMasterChefSmartContract.connect(deployerWallet).getPools();

                expect(pools.length).to.equal(1);

                const [IJWLX, allocPoint, lastRewardBlock, rewardTokenPerShare]:any = pools[0];

                // struct PoolInfo {
                //     IJWLX lpToken;
                //     uint256 allocPoint;
                //     uint256 lastRewardBlock;
                //     uint256 rewardTokenPerShare;
                // }

                // const _args:any = {
                //     contractGVNAddress: ERCJWLXTKNSmartContractAddress,
                //     contractGVNFile: CONTRACT_PARAMS.CONTRACT_FILE_TKN,
                //     contractGVNName: CONTRACT_PARAMS.CONTRACT_NAME_TKN,
                //     contractGVNSymbol: CONTRACT_PARAMS.CONTRACT_SYMBOL_TKN,
                //     contractGVNDecimals: CONTRACT_PARAMS.CONTRACT_DECIMALS_TKN,
                //     contractGVNInitialSupply: CONTRACT_PARAMS.CONTRACT_INITIAL_SUPPLY_DAO,
                //     contractGVNTotalSupply: CONTRACT_PARAMS.CONTRACT_MAXIMUM_SUPPLY_DAO,
                //     contractTreasuryAccount: CONTRACT_PARAMS.CONTRACT_JWLMCF_TREASURY_ACCOUNT,
                //     contractTokensPerBlock: CONTRACT_PARAMS.CONTRACT_JWLTKN_PER_BLOCK,
                //     contractStartBlock: CONTRACT_PARAMS.CONTRACT_JWLMCF_START_BLOCK,
                //     contractMultiplier: CONTRACT_PARAMS.CONTRACT_JWLMCF_MULTIPLIER,
                //     contractAllocPoint: CONTRACT_PARAMS.CONTRACT_JWLMCF_ALLOCATION_POINT,
                //     contractABI: CONTRACT_PARAMS.ABI_VALUES,
                //     contractENC: CONTRACT_PARAMS.ABI_ENCODED,
                //     contractParams: CONTRACT_PARAMS
                // }

                // CONTRACT_JWLMCF_TREASURY_ACCOUNT=0x27f76aacf0F79Dc01eA487C9d75ba81496cA5cf6
                // CONTRACT_JWLTKN_PER_BLOCK=10000
                // CONTRACT_JWLMCF_START_BLOCK=345
                // CONTRACT_JWLMCF_MULTIPLIER=1
                // CONTRACT_JWLMCF_ALLOCATION_POINT=1000

                //[ '0x9BcC604D4381C5b0Ad12Ff3Bf32bEdE063416BC7', 1000n, 345n, 0n ]

                expect(IJWLX).to.equal(await ERCJWLXTKNSmartContract.getAddress());
                expect(allocPoint).to.equal(args.contractAllocPoint);
                expect(lastRewardBlock).to.equal(args.contractStartBlock);
                expect(rewardTokenPerShare).to.equal(0);

            });

            it("Stake tokens into the default pool : index:0", async () => {

                const amountForEachVoter:number = Math.floor(args.contractGVNInitialSupply/10/6);

                let balance: bigint = await ERCJWLXTKNSmartContract.connect(deployerWallet).balanceOf(deployerWallet.address);

                let bal:bigint = Snippets.ethersToWei((args.contractGVNInitialSupply - amountForEachVoter*6));

                expect(balance).to.equal(bal);

                const stakeAmount:bigint = Snippets.ethersToWei(1); //bal/BigInt(3);

                console.log("Staked Tokens: ", stakeAmount)

                /// 1. Approve Masterchef Contract to spend your tokens

                await ERCJWLXTKNSmartContract.connect(deployerWallet).approve(
                    await ERCJouelMasterChefSmartContract.getAddress(), 
                    stakeAmount * BigInt(2)
                )

                await ERCJWLXTKNSmartContract.connect(deployerWallet).grantMinterRole(
                    await ERCJouelMasterChefSmartContract.getAddress()
                )

                await ERCJWLXTKNSmartContract.connect(deployerWallet).grantManagerRole(
                    await ERCJouelMasterChefSmartContract.getAddress()
                )

                /// 2. Stake your token, abount 33% of wallet balance

                /// 2.a Get current startBlock

                let startBlock:number = await ERCJouelMasterChefSmartContract.connect(deployerWallet).startBlock();

                console.log("Current startBlock number: ", startBlock)

                expect(startBlock).to.equal(args.contractStartBlock);

                let latestBlock:any = await ethers.provider.getBlock("latest");
                let blockNumber:number = latestBlock?.number || 0;

                console.log("Current block number: ", blockNumber);

                /// 2.b Update startBlock to current block plus 5

                if(blockNumber < args.contractStartBlock){

                    await moveBlocks(args.contractStartBlock);

                }

                console.log("Updating startBlock .... ");

                latestBlock = await ethers.provider.getBlock("latest");
                blockNumber = latestBlock?.number || 0;

                console.log("Updated block number: ", blockNumber);

                await ERCJouelMasterChefSmartContract.connect(deployerWallet).updateStartBlock(blockNumber);

                ///
                
                startBlock = await ERCJouelMasterChefSmartContract.connect(deployerWallet).startBlock();

                console.log("New startBlock number: ", startBlock)

                expect(startBlock).to.equal(blockNumber);

                latestBlock = await ethers.provider.getBlock("latest");
                blockNumber = latestBlock?.number || 0;

                console.log("New block number after update: ", blockNumber);

                /// 2.c Do stake tokens

                await ERCJouelMasterChefSmartContract.connect(deployerWallet).stake(
                    0,
                    stakeAmount
                );

                let deployerBalanceAfterStaking: bigint = await ERCJWLXTKNSmartContract.connect(deployerWallet).balanceOf(deployerWallet.address);

                expect(deployerBalanceAfterStaking).to.equal(bal - stakeAmount);

                let masterchefSmartContractBalanceAfterStaking: bigint = await ERCJWLXTKNSmartContract.connect(deployerWallet).balanceOf(await ERCJouelMasterChefSmartContract.getAddress());

                expect(masterchefSmartContractBalanceAfterStaking).to.equal(stakeAmount);

                console.log("Mass update pools...");

                await ERCJouelMasterChefSmartContract.connect(deployerWallet).massUpdatePools();

                console.log("Move to 10 more blocks...");

                // Move 100 blocks
                await moveBlocks(10);

                latestBlock = await ethers.provider.getBlock("latest");
                blockNumber = latestBlock?.number || 0;

                console.log("New block number after some 10 more blocks: ", blockNumber);

                console.log("Get user pending reward ...");

                ERCJouelMasterChefSmartContract.on(
                    "PendingReward",
                    async (...event: any) => {

                        const [
                            currentBlock,
                            poolLastRewardBlock,
                            lpToken,
                            reward,
                            userAmount,
                            rewardPerSare,
                            userPendingReward
                        ] = event;

                        let balanceDeployer: bigint = await ERCJWLXTKNSmartContract.connect(deployerWallet).balanceOf(deployerWallet.address);

                        let balanceMC: bigint = await ERCJWLXTKNSmartContract.connect(deployerWallet).balanceOf(await ERCJouelMasterChefSmartContract.getAddress());

                        let balanceDeveloper: bigint = await ERCJWLXTKNSmartContract.connect(deployerWallet).balanceOf('0x27f76aacf0F79Dc01eA487C9d75ba81496cA5cf6');

                        let totalSupply: bigint = await ERCJWLXTKNSmartContract.connect(deployerWallet).totalSupply();

                        console.log(
                            `EVENT: ERCJouelMasterChefSmartContract\n`,
                            {currentBlock,
                            poolLastRewardBlock,
                            lpToken,
                            reward,
                            userAmount,
                            rewardPerSare,
                            userPendingReward,
                            balanceDeployer,
                            balanceDeveloper,
                            balanceMC,
                            totalSupply}
                        );

                    }
                )

                await moveBlocks(9);

                let pendingReward:any = await ERCJouelMasterChefSmartContract.connect(deployerWallet).pendingReward(
                    0,
                    deployerWallet.address
                );

                await pendingReward.wait(1);

                await moveBlocks(9);

                pendingReward = await ERCJouelMasterChefSmartContract.connect(deployerWallet).pendingReward(
                    0,
                    deployerWallet.address
                );

                await pendingReward.wait(1);

                await moveBlocks(9);

                pendingReward = await ERCJouelMasterChefSmartContract.connect(deployerWallet).pendingReward(
                    0,
                    deployerWallet.address
                );

                await pendingReward.wait(1);

                await moveBlocks(9);

                pendingReward = await ERCJouelMasterChefSmartContract.connect(deployerWallet).pendingReward(
                    0,
                    deployerWallet.address
                );

                await pendingReward.wait(1);

                await moveBlocks(9);

                pendingReward = await ERCJouelMasterChefSmartContract.connect(deployerWallet).pendingReward(
                    0,
                    deployerWallet.address
                );

                await pendingReward.wait(1);

                await moveBlocks(5);

                await ERCJouelMasterChefSmartContract.connect(deployerWallet).stake(
                    0, 
                    stakeAmount/BigInt(3)
                )

                await moveBlocks(3);

                pendingReward = await ERCJouelMasterChefSmartContract.connect(deployerWallet).pendingReward(
                    0,
                    deployerWallet.address
                );

                await pendingReward.wait(1);

                await moveBlocks(109);

                pendingReward = await ERCJouelMasterChefSmartContract.connect(deployerWallet).pendingReward(
                    0,
                    deployerWallet.address
                );

                await pendingReward.wait(1);

                await moveBlocks(1000);

                pendingReward = await ERCJouelMasterChefSmartContract.connect(deployerWallet).pendingReward(
                    0,
                    deployerWallet.address
                );

                await pendingReward.wait(1);

            });

        });

        describe("Unstaking", () => {

            it("Has a name", async () => {

                const name: any = await ERCJWLXTKNSmartContract.connect(deployerWallet).name();

                //console.log(name);

                expect(name).to.equal(args.contractGVNName);

            });

        });

        describe("Autocompound", () => {

            it("Has a name", async () => {

                const name: any = await ERCJWLXTKNSmartContract.connect(deployerWallet).name();

                //console.log(name);

                expect(name).to.equal(args.contractGVNName);

            });

        });

    });

    await new Promise(res => setTimeout(() => res(null), 5000));

});

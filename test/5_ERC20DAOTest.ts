import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { castVotes, delegateAccounts, makeProposal, queueProposal, executeProposal, moveTime } from "../scripts/helpers/deployer-helper";

const fs = require('fs');

const Snippets = require("../scripts/libs/Snippets");

const CHAIN_IDS:Array<any> = process.env.CHAIN_IDS !== null ? String(process.env.CHAIN_IDS).split(",") : [];

describe(`${process.env.CONTRACT_FILE_DAO}`, async function () {

    let ERCGovernanceTokenSmartContract:any;
    let ERCTimelockSmartContract:any;
    let ERCTreasurySmartContract:any;

    let ERCGovernanceDAOSmartContract:any;

    let deployerWallet:any,
        executorWallet:any, 
        proposerWallet:any, 
        voter1Wallet:any, 
        voter2Wallet:any, 
        voter3Wallet:any, 
        voter4Wallet:any, 
        voter5Wallet:any,
        contractArgs:any;

    beforeEach( async () => {

        await loadFixture(deploySmartContract);
        
    });

    const deploySmartContract = async (): Promise<any> => {

        const [ _deployer, _executor, _proposer, _voter1, _voter2, _voter3, _voter4, _voter5 ] = await ethers.getSigners();
        
        deployerWallet = _deployer;
        executorWallet = _executor;
        proposerWallet = _proposer;
        voter1Wallet = _voter1;
        voter2Wallet = _voter2;
        voter3Wallet = _voter3;
        voter4Wallet = _voter4;
        voter5Wallet = _voter5;
        
        //console.log("      💰  Deploying contracts with the account:", deployerWallet.address);

        //console.log("      💴  Account balance:", (await provider.getBalance(deployerWallet.address)).toString());

        const CONTRACT_FILE: any = process.env.CONTRACT_FILE_DAO;
        const CONTRACT_FILE_TKN: any = process.env.CONTRACT_FILE_TKN;
        const CONTRACT_FILE_TIMELOCK: any = process.env.CONTRACT_FILE_TIMELOCK;
        const CONTRACT_FILE_TREASURY: any = process.env.CONTRACT_FILE_TREASURY;

        const CONTRACT_PARAMS: any = require(`../scripts/contract-configs/${CONTRACT_FILE}.Config.ts`)

        // console.log( "Deploy with the following arguments", CONTRACT_PARAMS );

        // ++++++++++++

        // Deploy token

        const ercGovernanceTokenSmartContract:any = await ethers.getContractFactory(CONTRACT_FILE_TKN);
        ERCGovernanceTokenSmartContract = await ercGovernanceTokenSmartContract.deploy(
            CONTRACT_PARAMS.CONTRACT_NAME_TKN, 
            CONTRACT_PARAMS.CONTRACT_SYMBOL_TKN, 
            Snippets.ethersToWei(CONTRACT_PARAMS.CONTRACT_INITIAL_SUPPLY_DAO),
            Snippets.ethersToWei(CONTRACT_PARAMS.CONTRACT_MAXIMUM_SUPPLY_DAO),
            deployerWallet.address
        );

        await ERCGovernanceTokenSmartContract.waitForDeployment();

        const ERCGovernanceTokenSmartContractAddress:string = await ERCGovernanceTokenSmartContract.getAddress();

        const targetDir:string = './test/txt/';

        fs.mkdirSync(targetDir, { recursive: true });

        fs.writeFileSync(`${targetDir}JWLXTKN.txt`, ERCGovernanceTokenSmartContractAddress);

        CHAIN_IDS.map(async (chain: any) => {

            const path: any = `../frontend/src/_services/providers/data/context/libs/artifacts/${chain}`;

            if (!fs.existsSync(path)) {
                fs.mkdirSync(path, { recursive: true });
            }

            // Addresses

            const smartContractAddress: string = await ERCGovernanceTokenSmartContract.getAddress();

            fs.writeFileSync(
                `${path}/JWLXTKNAddress.json`,
                `{ "address": "${smartContractAddress}" }`
            );

            // Contracts

            fs.copyFile('./artifacts/contracts/JWLXTKN.sol/JWLXTKN.json', `${path}/JWLXTKNContract.json`, (err: any) => {
                if (err) throw err;
                console.log('Artifact file [ JWLXTKN + Address ] copied successfully!');
            });

        })

        ERCGovernanceTokenSmartContract.on(
            "*",
            (event:any) => {
                ////console.log(`EVENT: ERCGovernanceTokenSmartContract\n`, event.event, event.args, event.eventSignature)
            }
        )

        /* console.log(`Contract deployed : GovernanceTokenSmartContract :`, await ERCGovernanceTokenSmartContract.getAddress(), 
            [
                CONTRACT_PARAMS.CONTRACT_NAME, 
                CONTRACT_PARAMS.CONTRACT_SYMBOL, 
                CONTRACT_PARAMS.CONTRACT_INITIAL_SUPPLY,
                CONTRACT_PARAMS.CONTRACT_MAXIMUM_SUPPLY,
            ]
        ); */

        const governanaceTokenSupply:number = Math.floor(parseInt(CONTRACT_PARAMS.CONTRACT_INITIAL_SUPPLY));
        const governanaceTokenMaxSupply:number = Math.floor(parseInt(CONTRACT_PARAMS.CONTRACT_MAXIMUM_SUPPLY));
        const amountForEachVoter:number = Math.floor(governanaceTokenSupply/10/6);

        console.log(`Balance of Deployer:   `, await ERCGovernanceTokenSmartContract.balanceOf(deployerWallet.address));

        console.log(`Amount per each voter: `, Snippets.ethersToWei(amountForEachVoter), (amountForEachVoter));

        console.log(`Total supply:          `, Snippets.ethersToWei(governanaceTokenSupply), governanaceTokenSupply);

        console.log(`Total max supply:      `, Snippets.ethersToWei(governanaceTokenMaxSupply), governanaceTokenMaxSupply);

        await ERCGovernanceTokenSmartContract.connect(deployerWallet).transfer(voter1Wallet.address, (Snippets.ethersToWei(amountForEachVoter*2)))
        await ERCGovernanceTokenSmartContract.connect(deployerWallet).transfer(voter2Wallet.address, (Snippets.ethersToWei(amountForEachVoter)))
        await ERCGovernanceTokenSmartContract.connect(deployerWallet).transfer(voter3Wallet.address, (Snippets.ethersToWei(amountForEachVoter)))
        await ERCGovernanceTokenSmartContract.connect(deployerWallet).transfer(voter4Wallet.address, (Snippets.ethersToWei(amountForEachVoter)))
        await ERCGovernanceTokenSmartContract.connect(deployerWallet).transfer(voter5Wallet.address, (Snippets.ethersToWei(amountForEachVoter)))
        
        console.log(`Balance of Deployer: `, await ERCGovernanceTokenSmartContract.balanceOf(deployerWallet.address));
        console.log(`Balance of Proposer: `, await ERCGovernanceTokenSmartContract.balanceOf(proposerWallet.address));
        console.log(`Balance of Executor: `, await ERCGovernanceTokenSmartContract.balanceOf(executorWallet.address));
        console.log(`Balance of Voter #1: `, await ERCGovernanceTokenSmartContract.balanceOf(voter1Wallet.address));
        console.log(`Balance of Voter #2: `, await ERCGovernanceTokenSmartContract.balanceOf(voter2Wallet.address));
        console.log(`Balance of Voter #3: `, await ERCGovernanceTokenSmartContract.balanceOf(voter3Wallet.address));
        console.log(`Balance of Voter #4: `, await ERCGovernanceTokenSmartContract.balanceOf(voter4Wallet.address));
        console.log(`Balance of Voter #5: `, await ERCGovernanceTokenSmartContract.balanceOf(voter5Wallet.address));

        // ++++++++++++

        // Deploy timelock

        // In addition to passing minDelay, we also need to pass 2 arrays.
        // The 1st array contains addresses of those who are allowed to make a proposal.
        // The 2nd array contains addresses of those who are allowed to make executions.

        const ercTimelockSmartContract:any = await ethers.getContractFactory(CONTRACT_FILE_TIMELOCK);
        ERCTimelockSmartContract = await ercTimelockSmartContract.deploy(
            CONTRACT_PARAMS.CONTRACT_MINIMUM_DELAY, 
            [proposerWallet.address], 
            [executorWallet.address],
            deployerWallet.address
        );
        await ERCTimelockSmartContract.waitForDeployment();

        ERCTimelockSmartContract.on(
            "*",
            (event:any) => {
                ////console.log(`EVENT: ERCTimelockSmartContract\n`, event.event, event.args, event.eventSignature)
            }
        )

        //console.log(`Contract deployed : ERCTimelockSmartContract :`, await ERCTimelockSmartContract.getAddress());

        // ++++++++++++

        // Deploy governanace

        const contractLinkedLibrary = await ethers.getContractFactory(CONTRACT_PARAMS.LINKED_LIBRARY);
        const ContractLinkedLibrary = await contractLinkedLibrary.deploy();
        await ContractLinkedLibrary.waitForDeployment();

        const erc20DAOSmartContract:any = await ethers.getContractFactory(
            CONTRACT_FILE
        );

        ERCGovernanceDAOSmartContract = await erc20DAOSmartContract.deploy(
            CONTRACT_PARAMS.CONTRACT_NAME,
            await ERCGovernanceTokenSmartContract.getAddress(), 
            await ERCTimelockSmartContract.getAddress(),
            CONTRACT_PARAMS.CONTRACT_VOTING_DELAY,
            CONTRACT_PARAMS.CONTRACT_VOTING_PERIOD,
            CONTRACT_PARAMS.CONTRACT_PROPOSAL_THRESHOLD,
            CONTRACT_PARAMS.CONTRACT_QUORUM_PERCENTAGE,
        );

        await ERCGovernanceDAOSmartContract.waitForDeployment();

        CHAIN_IDS.map(async (chain: any) => {

            const path: any = `../frontend/src/_services/providers/data/context/libs/artifacts/${chain}`;

            if (!fs.existsSync(path)) {
                fs.mkdirSync(path, { recursive: true });
            }

            // Addresses

            const smartContractAddress: string = await ERCGovernanceDAOSmartContract.getAddress();

            fs.writeFileSync(
                `${path}/ERCDAOFactoryAddress.json`,
                `{ "address": "${smartContractAddress}" }`
            );

            // Contracts

            fs.copyFile('./artifacts/contracts/ERCDAOFactory.sol/ERCDAOFactory.json', `${path}/ERCDAOFactoryContract.json`, (err: any) => {
                if (err) throw err;
                console.log('Artifact file [ ERCDAOFactory + Address ] copied successfully!');
            });

        })

        ERCGovernanceDAOSmartContract.on(
            "*",
            (event:any) => {
                ////console.log(`EVENT: ERCGovernanceDAOSmartContract\n`, event.event, event.args, event.eventSignature)
            }
        )

        //console.log(`Contract deployed : ERCGovernanceDAOSmartContract :`, await ERCGovernanceDAOSmartContract.getAddress());

        // ++++++++++++
        
        // Deploy Treasury

        // Timelock contract will be the owner of our treasury contract.
        // In the provided example, once the proposal is successful and executed,
        // timelock contract will be responsible for calling the function.

        const ercTreasurySmartContract:any = await ethers.getContractFactory(CONTRACT_FILE_TREASURY);

        const treasurySmartContractName:string = "ENFTIS Proposal Treasury";
        const treasurySmartContractSymbol:string = "PZNFT";
        const treasurySmartContractBaseURI:string = "https://base.url/";

        ERCTreasurySmartContract = await ercTreasurySmartContract.deploy(
            treasurySmartContractName,
            treasurySmartContractSymbol,
            treasurySmartContractBaseURI,
            ERCTimelockSmartContract.PROPOSER_ROLE(),
            ERCTimelockSmartContract.EXECUTOR_ROLE()
        );

        await ERCTreasurySmartContract.waitForDeployment();

        ERCTreasurySmartContract.on(
            "*",
            (event:any) => {
                ////console.log(`EVENT: ERCTreasurySmartContract\n`, event.event, event.args, event.eventSignature)
            }
        )

        //console.log(`Contract deployed : ERCTreasurySmartContract :`, await ERCTreasurySmartContract.getAddress());

        //console.log(`Contract OLD OWNER : ERCTreasurySmartContract :`, await ERCTreasurySmartContract.owner());

        expect(await ERCTreasurySmartContract.owner()).to.be.equal(deployerWallet.address);

        await ERCTreasurySmartContract.connect(deployerWallet).transferOwnership(await ERCTimelockSmartContract.getAddress());

        //console.log(`Contract NEW OWNER : ERCTreasurySmartContract :`, await ERCTreasurySmartContract.owner());

        expect(await ERCTreasurySmartContract.owner()).to.be.equal(await ERCTimelockSmartContract.getAddress());

        // ++++++++++++

        // Assign roles

        // You can view more information about timelock roles from the openzeppelin documentation:
        // --> https://docs.openzeppelin.com/contracts/4.x/api/governance#timelock-proposer
        // --> https://docs.openzeppelin.com/contracts/4.x/api/governance#timelock-executor

        const proposerRole:any = await ERCTimelockSmartContract.PROPOSER_ROLE()
        const executorRole:any = await ERCTimelockSmartContract.EXECUTOR_ROLE()
        const adminRole:any = await ERCTimelockSmartContract.getTimeLockAdminRole()

        //console.log(`Contract OLD OWNER : ERCTimelockSmartContract :`, await ERCTimelockSmartContract.owner());

        expect(await ERCTimelockSmartContract.owner()).to.be.equal(deployerWallet.address);

        await ERCTimelockSmartContract.connect(deployerWallet).transferOwnership(await ERCTimelockSmartContract.getAddress())

        //console.log(`Contract NEW OWNER : ERCTimelockSmartContract :`, await ERCTimelockSmartContract.owner());

        expect(await ERCTimelockSmartContract.owner()).to.be.equal(await ERCTimelockSmartContract.getAddress());

        //console.log(`Contract OWNERS : ERCTimelockSmartContract : ERCTreasurySmartContract`, await ERCTimelockSmartContract.owner(), await ERCTreasurySmartContract.owner());

        await ERCTimelockSmartContract.grantRole(proposerRole, await ERCGovernanceDAOSmartContract.getAddress());

        //console.log(`Proposer Role : ERCTimelockSmartContract :`, await ERCGovernanceDAOSmartContract.getAddress(),  await ERCTimelockSmartContract.hasRole(proposerRole, ERCGovernanceDAOSmartContract.getAddress()));

        ////////////////////////////////

        await ERCTimelockSmartContract.grantRole(executorRole, await ERCGovernanceDAOSmartContract.getAddress());

        //console.log(`Executor Role : ERCTimelockSmartContract : ERCGovernanceDAOSmartContract.getAddress() :`, await ERCGovernanceDAOSmartContract.getAddress(), await ERCTimelockSmartContract.hasRole(executorRole, await ERCGovernanceDAOSmartContract.getAddress()));

        await ERCTimelockSmartContract.grantRole(executorRole, CONTRACT_PARAMS.ADDRESS_ZERO);

        //console.log(`Executor Role : ERCTimelockSmartContract : CONTRACT_PARAMS.ADDRESS_ZERO`, CONTRACT_PARAMS.ADDRESS_ZERO,  await ERCTimelockSmartContract.hasRole(executorRole, CONTRACT_PARAMS.ADDRESS_ZERO));

        expect(await ERCTimelockSmartContract.hasRole(executorRole, CONTRACT_PARAMS.ADDRESS_ZERO)).to.be.true;

        await ERCTimelockSmartContract.grantRole(executorRole, executorWallet.address)

        //console.log(`Executor Role : ERCTimelockSmartContract : executorWallet.address :`, executorWallet.address,  await ERCTimelockSmartContract.hasRole(executorRole, executorWallet.address));

        expect(await ERCTimelockSmartContract.hasRole(executorRole, executorWallet.address)).to.be.true;

        await ERCTimelockSmartContract.revokeRole(adminRole, deployerWallet.address)

        //console.log(`Admin Role : ERCTimelockSmartContract : deployerWallet.address :`, deployerWallet.address,  await ERCTimelockSmartContract.hasRole(adminRole, deployerWallet.address));

        expect(await ERCTimelockSmartContract.hasRole(adminRole, deployerWallet.address)).to.be.false;

        //console.log(`Contract NEW ADMIN/OWNER : ERCTreasurySmartContract :`, await ERCTreasurySmartContract.owner());

        expect(await ERCTreasurySmartContract.owner()).to.be.equal(await ERCTimelockSmartContract.getAddress());

        // ++++++++++++
        
        contractArgs = CONTRACT_PARAMS;

        return { deployerWallet, executorWallet, proposerWallet, voter1Wallet, voter2Wallet, voter3Wallet, voter4Wallet, voter5Wallet, contractArgs};

    }

    describe("Deployment", () => {

        it("Should deploy the contract successfully!", async function () {

            //console.log("  Deploying Contract ...", await ERCGovernanceDAOSmartContract.getAddress());

            expect(await ERCGovernanceDAOSmartContract.getAddress()).to.be.properAddress;

        });

    });

    describe("DAO Governance Smart Contract", () => {
            
        describe("TKN Governance Token", () => {
            
            it("Has a name", async () => {

            });

        });

        describe("TimeLock Smart Contract", () => {
            
            it("Has a name", async () => {

            });

        });

        describe("Treasury Smart Contract", () => {

            const createTestProposal:Function = async () : Promise<any> => {

                const proposalId:number = 1;

                const proposalDescription:string = "Lorem ipsum dolor sit amet, consectetur adipiscing el";

                const proposalFunds:number = 24;
                
                const tx:any = await ERCTreasurySmartContract.connect(proposerWallet).createProposal(
                    proposalId,
                    proposalDescription,
                    proposerWallet.address,
                    executorWallet.address, 
                    { 
                        value: Snippets.ethersToWei(proposalFunds)
                    }
                
                );

                await tx.wait(1);

                return await ERCTreasurySmartContract.getProposalDetails(proposalId);

            }
            
            it("Has an owner", async () => {

                expect(await ERCTreasurySmartContract.owner()).to.be.equal(await ERCTimelockSmartContract.getAddress());

            });

            it("Creates a proposal", async () => {

                const proposalPayload: any = await createTestProposal();
                
                expect(proposalPayload.proposerWalletAddress).to.be.equal(proposerWallet.address);
                expect(proposalPayload.executorWalletAddress).to.be.equal(executorWallet.address);
                expect(proposalPayload.executedAt).to.be.equal(0);
                expect(proposalPayload.amountDisbursed).to.be.false;
                expect(
                    parseFloat(
                        Snippets.weiToEthers(
                            `${await ethers.provider.getBalance(await ERCTreasurySmartContract.getAddress())}`
                        )
                    ).toFixed(5))
                    .to.be.equal(
                    (
                        parseFloat(
                            Snippets.weiToEthers(proposalPayload.totalFunds)
                        )
                    ).toFixed(5)
                );

            });

            it("Executes a proposal", async () => {
                await createTestProposal();
            
                const executorInitialBalance = await ethers.provider.getBalance(executorWallet.address);
            
                const tx = await ERCTreasurySmartContract.connect(executorWallet).executeProposal(1);
                await tx.wait(1);
            
                const proposalPayload = await ERCTreasurySmartContract.getProposalDetails(1);
            
                expect(proposalPayload.proposerWalletAddress).to.be.equal(proposerWallet.address);
                expect(proposalPayload.executorWalletAddress).to.be.equal(executorWallet.address);
                expect(proposalPayload.executedAt).to.be.greaterThan(0);
                expect(proposalPayload.amountDisbursed).to.be.true;
            
                const treasuryBalance:bigint = await ethers.provider.getBalance(await ERCTreasurySmartContract.getAddress());

                expect(Snippets.weiToEthers(treasuryBalance)).to.be.equal('0.0');

                let executorBalance: bigint | string = await ethers.provider.getBalance(executorWallet.address);
                
                executorBalance = parseFloat(Snippets.weiToEthers(executorBalance)).toFixed(6);

                const expectedExecutorBalance = parseFloat(Snippets.weiToEthers(executorInitialBalance+proposalPayload.totalFunds)).toFixed(6);
                
                expect(executorBalance).to.be.equal(expectedExecutorBalance);
            });

        });

        it("Cast votes and Release Funds", async () => {

            let latestBlock, blockNumber, proposalState;

            //console.log(`Contract ERCTreasurySmartContract Owner: ${await ERCTreasurySmartContract.owner()}`)
            
            //console.log(`deployerWallet: ${deployerWallet.address}`)
            //console.log(`executorWallet: ${executorWallet.address}`)
            //console.log(`proposerWallet: ${proposerWallet.address}`)
            //console.log(`voter1Wallet:   ${voter1Wallet.address}`)
            //console.log(`voter2Wallet:   ${voter2Wallet.address}`)
            //console.log(`voter3Wallet:   ${voter3Wallet.address}`)
            //console.log(`voter4Wallet:   ${voter4Wallet.address}`)
            //console.log(`voter5Wallet:   ${voter5Wallet.address}`)

            console.log(`deployerWallet BAL: ${await ERCGovernanceTokenSmartContract.balanceOf(deployerWallet.address)}`)
            console.log(`executorWallet BAL: ${await ERCGovernanceTokenSmartContract.balanceOf(executorWallet.address)}`)
            console.log(`proposerWallet BAL: ${await ERCGovernanceTokenSmartContract.balanceOf(proposerWallet.address)}`)
            console.log(`voter1Wallet BAL:   ${await ERCGovernanceTokenSmartContract.balanceOf(voter1Wallet.address)}`)
            console.log(`voter2Wallet BAL:   ${await ERCGovernanceTokenSmartContract.balanceOf(voter2Wallet.address)}`)
            console.log(`voter3Wallet BAL:   ${await ERCGovernanceTokenSmartContract.balanceOf(voter3Wallet.address)}`)
            console.log(`voter4Wallet BAL:   ${await ERCGovernanceTokenSmartContract.balanceOf(voter4Wallet.address)}`)
            console.log(`voter5Wallet BAL:   ${await ERCGovernanceTokenSmartContract.balanceOf(voter5Wallet.address)}`)

            const executorInitialBalance:any = await ethers.provider.getBalance(executorWallet.address);

            //console.log(`Funds inside of executor: ${(executorInitialBalance)} WEI\n`);

            let treasuryInitialBalance:any = await ethers.provider.getBalance(await ERCTreasurySmartContract.getAddress());

            //console.log(`Funds inside of treasury 0: ${(treasuryInitialBalance)} WEI\n`)

            await delegateAccounts(
                ERCGovernanceTokenSmartContract, 
                deployerWallet,
                voter1Wallet, 
                voter2Wallet, 
                voter3Wallet, 
                voter4Wallet, 
                voter5Wallet
            )

            const proposalDescription:string = "Release Funds from Treasury"

            //console.log(`Proposal Description: ${(proposalDescription)}\n`)

            const id:any = await makeProposal(
                ERCGovernanceDAOSmartContract, 
                ERCTreasurySmartContract,
                proposerWallet,
                executorWallet,
                Snippets.ethersToWei(contractArgs.CONTRACT_PETTY_FUNDS),
                proposalDescription, 
                parseInt(contractArgs.CONTRACT_VOTING_DELAY)
                //contractArgs.CONTRACT_VOTING_DELAY,
                //contractArgs.CONTRACT_VOTING_PERIOD,
                //contractArgs.CONTRACT_PROPOSAL_THRESHOLD,
                //contractArgs.CONTRACT_QUORUM_PERCENTAGE,
            );

            //console.log("Returned Proposal ID", id);

            proposalState = await ERCGovernanceDAOSmartContract.state(id);
            //console.log(`Current state of proposal: ${proposalState.toString()} [${Snippets.getProposalState(proposalState)}] \n`);

            treasuryInitialBalance = await ethers.provider.getBalance(await ERCTreasurySmartContract.getAddress());

            //console.log(`Funds inside of treasury 1: ${(treasuryInitialBalance)} WEI\n`)

            //console.log(`Funds released? ${await ERCTreasurySmartContract.isReleased(id)}\n`)

            expect(await ERCTreasurySmartContract.isReleased(id)).to.be.false;

            expect(treasuryInitialBalance).to.be.equal(Snippets.ethersToWei(parseFloat(contractArgs.CONTRACT_PETTY_FUNDS)));

            expect(String(id).length).to.be.greaterThan(75);

            proposalState = await ERCGovernanceDAOSmartContract.state(id);
            //console.log(`Current state of proposal: ${proposalState.toString()} [${Snippets.getProposalState(proposalState)}] \n`);

            expect(parseInt(proposalState.toString())).to.equal(1); //3 if not ready

            const snapshot = await ERCGovernanceDAOSmartContract.proposalSnapshot(id)
            //console.log(`Proposal created on block ${snapshot.toString()}`)

            const deadline = await ERCGovernanceDAOSmartContract.proposalDeadline(id)
            //console.log(`Proposal deadline on block ${deadline.toString()}\n`)

            expect(parseInt(`${snapshot}`)+parseInt(contractArgs.CONTRACT_VOTING_PERIOD)).to.be.equal(parseInt(`${deadline}`));

            latestBlock = await ethers.provider.getBlock("latest");
            blockNumber = latestBlock?.number || 0;

            //console.log(`Current blocknumber: ${blockNumber}\n`, latestBlock)

            const quorum = await ERCGovernanceDAOSmartContract.quorum(blockNumber - 1)
            //console.log(`Number of votes required to pass: ${Math.round(Snippets.weiToEthers(quorum))}ETH or ${quorum}WEI)}\n`)

            expect(quorum).to.equal(Snippets.ethersToWei(parseInt(contractArgs.CONTRACT_QUORUM_PERCENTAGE)/100*parseInt(contractArgs.CONTRACT_INITIAL_SUPPLY))) // Todo, why the env is not working ??? contractArgs.CONTRACT_QUORUM_PERCENTAGE);

            // Vote
            //console.log(`Casting votes...\n`)

            await castVotes(
                ERCGovernanceDAOSmartContract,
                id,
                voter1Wallet, 
                voter2Wallet, 
                voter3Wallet, 
                voter4Wallet, 
                voter5Wallet,
                contractArgs.CONTRACT_VOTING_PERIOD
            )

            // States: Pending, Active, Canceled, Defeated, Succeeded, Queued, Expired, Executed
            proposalState = await ERCGovernanceDAOSmartContract.state(id)
            
            //console.log(`Current state of proposal: ${proposalState.toString()} [${Snippets.getProposalState(proposalState)}] \n`);

            expect(parseInt(proposalState.toString())).to.equal(4);

            const { againstVotes, forVotes, abstainVotes } = await ERCGovernanceDAOSmartContract.proposalVotes(id)
            //console.log(`Votes For: ${forVotes}`)
            //console.log(`Votes Against: ${againstVotes}`)
            //console.log(`Votes Neutral: ${abstainVotes}\n`)

            
            latestBlock = await ethers.provider.getBlock("latest");
            blockNumber = latestBlock?.number;
            //console.log(`Current blocknumber: ${blockNumber}\n`)

            proposalState = await ERCGovernanceDAOSmartContract.state(id)
            //console.log(`Current state of proposal: ${proposalState.toString()} [${Snippets.getProposalState(proposalState)}] \n`);

            expect(parseInt(proposalState.toString())).to.equal(4);

            // Queue 
            const hash = ethers.keccak256(ethers.toUtf8Bytes(proposalDescription));

            await queueProposal(
                ERCGovernanceDAOSmartContract, 
                ERCTreasurySmartContract, 
                hash, 
                id,
                executorWallet
            );

            proposalState = await ERCGovernanceDAOSmartContract.state(id)
            //console.log(`Current state of proposal: ${proposalState.toString()} [${Snippets.getProposalState(proposalState)}] \n`);

            let proposalPayload:any = await ERCTreasurySmartContract.getProposalDetails(id);

            //console.log("Proposal Payload 0:", proposalPayload)

            treasuryInitialBalance = await ethers.provider.getBalance(await ERCTreasurySmartContract.getAddress());

            //console.log(`Funds inside of treasury 2  : Just before execute XX : ${(await ERCTreasurySmartContract.getAddress())} : ${(treasuryInitialBalance)} WEI\n`)

            treasuryInitialBalance = await ethers.provider.getBalance(ERCTimelockSmartContract.getAddress());

            //console.log(`Funds inside of timeloack 3 : Just before execute YY : ${(await ERCTimelockSmartContract.getAddress())}  : ${(treasuryInitialBalance)} WEI\n`)

            proposalPayload = await executeProposal(
                ERCGovernanceDAOSmartContract, 
                ERCTreasurySmartContract, 
                hash, 
                id,
                parseInt(contractArgs.CONTRACT_MINIMUM_DELAY),
                executorWallet
            );

            //console.log("Proposal Payload 1:", proposalPayload)

            proposalState = await ERCGovernanceDAOSmartContract.state(id)
            //console.log(`Current state of proposal: ${proposalState.toString()} [${Snippets.getProposalState(proposalState)}] \n`);

            //console.log(`Funds released? ${await ERCTreasurySmartContract.isReleased(id)}\n`);

            //console.log(`Funds inside of treasury: ${Snippets.weiToEthers(await ethers.provider.getBalance(ERCTreasurySmartContract.getAddress()))} ETH\n`);

            //console.log(`Funds inside of executor: ${Snippets.weiToEthers(await ethers.provider.getBalance(executorWallet.address))} ETH\n`);

            //console.log(`Snapshot executor proposal:`, await ERCTreasurySmartContract.getProposalDetails(id));

            //console.log(`Snapshot proposal executor:`, await ERCTreasurySmartContract.getProposalExecutor(id));

            expect(await ERCTreasurySmartContract.isReleased(id)).to.be.true;

            expect(await ethers.provider.getBalance(await ERCTreasurySmartContract.getAddress())).to.be.equal(0);

            expect(
                parseFloat(Snippets.weiToEthers(await ethers.provider.getBalance(executorWallet.address))).toFixed(7))
                .to.be
                .equal(
                    (parseFloat(Snippets.weiToEthers(executorInitialBalance)) + parseFloat(contractArgs.CONTRACT_PETTY_FUNDS)).toFixed(7)
                );

        });

    });

    await new Promise(res =>  setTimeout(() => res(null), 5000));

});

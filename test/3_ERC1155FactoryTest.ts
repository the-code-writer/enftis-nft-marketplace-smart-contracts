import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

const fs = require('fs');

const Snippets = require("../scripts/libs/Snippets");

const MAXIMUM_SUPPLY: number | any = parseInt(`${process.env.MAXIMUM_SUPPLY_1155}`);

const CHAIN_IDS:Array<any> = process.env.CHAIN_IDS !== null ? String(process.env.CHAIN_IDS).split(",") : [];

const provider:any = ethers.getDefaultProvider();

describe("ERC1155Factory", async function () {

    let ERC1155FactorySmartContract:any;

    let deployerWallet:any, aliceWallet:any, bobWallet:any, charlieWallet:any, donWallet:any, args:any;

    let deployerWalletAccount:any;
    let aliceWalletAccount:any;
    let bobWalletAccount:any;
    let charlieWalletAccount:any;
    let donWalletAccount:any;

    beforeEach( async () => {

        const { smartContract, _deployerWallet, _aliceWallet, _bobWallet, _charlieWallet, _donWallet, _args } = await loadFixture(deploySmartContract);

        ERC1155FactorySmartContract = smartContract;
        deployerWallet = _deployerWallet;
        aliceWallet = _aliceWallet;
        bobWallet = _bobWallet;
        charlieWallet = _charlieWallet;
        donWallet = _donWallet;
        args = _args;

        deployerWalletAccount = await ERC1155FactorySmartContract.connect(deployerWallet);
        aliceWalletAccount = await ERC1155FactorySmartContract.connect(aliceWallet);
        bobWalletAccount = await ERC1155FactorySmartContract.connect(bobWallet);
        charlieWalletAccount = await ERC1155FactorySmartContract.connect(charlieWallet);
        donWalletAccount = await ERC1155FactorySmartContract.connect(donWallet);

    });

    afterEach(async () => {

        const _nft: any = await deployerWalletAccount.getNFTItems();
        
        //console.log("#NFTS:", _nft.length);

    });

    const deploySmartContract = async (): Promise<{ smartContract: any; _deployerWallet:any ; _aliceWallet: any; _bobWallet: any, _charlieWallet: any, _donWallet: any, _args:any }> => {

        const [_deployerWallet, _aliceWallet, _bobWallet, _charlieWallet, _donWallet] = await ethers.getSigners();

        console.log("      💰  Deploying contracts with the account:", _deployerWallet.address);

        //console.log("      💴  Account balance:", (await provider.getBalance(_deployerWallet.address)).toString());

        console.log("      💴  Account address:", _deployerWallet.address, _aliceWallet.address, _bobWallet.address, _charlieWallet.address, _donWallet.address);

        const CONTRACT_FILE: any = process.env.CONTRACT_FILE_1155;

        const CONTRACT_PARAMS: any = require(`../scripts/contract-configs/${CONTRACT_FILE}.Config.ts`)

        const ContractLinkedLibrary = await ethers.getContractFactory(CONTRACT_PARAMS.LINKED_LIBRARY);
        const contractLinkedLibrary = await ContractLinkedLibrary.deploy();
        await contractLinkedLibrary.waitForDeployment();

        const SmartContract:any = await ethers.getContractFactory(
            CONTRACT_FILE,
            {
                libraries: {
                    Snippets: await contractLinkedLibrary.getAddress(),
                },
            }
        );

        console.warn(
            "Deploy with the following arguments",
            CONTRACT_PARAMS.ABI_VALUES
        );
        
        console.warn(
            "Deploy with the following arguments",
            CONTRACT_PARAMS.ABI_ENCODED
        );
        
        const smartContract = await SmartContract.deploy(
            CONTRACT_PARAMS.BASE_URI,
            CONTRACT_PARAMS.ABI_ENCODED
        );

        await smartContract.waitForDeployment();

        const smartContractAddress:string = await smartContract.getAddress();

        const targetDir:string = './test/txt/';

        fs.mkdirSync(targetDir, { recursive: true });

        fs.writeFileSync(`${targetDir}ERC1155.txt`, smartContractAddress);

        CHAIN_IDS.map((chain: any) => {

            const path: any = `../frontend/src/_services/providers/data/context/libs/artifacts/${chain}`;

            if (!fs.existsSync(path)) {
                fs.mkdirSync(path, { recursive: true });
            }

            // Addresses

            fs.writeFileSync(
                `${path}/ERC1155FactoryAddress.json`,
                `{ "address": "${smartContractAddress}" }`
            );

            // Contracts

            fs.copyFile('./artifacts/contracts/ERC1155Factory.sol/ERC1155Factory.json', `${path}/ERC1155FactoryContract.json`, (err: any) => {
                if (err) throw err;
                console.log('Artifact file [ ERC1155Factory + Address ] copied successfully!');
            });

        })

        const loggerAddressBuffer: any = fs.readFileSync(`${targetDir}ERCLogger.txt`);

        const loggerAddress: string = loggerAddressBuffer.toString();

        console.log("Set Logger Address on ERC721 :", loggerAddress);

        await smartContract.connect(_deployerWallet).setLoggerAddress(loggerAddress);

        const _args:any = {
            contractBaseURI: CONTRACT_PARAMS.BASE_URI,
            contractABI: CONTRACT_PARAMS.ABI_VALUES
        }

        console.log("  Arguments ...", _args);

        return { smartContract, _deployerWallet, _aliceWallet, _bobWallet, _charlieWallet, _donWallet, _args };

    }

    const mintTokens = async (offset:number=1, count:number = 5) : Promise<any> => {
        
        //Mint token 1 to 5
        // Token #1 : Minted=(1*10/2)=5,  MaxSupply=(1*10*2)=20
        // Token #2 : Minted=(2*10/2)=10, MaxSupply=(2*10*2)=40
        // Token #3 : Minted=(3*10/2)=15, MaxSupply=(3*10*2)=60
        // Token #4 : Minted=(4*10/2)=20, MaxSupply=(4*10*2)=80
        // Token #5 : Minted=(5*10/2)=25, MaxSupply=(5*10*2)=100

        const _baseURI:string = `https://domain.tld/`;

        let mintingFee:number = args.contractABI[5];

        for (let tokenId: number = offset; tokenId < offset + count; tokenId++) {

            const _tokenURI: string = `uri-token-${tokenId}.json`;

            // console.log(
            //     "MINTING..." + tokenId,
            //     [
            //         aliceWallet.address,
            //         tokenId,
            //         tokenId * 10 / 2,
            //         tokenId * 10 * 2,
            //         `${_baseURI}${_tokenURI}`,
            //         Snippets.ZERO_ADDRESS,
            //         { value: mintingFee }
            //     ]
            // )
             
            const txn: any = await ERC1155FactorySmartContract.mintSingle(
                aliceWallet.address,
                tokenId,
                tokenId * 10 / 2,
                tokenId * 10 * 2,
                `${_baseURI}${_tokenURI}`,
                Snippets.ZERO_ADDRESS,
                { value: mintingFee }
            );

            await txn.wait();
        
        }

        const items:any = await ERC1155FactorySmartContract.getNFTItems();

        return items;


    }

    const transferTokens = async () => {

        //Transfer token 1 to 5
        // Token #1 : From: Alice	To: Bob		Amount: 1*10/2 = 5		Alice (5-5)   = 0 of token #1
        // Token #2 : From: Alice	To: Bob		Amount: 2*10/2 = 10		Alice (10-10) = 0 of token #2
        // Token #3 : From: Alice	To: Charlie	Amount: 3*10/2 = 15		Alice (15-15) = 0 of token #3
        // Token #4 : From: Alice	To: Dean	Amount: 4*10/2 = 20		Alice (20-20) = 0 of token #4
        // Token #5 : From: Alice	To: Dean	Amount: 5*10/2/5 = 5	Alice (25-5)  = 20 of token #5

        //console.log("ALICE BALANCE TOKEN # 1", (1*10/2), await ERC1155FactorySmartContract.balanceOf(aliceWallet.address, 1), await ERC1155FactorySmartContract.getTokenSupplies(1))

        let txn:any;

        txn = await aliceWalletAccount.transferToken(
                aliceWallet.address,
                bobWallet.address,
                1,
                1*10/2,
                Snippets.ZERO_ADDRESS
            );

        await txn.wait();

       // console.log("ALICE BALANCE TOKEN # 2", (2*10/2), await ERC1155FactorySmartContract.balanceOf(aliceWallet.address, 2), await ERC1155FactorySmartContract.getTokenSupplies(2))

        txn = await aliceWalletAccount.transferToken(
                aliceWallet.address,
                bobWallet.address,
                2,
                2*10/2,
                Snippets.ZERO_ADDRESS
            );

        await txn.wait();

        //console.log("ALICE BALANCE TOKEN # 3", (3*10/2), await ERC1155FactorySmartContract.balanceOf(aliceWallet.address, 3), await ERC1155FactorySmartContract.getTokenSupplies(3))

        txn = await aliceWalletAccount.transferToken(
                aliceWallet.address,
                charlieWallet.address,
                3,
                3*10/2,
                Snippets.ZERO_ADDRESS
            );

        await txn.wait();

        //console.log("ALICE BALANCE TOKEN # 4", (4*10/2), await ERC1155FactorySmartContract.balanceOf(aliceWallet.address, 4), await ERC1155FactorySmartContract.getTokenSupplies(4))

        txn = await aliceWalletAccount.transferToken(
                aliceWallet.address,
                donWallet.address,
                4,
                4*10/2,
                Snippets.ZERO_ADDRESS
            );

        await txn.wait();

        //console.log("ALICE BALANCE TOKEN # 4", (4*10/2), await ERC1155FactorySmartContract.balanceOf(aliceWallet.address, 4), await ERC1155FactorySmartContract.getTokenSupplies(4))

        txn = await aliceWalletAccount.transferToken(
                aliceWallet.address,
                donWallet.address,
                5,
                5*10/2/5,
                Snippets.ZERO_ADDRESS
            );

        await txn.wait();

    }

    const burnTokens = async () => {

        let txn:any;

        let accountWallet:any = aliceWalletAccount;
            
        txn = await aliceWalletAccount.burn(aliceWallet.address, 5, 17); // 20-17 = 3
        await txn.wait();

        txn = await bobWalletAccount.burn(bobWallet.address, 2, 4); // 10-4 = 6
        await txn.wait();

        txn = await charlieWalletAccount.burn(charlieWallet.address, 3, 12); // 15-12 = 3
        await txn.wait();

        txn = await donWalletAccount.burn(donWallet.address, 4, 11); // 20-11 = 9
        await txn.wait();

        txn = await donWalletAccount.burn(donWallet.address, 5, 1); // 5-1 = 4
        await txn.wait();

    }

    describe("Deployment", () => {

        console.log("  Deploying Contract ...");

        it("Should deploy the contract successfully!", async function () {

            expect(await ERC1155FactorySmartContract.getAddress()).to.be.properAddress;

        });

        it("It has a base uri", async function () {

            expect(await ERC1155FactorySmartContract.getBaseURI()).to.equal(args.contractABI[7]);

        });

        it("It has a maximum supply", async function () {

            expect(await ERC1155FactorySmartContract.getTokenMaximumSupply()).to.equal(args.contractABI[6]);

        });

        it("It has admins", async function () {

            expect(Array.isArray(args.contractABI[2])).to.be.true;
            expect(args.contractABI[2].length).to.equal(6);

        });

        it("It has minters", async function () {

            expect(Array.isArray(args.contractABI[3])).to.be.true;
            expect(args.contractABI[3].length).to.equal(6);

        });

        it("It sets the minting fee", async function () {

            expect(await ERC1155FactorySmartContract.getTokenMintingFee()).to.equal(args.contractABI[5]);

        });

        it("It has owner", async function () {

            expect(await ERC1155FactorySmartContract.getOwner()).to.equal(deployerWallet.address);

        });

        it("It has a minter role", async function () {

            expect(await ERC1155FactorySmartContract.hasRole(Snippets.MINTER_ROLE, deployerWallet.address)).to.be.true;

        });

        it("It has a admin role", async function () {

            expect(await ERC1155FactorySmartContract.hasRole(Snippets.ADMIN_ROLE, deployerWallet.address)).to.be.true;

        });

        it("It is pausable", async function () {

            const pausable:boolean = await ERC1155FactorySmartContract.contractOptionIsPausable();

            expect(pausable).to.be.true;

        });

        it("It is burnable", async function () {

            const burnable:boolean = await ERC1155FactorySmartContract.contractOptionIsBurnable();

            expect(burnable).to.be.true;

        }); 

    });

    describe("Token Transfers", () => {

        let transaction:any;

        beforeEach( async () => {
            
            const _tokens: any = await mintTokens();
            
            //console.log("TOKENS::Token Transfers::", _tokens);

        });

        it(`Must be able to mint tokens`, async function () {

            console.warn("     🟩 Mint Tokens");

            /// Token ID # 1 = tokens:5
            const aliceToken1Balance:number = await ERC1155FactorySmartContract.balanceOf(aliceWallet.address, 1);
            expect(aliceToken1Balance).to.equal(1*10/2);

            /// Token ID # 2 = tokens:10
            const aliceToken2Balance:number = await ERC1155FactorySmartContract.balanceOf(aliceWallet.address, 2);
            expect(aliceToken2Balance).to.equal(2*10/2);

            /// Token ID # 3 = tokens:15
            const aliceToken3Balance:number = await ERC1155FactorySmartContract.balanceOf(aliceWallet.address, 3);
            expect(aliceToken3Balance).to.equal(3*10/2);

            /// Token ID # 4 = tokens:20
            const aliceToken4Balance:number = await ERC1155FactorySmartContract.balanceOf(aliceWallet.address, 4);
            expect(aliceToken4Balance).to.equal(4*10/2);

            /// Token ID # 5 = tokens:25
            const aliceToken5Balance:number = await ERC1155FactorySmartContract.balanceOf(aliceWallet.address, 5);
            expect(aliceToken5Balance).to.equal(5*10/2);

        });

        it("Updates the total supply after minting", async () => {
        
            const nftItems: Array<any> = await ERC1155FactorySmartContract.getNFTItems();

            /// Token ID # 1
            const token1Supplies:any = await ERC1155FactorySmartContract.getTokenSupplies(1);
            expect(token1Supplies.minted).to.equal(1*10/2);
            expect(token1Supplies.current).to.equal(1*10/2);
            expect(token1Supplies.maximum).to.equal(1*10*2);

            /// Token ID # 2
            const token2Supplies:any = await ERC1155FactorySmartContract.getTokenSupplies(2);
            expect(token2Supplies.minted).to.equal(2*10/2);
            expect(token2Supplies.current).to.equal(2*10/2);
            expect(token2Supplies.maximum).to.equal(2*10*2);

            /// Token ID # 3
            const token3Supplies:any = await ERC1155FactorySmartContract.getTokenSupplies(3);
            expect(token3Supplies.minted).to.equal(3*10/2);
            expect(token3Supplies.current).to.equal(3*10/2);
            expect(token3Supplies.maximum).to.equal(3*10*2);

            /// Token ID # 4
            const token4Supplies:any = await ERC1155FactorySmartContract.getTokenSupplies(4);
            expect(token4Supplies.minted).to.equal(4*10/2);
            expect(token4Supplies.current).to.equal(4*10/2);
            expect(token4Supplies.maximum).to.equal(4*10*2);

            /// Token ID # 5
            const token5Supplies:any = await ERC1155FactorySmartContract.getTokenSupplies(5);
            expect(token5Supplies.minted).to.equal(5*10/2);
            expect(token5Supplies.current).to.equal(5*10/2);
            expect(token5Supplies.maximum).to.equal(5*10*2);

            const mintedTokensCount = nftItems.length;

            expect(await ERC1155FactorySmartContract.getTokenCurrentSupply()).to.equal(mintedTokensCount);

        });

        it("Emits TokenMinted event", async () => {
            
            expect(transaction).to.emit(ERC1155FactorySmartContract, "TokenMinted")

        });

        it("Throws a {PriceBelowMintingFee} error", async () => {

            const mintingFeeExpected:number = args.contractABI[5];
            
            const mintingFeeTest:number = 6;

            await expect(ERC1155FactorySmartContract.mintSingle(
                aliceWallet.address,
                1,
                1,
                MAXIMUM_SUPPLY,
                `token-1-uri.json`,
                Snippets.ZERO_ADDRESS,
                {value: mintingFeeTest}
            ))
            .to.be.revertedWithCustomError(ERC1155FactorySmartContract, "PriceBelowMintingFee")
            .withArgs(mintingFeeExpected, mintingFeeTest);
            
        });

        it("Throws a {SpecifiedTokenSupplyReached} error", async () => {

            const mintingFee:number = args.contractABI[5];

            const tokenMaximumSupply:number = MAXIMUM_SUPPLY;

            const tokenId:number = 10;

            let txn:any;

            const mintSomeTokens:any = async () => {

                const list:any = Snippets.createArray(6, 5);
                
                for (const i of list) {
                    
                    txn = await ERC1155FactorySmartContract.mintSingle(
                        aliceWallet.address,
                        i,
                        tokenMaximumSupply,
                        tokenMaximumSupply,
                        `token-id-${i}.json`,
                        Snippets.ZERO_ADDRESS, 
                        {value: mintingFee}
                    );

                    await txn.wait(1);
                    
                }
            
            };

            await mintSomeTokens();

            const tokenSupplies:any = await ERC1155FactorySmartContract.getTokenSupplies(tokenId);

            await Snippets.sleep(3);

            const outOfBoundsTokenId:number = parseInt(tokenSupplies.minted.toString()) + 1;

            await expect(ERC1155FactorySmartContract.mintSingle(
                    aliceWallet.address,
                    tokenId,
                    outOfBoundsTokenId,
                    tokenMaximumSupply,
                    `token-id-${tokenId}.json`,
                    Snippets.ZERO_ADDRESS, 
                {value: mintingFee}
            ))
            .to.be.revertedWithCustomError(ERC1155FactorySmartContract, "SpecifiedTokenSupplyReached")
            .withArgs(tokenMaximumSupply, tokenId);
            
        });

        it("Throws a {SpecifiedTokenSupplyReached} error", async () => {

            const mintingFee:number = args.contractABI[5];

            const tokenMaximumSupply:number = MAXIMUM_SUPPLY;

            const tokenId:number = 6;

            await expect(ERC1155FactorySmartContract.mintSingle(
                aliceWallet.address,
                    tokenId,
                    tokenMaximumSupply+1,
                    tokenMaximumSupply,
                    `metadata-11.json`,
                    Snippets.ZERO_ADDRESS, 
                {value: mintingFee}
            ))
            .to.be.revertedWithCustomError(ERC1155FactorySmartContract, "SpecifiedTokenSupplyReached")
            .withArgs(tokenMaximumSupply, tokenId);
            
        });

        it(`Must be able to transfer tokens between accounts`, async function () {

            console.warn("     🟩 Transfer Tokens");

            await transferTokens();

            let deployerTokens:any, aliceWalletTokens:any, bobWalletTokens:any, charlieWalletTokens:any, donWalletTokens:any;
            
            /// Token ID # 1
            deployerTokens = await ERC1155FactorySmartContract.balanceOf(deployerWallet.address, 1);
            aliceWalletTokens = await ERC1155FactorySmartContract.balanceOf(aliceWallet.address, 1);
            bobWalletTokens = await ERC1155FactorySmartContract.balanceOf(bobWallet.address, 1);
            charlieWalletTokens = await ERC1155FactorySmartContract.balanceOf(charlieWallet.address, 1);
            donWalletTokens = await ERC1155FactorySmartContract.balanceOf(donWallet.address, 1);

            //console.log(1,deployerTokens,aliceWalletTokens,bobWalletTokens,charlieWalletTokens,donWalletTokens)

            expect(deployerTokens).to.equal(0); // never received
            expect(aliceWalletTokens).to.equal(0); // used up all the tokens
            expect(bobWalletTokens).to.equal(1*10/2); // received from alice
            expect(charlieWalletTokens).to.equal(0); // received Token ID #2 from alice, NOT Token ID #1
            expect(donWalletTokens).to.equal(0); // received Token ID #2 from alice, NOT Token ID #1
        
            /// Token ID # 2
            deployerTokens = await ERC1155FactorySmartContract.balanceOf(deployerWallet.address, 2);
            aliceWalletTokens = await ERC1155FactorySmartContract.balanceOf(aliceWallet.address, 2);
            bobWalletTokens = await ERC1155FactorySmartContract.balanceOf(bobWallet.address, 2);
            charlieWalletTokens = await ERC1155FactorySmartContract.balanceOf(charlieWallet.address, 2);
            donWalletTokens = await ERC1155FactorySmartContract.balanceOf(donWallet.address, 2);

            //console.log(2,deployerTokens,aliceWalletTokens,bobWalletTokens,charlieWalletTokens,donWalletTokens)

            expect(deployerTokens).to.equal(0); // never received
            expect(aliceWalletTokens).to.equal(0); // used up all the tokens
            expect(bobWalletTokens).to.equal(2*10/2); // received from alice
            expect(charlieWalletTokens).to.equal(0); // received Token ID #2 from alice, NOT Token ID #1
            expect(donWalletTokens).to.equal(0); // received Token ID #2 from alice, NOT Token ID #1
        
            /// Token ID # 3
            deployerTokens = await ERC1155FactorySmartContract.balanceOf(deployerWallet.address, 3);
            aliceWalletTokens = await ERC1155FactorySmartContract.balanceOf(aliceWallet.address, 3);
            bobWalletTokens = await ERC1155FactorySmartContract.balanceOf(bobWallet.address, 3);
            charlieWalletTokens = await ERC1155FactorySmartContract.balanceOf(charlieWallet.address, 3);
            donWalletTokens = await ERC1155FactorySmartContract.balanceOf(donWallet.address, 3);

            //console.log(3,deployerTokens,aliceWalletTokens,bobWalletTokens,charlieWalletTokens,donWalletTokens)

            expect(deployerTokens).to.equal(0); // never received
            expect(aliceWalletTokens).to.equal(0); // used up all the tokens
            expect(bobWalletTokens).to.equal(0); // received from alice
            expect(charlieWalletTokens).to.equal(3*10/2); // received Token ID #2 from alice, NOT Token ID #1
            expect(donWalletTokens).to.equal(0); // received Token ID #2 from alice, NOT Token ID #1
        
            /// Token ID # 4
            deployerTokens = await ERC1155FactorySmartContract.balanceOf(deployerWallet.address, 4);
            aliceWalletTokens = await ERC1155FactorySmartContract.balanceOf(aliceWallet.address, 4);
            bobWalletTokens = await ERC1155FactorySmartContract.balanceOf(bobWallet.address, 4);
            charlieWalletTokens = await ERC1155FactorySmartContract.balanceOf(charlieWallet.address, 4);
            donWalletTokens = await ERC1155FactorySmartContract.balanceOf(donWallet.address, 4);

            //console.log(4,deployerTokens,aliceWalletTokens,bobWalletTokens,charlieWalletTokens,donWalletTokens)

            expect(deployerTokens).to.equal(0); // never received
            expect(aliceWalletTokens).to.equal(0); // used up all the tokens
            expect(bobWalletTokens).to.equal(0); // received from alice
            expect(charlieWalletTokens).to.equal(0); // received Token ID #2 from alice, NOT Token ID #1
            expect(donWalletTokens).to.equal(4*10/2); // received Token ID #2 from alice, NOT Token ID #1
        
            /// Token ID # 5
            deployerTokens = await ERC1155FactorySmartContract.balanceOf(deployerWallet.address, 5);
            aliceWalletTokens = await ERC1155FactorySmartContract.balanceOf(aliceWallet.address, 5);
            bobWalletTokens = await ERC1155FactorySmartContract.balanceOf(bobWallet.address, 5);
            charlieWalletTokens = await ERC1155FactorySmartContract.balanceOf(charlieWallet.address, 5);
            donWalletTokens = await ERC1155FactorySmartContract.balanceOf(donWallet.address, 5);

            //console.log(5,deployerTokens,aliceWalletTokens,bobWalletTokens,charlieWalletTokens,donWalletTokens)

            expect(deployerTokens).to.equal(0); // never received
            expect(aliceWalletTokens).to.equal((5*10/2)-(5*10/2/5)); // used up all the tokens
            expect(bobWalletTokens).to.equal(0); // received from alice
            expect(charlieWalletTokens).to.equal(0); // received Token ID #2 from alice, NOT Token ID #1
            expect(donWalletTokens).to.equal(5*10/2/5); // received Token ID #2 from alice, NOT Token ID #1
        
        });

        it("Emits tokenTransfered event", () => {
            
            expect(transaction).to.emit(ERC1155FactorySmartContract, "tokenTransfered")
        });

        it("Throws a {IndexOutOfBounds} error on HIGHER index", async () => {

            const tokenId: number = 11;
            
            await expect(ERC1155FactorySmartContract.transferToken(
                bobWallet.address,
                aliceWallet.address,
                tokenId,
                1,
                Snippets.ZERO_ADDRESS
            ))
            .to.be.revertedWithCustomError(ERC1155FactorySmartContract, "ERC1155MissingApprovalForAll");
            //.to.be.revertedWith("ERC1155: caller is not token owner or approved");

            await expect(ERC1155FactorySmartContract.transferToken(
                bobWallet.address,
                aliceWallet.address,
                tokenId,
                1,
                Snippets.ZERO_ADDRESS
            ))
            .to.be.revertedWithCustomError(ERC1155FactorySmartContract, "ERC1155MissingApprovalForAll");

        });

        it("Throws a {IndexOutOfBounds} error on LOWER index", async () => {

            const tokenId:number = 0;

            await expect(ERC1155FactorySmartContract.transferToken(
                bobWallet.address,
                aliceWallet.address,
                tokenId,
                1,
                Snippets.ZERO_ADDRESS
            ))
            .to.be.revertedWithCustomError(ERC1155FactorySmartContract, "ERC1155MissingApprovalForAll");
            //.to.be.revertedWith("ERC1155: caller is not token owner or approved");
            
        });

        it("Throws a {TokenDoesNotExists} error", async () => {

            const tokenId:number = 7;

            await expect(ERC1155FactorySmartContract.transferToken(
                bobWallet.address,
                aliceWallet.address,
                tokenId,
                1,
                Snippets.ZERO_ADDRESS
            ))
            .to.be.revertedWithCustomError(ERC1155FactorySmartContract, "ERC1155MissingApprovalForAll");
            //.to.be.revertedWith("ERC1155: caller is not token owner or approved");
            
        });

        it(`Must be able to burn tokens`, async function () {

            console.warn("     🟩 Burn Tokens");

            await transferTokens();

            //Mint token 1 to 5
            // Token #1 : Minted=(1*10/2)=5,  MaxSupply=(1*10*2)=20
            // Token #2 : Minted=(2*10/2)=10, MaxSupply=(2*10*2)=40
            // Token #3 : Minted=(3*10/2)=15, MaxSupply=(3*10*2)=60
            // Token #4 : Minted=(4*10/2)=20, MaxSupply=(4*10*2)=80
            // Token #5 : Minted=(5*10/2)=25, MaxSupply=(5*10*2)=100

            //Transfer token 1 to 5
            // Token #1 : From: Alice	To: Bob		Amount: 1*10/2 = 5		Alice (5-5)   = 0 of token #1
            // Token #2 : From: Alice	To: Bob		Amount: 2*10/2 = 10		Alice (10-10) = 0 of token #2
            // Token #3 : From: Alice	To: Charlie	Amount: 3*10/2 = 15		Alice (15-15) = 0 of token #3
            // Token #4 : From: Alice	To: Dean	Amount: 4*10/2 = 20		Alice (20-20) = 0 of token #4
            // Token #5 : From: Alice	To: Dean	Amount: 5*10/2/5 = 5	Alice (25-5)  = 20 of token #5


            /*
            1 BigNumber { value: "0" } BigNumber { value: "0" } BigNumber { value: "5" } BigNumber { value: "0" } BigNumber { value: "0" }
            2 BigNumber { value: "0" } BigNumber { value: "0" } BigNumber { value: "10" } BigNumber { value: "0" } BigNumber { value: "0" }
            3 BigNumber { value: "0" } BigNumber { value: "0" } BigNumber { value: "0" } BigNumber { value: "15" } BigNumber { value: "0" }
            4 BigNumber { value: "0" } BigNumber { value: "0" } BigNumber { value: "0" } BigNumber { value: "0" } BigNumber { value: "20" }
            5 BigNumber { value: "0" } BigNumber { value: "20" } BigNumber { value: "0" } BigNumber { value: "0" } BigNumber { value: "5" }
            */
           
            let deployerTokens:any, aliceWalletTokens:any, bobWalletTokens:any, charlieWalletTokens:any, donWalletTokens:any, donWalletTokens2:any;
            
            /// Before burn
            deployerTokens = await ERC1155FactorySmartContract.balanceOf(deployerWallet.address, 1); //0
            aliceWalletTokens = await ERC1155FactorySmartContract.balanceOf(aliceWallet.address, 5); //20
            bobWalletTokens = await ERC1155FactorySmartContract.balanceOf(bobWallet.address, 2); //10
            charlieWalletTokens = await ERC1155FactorySmartContract.balanceOf(charlieWallet.address, 3); //15
            donWalletTokens = await ERC1155FactorySmartContract.balanceOf(donWallet.address, 4); //20
            donWalletTokens2 = await ERC1155FactorySmartContract.balanceOf(donWallet.address, 5); //5

            expect(deployerTokens).to.equal(0);
            expect(aliceWalletTokens).to.equal(20);
            expect(bobWalletTokens).to.equal(10);
            expect(charlieWalletTokens).to.equal(15);
            expect(donWalletTokens).to.equal(20);
            expect(donWalletTokens2).to.equal(5);
            
            await burnTokens();

            /// After burn
            deployerTokens = await ERC1155FactorySmartContract.balanceOf(deployerWallet.address, 1); //0
            aliceWalletTokens = await ERC1155FactorySmartContract.balanceOf(aliceWallet.address, 5); //3
            bobWalletTokens = await ERC1155FactorySmartContract.balanceOf(bobWallet.address, 2); //6
            charlieWalletTokens = await ERC1155FactorySmartContract.balanceOf(charlieWallet.address, 3); //3
            donWalletTokens = await ERC1155FactorySmartContract.balanceOf(donWallet.address, 4); //9
            donWalletTokens2 = await ERC1155FactorySmartContract.balanceOf(donWallet.address, 5); //4

            expect(deployerTokens).to.equal(0);
            expect(aliceWalletTokens).to.equal(3);
            expect(bobWalletTokens).to.equal(6);
            expect(charlieWalletTokens).to.equal(3);
            expect(donWalletTokens).to.equal(9);
            expect(donWalletTokens2).to.equal(4);
            
        });

        it("Updates the total supply after burning", async () => {

            await transferTokens();

            await burnTokens();

            /// Token ID # 1
            const token1Supplies:any = await ERC1155FactorySmartContract.getTokenSupplies(1);
            //console.log("SUPPLIES 1", token1Supplies);
            expect(token1Supplies.minted).to.equal(5);
            expect(token1Supplies.current).to.equal(5);
            expect(token1Supplies.maximum).to.equal(20);

            /// Token ID # 2
            const token2Supplies:any = await ERC1155FactorySmartContract.getTokenSupplies(2);
            //console.log("SUPPLIES 2", token2Supplies);
            expect(token2Supplies.minted).to.equal(10);
            expect(token2Supplies.current).to.equal(6);
            expect(token2Supplies.maximum).to.equal(40);

            /// Token ID # 3
            const token3Supplies:any = await ERC1155FactorySmartContract.getTokenSupplies(3);
            //console.log("SUPPLIES 3", token3Supplies);
            expect(token3Supplies.minted).to.equal(15);
            expect(token3Supplies.current).to.equal(3);
            expect(token3Supplies.maximum).to.equal(60);

            /// Token ID # 4
            const token4Supplies:any = await ERC1155FactorySmartContract.getTokenSupplies(4);
            //console.log("SUPPLIES 4", token4Supplies);
            expect(token4Supplies.minted).to.equal(20);
            expect(token4Supplies.current).to.equal(9);
            expect(token4Supplies.maximum).to.equal(80);

            /// Token ID # 5
            const token5Supplies:any = await ERC1155FactorySmartContract.getTokenSupplies(5);
            //console.log("SUPPLIES 5", token5Supplies);
            expect(token5Supplies.minted).to.equal(25);
            expect(token5Supplies.current).to.equal(7);
            expect(token5Supplies.maximum).to.equal(100);

            const nftItems: Array<any> = await ERC1155FactorySmartContract.getNFTItems();

            const currentTotalSupply:number = await ERC1155FactorySmartContract.getTokenCurrentSupply();

            expect(nftItems.length).to.equal(currentTotalSupply);
            
        });

        it("Reverts with a {ERC1155InsufficientBalance} error", async () => {

            const tokenId:number = 0;

            const burnAmount:number = 15;

            await expect(aliceWalletAccount.burn(aliceWallet.address, tokenId, burnAmount))
            .to.be.revertedWithCustomError(ERC1155FactorySmartContract, "ERC1155InsufficientBalance");
            //.to.be.revertedWith("ERC1155: burn amount exceeds balance");
            
        });

        it("Reverts with a {ERC1155InsufficientBalance} error", async () => {

            const tokenId:number = 6;

            const burnAmount:number = 15;

            await expect(aliceWalletAccount.burn(aliceWallet.address, tokenId, burnAmount))
            .to.be.revertedWithCustomError(ERC1155FactorySmartContract, "ERC1155InsufficientBalance");
            //.to.be.revertedWith("ERC1155: burn amount exceeds balance");
            
        });

        it("Emits TokenBurned event", async () => {
            
            const tokenId:number = 5;
            
            const burnAmount:number = 15;

            await expect(aliceWalletAccount.burn(aliceWallet.address, tokenId, burnAmount)).to.emit(ERC1155FactorySmartContract, "TokenBurned");

        });


    });

    describe("Token Owners", () => {

        //return;

        beforeEach( async () => {
            
            await mintTokens();

        });

        it("Verifies the token rightful owners, soon after mint.", async () => {
        
            console.warn("     🟩 Mint Tokens");

            const nftItems: Array<any> = await ERC1155FactorySmartContract.getNFTItems();

            await expect(Snippets.parseNFTItem(nftItems[0]).creatorAddress[1]).to.equal(aliceWallet.address);
            await expect(Snippets.parseNFTItem(nftItems[1]).creatorAddress[1]).to.equal(aliceWallet.address);
            await expect(Snippets.parseNFTItem(nftItems[2]).creatorAddress[1]).to.equal(aliceWallet.address);
            await expect(Snippets.parseNFTItem(nftItems[3]).creatorAddress[1]).to.equal(aliceWallet.address);
            await expect(Snippets.parseNFTItem(nftItems[4]).creatorAddress[1]).to.equal(aliceWallet.address);

        });

        it("Verifies the token rightful owners, soon after transfers / ownership change", async () => {
        
            console.warn("     🟩 Transfer Tokens");

            await transferTokens();

            const nftItems: Array<any> = await ERC1155FactorySmartContract.getNFTItems();

            nftItems.map((nft:any, nftIndex:number)=>{
                
                // console.log(nft);

                // console.log(nftIndex, nft.tokenId, nft.minterAddress, nft.creatorAddress[0], nft.creatorAddress[1], nft.ownerAddress);

            })

            /*
            0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 // deployer
            0x70997970C51812dc3A010C7d01b50e0d17dc79C8 // alice
            0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC // bob
            0x90F79bf6EB2c4f870365E785982E1f101E93b906 // charlie
            0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65 // don

            console.log(deployerWallet.address);
            console.log(aliceWallet.address);
            console.log(bobWallet.address);
            console.log(charlieWallet.address);
            console.log(donWallet.address);

            */

            await expect(Snippets.parseNFTItem(nftItems[0]).ownerAddress).to.equal(bobWallet.address);
            await expect(Snippets.parseNFTItem(nftItems[1]).ownerAddress).to.equal(bobWallet.address);
            await expect(Snippets.parseNFTItem(nftItems[2]).ownerAddress).to.equal(charlieWallet.address);
            await expect(Snippets.parseNFTItem(nftItems[3]).ownerAddress).to.equal(donWallet.address);
            await expect(Snippets.parseNFTItem(nftItems[4]).ownerAddress).to.equal(donWallet.address);


        });

    });

    describe("Token Minter, Creator & Owner", () => {

        //return;
       
        beforeEach( async () => {
            
            await mintTokens();

            await transferTokens();

        });

        it("Retrieve all available tokens", async () => {
        
            console.warn("     🟩 Mint Tokens");

            const nftItems: Array<any> = await ERC1155FactorySmartContract.getNFTItems();
            
            expect(nftItems.length).to.equal(5);
            
        });

        it("Get token minting fee : getTokenMintingFee", async () => {

            let _mintingFee:number = 5_000_00;
            
            const transaction:any = await deployerWalletAccount.setMintingFee(_mintingFee);

            await transaction.wait();

            const mintingFee:number = await deployerWalletAccount.getTokenMintingFee();

            expect(mintingFee).to.equal(_mintingFee);

        });

        it("Get tokens minted by address : getTokensMintedByAddress", async () => {

            console.warn("     🟩 Set n Get tokens minted");
        
            const nftItems: Array<any> = await ERC1155FactorySmartContract.getTokensMintedByAddress(deployerWallet.address);

            expect(nftItems.length).to.equal(5);

            expect(Snippets.parseNFTItem(nftItems[0]).minterAddress).to.equal(deployerWallet.address);
            expect(Snippets.parseNFTItem(nftItems[1]).minterAddress).to.equal(deployerWallet.address);
            expect(Snippets.parseNFTItem(nftItems[2]).minterAddress).to.equal(deployerWallet.address);
            expect(Snippets.parseNFTItem(nftItems[3]).minterAddress).to.equal(deployerWallet.address);
            expect(Snippets.parseNFTItem(nftItems[4]).minterAddress).to.equal(deployerWallet.address);
            
        });

        it("Get tokens minted by me : getTokensMintedByMe", async () => {
            
            const nftItems: Array<any> = await deployerWalletAccount.getTokensMintedByMe();

            expect(nftItems.length).to.equal(5);

            expect(Snippets.parseNFTItem(nftItems[0]).minterAddress).to.equal(deployerWallet.address);
            expect(Snippets.parseNFTItem(nftItems[1]).minterAddress).to.equal(deployerWallet.address);
            expect(Snippets.parseNFTItem(nftItems[2]).minterAddress).to.equal(deployerWallet.address);
            expect(Snippets.parseNFTItem(nftItems[3]).minterAddress).to.equal(deployerWallet.address);
            expect(Snippets.parseNFTItem(nftItems[4]).minterAddress).to.equal(deployerWallet.address);
            
        });

        it("Get token minter : getTokenMinter", async () => {

            let _tokenId:number = 1;
        
            const tokenMinter:string = await ERC1155FactorySmartContract.getTokenMinter(_tokenId);

            expect(tokenMinter).to.equal(deployerWallet.address);
            
        });

        it("Get the first token mintee : getTokenMintee", async () => {

            let _tokenId:number = 2;

            const tokenMintee:string = await ERC1155FactorySmartContract.getTokenMintee(_tokenId);

            expect(tokenMintee).to.equal(aliceWallet.address);
            
        });

        it("Get tokens created by address : getTokensCreatedByAddress", async () => {

            console.warn("     🟩 Set n Get tokens created");
        
            const nftItems: Array<any> = await ERC1155FactorySmartContract.getTokensCreatedByAddress(deployerWallet.address);

            let nftItem:any = Snippets.parseNFTItem(nftItems[0]);

            expect(nftItems.length).to.equal(5);
            expect(nftItem.creatorAddress[0]).to.equal(deployerWallet.address);
            
        });

        it("Get tokens created by me : getTokensCreatedByMe", async () => {

            const nftItems: Array<any> = await deployerWalletAccount.getTokensCreatedByMe();

            let nftItem:any = Snippets.parseNFTItem(nftItems[0]);

            expect(nftItems.length).to.equal(5);
            expect(nftItem.creatorAddress[0]).to.equal(deployerWallet.address);

        });

        it("Get token creator : getTokenCreator", async () => {

            let _tokenId:number = 1;
        
            const tokenCreator:string = await ERC1155FactorySmartContract.getTokenCreator(_tokenId);

            expect(tokenCreator).to.equal(deployerWallet.address);
            
        });

        it("Get tokens owned by address : getTokensOwnedByAddress", async () => {

            console.warn("     🟩 Set n Get tokens owned");
        
            const deployerTokens: Array<any> = await ERC1155FactorySmartContract.getTokensOwnedByAddress(deployerWallet.address);

            //console.log("Owner 1", );

            expect(deployerTokens.length).to.equal(0);

            const address1Tokens: Array<any> = await ERC1155FactorySmartContract.getTokensOwnedByAddress(aliceWallet.address);

            //console.log("Owner 1", address1Tokens);

            expect(address1Tokens.length).to.equal(0);

            const address2Tokens: Array<any> = await ERC1155FactorySmartContract.getTokensOwnedByAddress(bobWallet.address);

            //console.log("Owner 2", address2Tokens);

            expect(address2Tokens.length).to.equal(2);

            const address3Tokens: Array<any> = await ERC1155FactorySmartContract.getTokensOwnedByAddress(charlieWallet.address);

            //console.log("Owner 3", address3Tokens);

            expect(address3Tokens.length).to.equal(1);

            const address4Tokens: Array<any> = await ERC1155FactorySmartContract.getTokensOwnedByAddress(donWallet.address);

            //console.log("Owner 4", address4Tokens);

            expect(address4Tokens.length).to.equal(2);

        });

        it("Get tokens owned by me : getTokensOwnedByMe", async () => {
            
            const deployerTokens: Array<any> = await donWalletAccount.getTokensOwnedByMe();

            expect(deployerTokens.length).to.equal(2);

        });

        it("Get token owner : getTokenOwner", async () => {

            let _tokenId:number = 2;
        
            const tokenOwner:string = await ERC1155FactorySmartContract.getTokenOwner(_tokenId);

            expect(tokenOwner).to.equal(bobWallet.address);
            
        });

    });

    describe("Interact with State Variables via Getters & Setters", () => {

        //return;

        it("Get the base uri : getBaseURI", async () => {

            console.warn("     🟩 URIs");

            let _baseURI: string = "https://domain.tld/base/url/";
            
            await deployerWalletAccount.setBaseURI(_baseURI);

            const baseURI: string = await deployerWalletAccount.getBaseURI();

            expect(baseURI).to.equal(_baseURI);

        });

        it("Get the token uri : getTokenURI", async () => {

            await mintTokens();

            const tokenId:number = 1;

            const _baseURI:string = `https://domain.tld/`;

            const _tokenURI: string = `uri-token-${tokenId}.json`;

            await ERC1155FactorySmartContract.setBaseURI(_baseURI);

            const baseURI: string = await ERC1155FactorySmartContract.getBaseURI();

            const tokenURI: string = await ERC1155FactorySmartContract.getTokenURI(tokenId);

            expect(`${tokenURI}`).to.equal(`${baseURI}${_tokenURI}`);
            
        });

        
        it("Get the token current counter : getTokenCurrentSupply", async () => {

            console.warn("     🟩 Token Counter");

            let _tokenIdCounter: string = "5";
            
            await mintTokens();

            const tokenIdCounter: string = await deployerWalletAccount.getTokenCurrentSupply();

            expect(tokenIdCounter).to.equal(_tokenIdCounter);

        });

        it("Get the owner of the smart contract : getOwner", async () => {

            console.warn("     🟩 Contract Owner");

            let _owner: string = deployerWallet.address;

            const owner: string = await deployerWalletAccount.getOwner();

            expect(owner).to.equal(_owner);

        });

        it("Set the new owner of the smart contract : setNewOwner", async () => {

            let _owner: string = deployerWallet.address;

            let _newOwner: string = donWallet.address;

            const owner: string = await deployerWalletAccount.getOwner();

            expect(owner).to.equal(_owner);

            await ERC1155FactorySmartContract.setNewOwner(_newOwner);

            const newOwner: string = await deployerWalletAccount.getOwner();

            expect(newOwner).to.equal(_newOwner);

        });

        it("Sets n Gets the approved operator : setApprovalForAll", async () => {

            console.warn("     🟩 Approved Address");

            let _account: string = aliceWallet.address;
            
            let _operator: string = donWallet.address;
            
            let transaction:any;
                
            transaction = await aliceWalletAccount.setApprovalForAll(
                _operator,
                true
            );

            await transaction.wait();

            const isApproved:any = await ERC1155FactorySmartContract.isApprovedForAll(_account, _operator);

            expect(isApproved).to.be.true;

        });

        it("Set the default royalty receiver + fraction : setDefaultRoyalty", async () => {

            console.warn("     🟩 Royalties");

            let _royaltyReceiver:string = charlieWallet.address;
            
            let _royaltyFraction:number = 200;
            
            let _royaltyDenominator:number = 10_000;
            
            let _tokenId:number = 200;
            
            let _tokenPrice:number = 1_000_000;
            
            let transaction:any;
                
            transaction = await deployerWalletAccount.setDefaultRoyalty(
                _royaltyReceiver,
                _royaltyFraction
            );

            await transaction.wait();

            const royaltyInfo:any = await deployerWalletAccount.royaltyInfo(_tokenId, _tokenPrice);

            expect(royaltyInfo[0]).to.equal(_royaltyReceiver);

            expect(royaltyInfo[1]).to.equal(_royaltyFraction / _royaltyDenominator * _tokenPrice);

        });

        it("Set the token royalty receiver + fraction : setTokenRoyalty", async () => {

            let _royaltyReceiver:string = donWallet.address;
            
            let _royaltyFraction:number = 200;
            
            let _royaltyDenominator:number = 10_000;
            
            let _tokenId:number = 200;
            
            let _tokenPrice:number = 1_000_000;
            
            let transaction:any;
                
            transaction = await deployerWalletAccount.setTokenRoyalty(
                _tokenId,
                _royaltyReceiver,
                _royaltyFraction
            );

            await transaction.wait();

            const royaltyInfo:any = await deployerWalletAccount.royaltyInfo(_tokenId, _tokenPrice);

            expect(royaltyInfo[0]).to.equal(_royaltyReceiver);

            expect(royaltyInfo[1]).to.equal(_royaltyFraction / _royaltyDenominator * _tokenPrice);

        });

        it("Get the token maximum supply : getTokenMaximumSupply", async () => {

            console.warn("     🟩 Supply");

            const maximumSupply: string = await deployerWalletAccount.getTokenMaximumSupply();

            expect(maximumSupply).to.equal(MAXIMUM_SUPPLY);

        });

        it("Get the token current supply : getTokenCurrentSupply", async () => {

            let _tokens:any = await mintTokens();

            const currentSupply: string = await deployerWalletAccount.getTokenCurrentSupply();

            expect(currentSupply).to.equal(_tokens.length);

        });

    });

    describe("Event Emissions", () => {

        //return;
    
        beforeEach( async () => {
            
            await mintTokens();

            await transferTokens();

        });

        it("Dispatched when the contract owner has been updated : OwnerChanged", async () => {
        
            console.warn("     🟩 Emit Events");

            await expect(ERC1155FactorySmartContract.setNewOwner(donWallet.address))
                .to.emit(ERC1155FactorySmartContract, "OwnerChanged")
                .withArgs(donWallet.address);

        });

        it("Dispatched when the base uri has been updated : BaseURIChanged", async () => {
            
            let _baseURI:string = "http://<HOSTNAME>";
    
            await expect(ERC1155FactorySmartContract.setBaseURI(_baseURI))
                .to.emit(ERC1155FactorySmartContract, "BaseURIChanged")
                .withArgs(_baseURI);
    
        });
    
        it("Dispatched when the mining fee has been updated : MintingFeeChanged", async () => {
            
            let _newMintingFee:number = 100;
    
            await expect(ERC1155FactorySmartContract.setMintingFee(_newMintingFee))
                .to.emit(ERC1155FactorySmartContract, "MintingFeeChanged")
                .withArgs(_newMintingFee);
    
        });
    
        it("Dispatched when a token has been minted : TokenMinted", async () => {
            
            let _from:string = Snippets.ZERO_ADDRESS;
            let _to:string = bobWallet.address;
            let _tokenURI:string = "https://www.domain.tld";
            let _tokenId:number = 7;
            let _amount:number = 1;
            let _maximumSupply:number = MAXIMUM_SUPPLY;
            let _data:string = "0x0000";
            let _mintingFee:number = 1_000;
            let _currentSupply:number = parseInt(await ERC1155FactorySmartContract.getTokenCurrentSupply());

            await ERC1155FactorySmartContract.setMintingFee(_mintingFee);

            await expect(ERC1155FactorySmartContract.mintSingle(
                    _to,
                    _tokenId,
                    _amount,
                    _maximumSupply,
                    _tokenURI,
                    _data,
                    {value: _mintingFee}
                ))
                .to.emit(ERC1155FactorySmartContract, "TokenMinted")
                .withArgs(_from, _to, _tokenId, _amount);

            expect(await ERC1155FactorySmartContract.getTokenCurrentSupply()).to.equal(_currentSupply+1);
    
        });
    
        it("Dispatched when a token has been burnt : TokenBurned", async () => {
            
            let _from:string = donWallet.address;
            let _to:string = Snippets.ZERO_ADDRESS;
            let _tokenId:number = 5;
            let _amount:number = 1;
    
            await expect(donWalletAccount.burn(_from, _tokenId, _amount))
                .to.emit(ERC1155FactorySmartContract, "TokenBurned")
                .withArgs(_from, _to, _tokenId, _amount);
    
        });
    
        it("Dispatched when a token has been transfered : TokenTransfered", async () => {
            
            let _from:string = aliceWallet.address;
            let _to:string = charlieWallet.address;
            let _tokenId:number = 5;
            let _amount:number = 1;
            let _data:string = "0x0000";

            await expect(aliceWalletAccount.transferToken(
                _from,
                _to,
                _tokenId,
                _amount,
                _data
            )).to.emit(ERC1155FactorySmartContract, "TokenTransfered")
                .withArgs(_from, _to, _tokenId, _amount);
    
        });
    
        it("Dispatched when the contract has received funds. : Received", async () => {
            
            let _account:string = deployerWallet.address;
            let _amount:number = 100;
    
            await expect(ERC1155FactorySmartContract.fallback({value: _amount}))
                .to.emit(ERC1155FactorySmartContract, "Received")
                .withArgs(_account, _amount);
    
        });

    
    });

    describe("Error Handling", () => {

        //return;
   
        beforeEach( async () => {
            
            await mintTokens();

            await transferTokens();

        });


        it("Insufficient permissions for caller : InsufficientPermissions", async () => {
        
            console.warn("     🟩 Throw Errors");

            
            let _account:string = charlieWallet.address;

            let _role:string = Snippets.MINTER_ROLE;

            let _to:string = bobWallet.address;
            let _tokenURI:string = "https://www.domain.tld";
            let _tokenId:number = 7;
            let _amount:number = 1;
            let _maximumSupply:number = MAXIMUM_SUPPLY;
            let _data:string = "0x0000";
            let _mintingFee:number = 1_000;

            await ERC1155FactorySmartContract.setMintingFee(_mintingFee);

            await expect(charlieWalletAccount.mintSingle(
                    _to,
                    _tokenId,
                    _amount,
                    _maximumSupply,
                    _tokenURI,
                    _data,
                    {value: _mintingFee}
                ))
                .to.be.revertedWithCustomError(ERC1155FactorySmartContract, "InsufficientPermissions")
                .withArgs(_account, _role);

        });

        it("Caller is not approved or owner of the token : NotTokenOwner", async () => {
        
            let _from:string = donWallet.address;
            let _to:string = charlieWallet.address;
            let _tokenId:number = 1;
            let _amount:number = 1;
            let _data:string = "0x0000";

            await expect(donWalletAccount.transferToken(
                _from,
                _to,
                _tokenId,
                _amount,
                _data
            ))
            .to.be.revertedWithCustomError(ERC1155FactorySmartContract, "ERC1155InsufficientBalance")
            //.to.be.revertedWith("ERC1155: insufficient balance for transfer");

        });

        it("Contract must have admins : NoAdmins", async () => {
        
            let _admins: Array<any> = args.contractABI[2];

            let _hasAdminRole: boolean = await ERC1155FactorySmartContract.hasRole(Snippets.ADMIN_ROLE, deployerWallet.address);

            expect(_hasAdminRole).to.be.true;

            _admins.map(async (_account: string) => {

                await expect(await ERC1155FactorySmartContract.hasRole(Snippets.ADMIN_ROLE, _account)).to.be.true;

            });

        });

        it("Contract must have minters : NoMinters ", async () => {
        
            let _minters: Array<any> = args.contractABI[3];

            let _hasMinterRole: boolean = await ERC1155FactorySmartContract.hasRole(Snippets.MINTER_ROLE, deployerWallet.address);

            expect(_hasMinterRole).to.be.true;

            _minters.map(async (_account: string) => {

                await expect(await ERC1155FactorySmartContract.hasRole(Snippets.ADMIN_ROLE, _account)).to.be.true;

            });

        });

        it("Can only mint upto the maximum total supply : MaximumTokenSupplyReached", async () => {
        
            let _maxValue:number = parseInt(MAXIMUM_SUPPLY);

            let nftItems: any = await mintTokens(6, _maxValue - 5);

            let _overflowTokenId:number = nftItems.length + 1;

            expect(nftItems.length).to.be.equal(_maxValue);

            let _to:string = bobWallet.address;
            let _tokenURI:string = "https://www.domain.tld";
            let _amount:number = 1;
            let _maximumSupply:number = MAXIMUM_SUPPLY;
            let _data:string = "0x0000";
            let _mintingFee:number = 1_000;

            await ERC1155FactorySmartContract.setMintingFee(_mintingFee);

            await expect(deployerWalletAccount.mintSingle(
                    _to,
                    _overflowTokenId,
                    _amount,
                    _maximumSupply,
                    _tokenURI,
                    _data,
                    {value: _mintingFee}
                ))
                .to.be.revertedWithCustomError(ERC1155FactorySmartContract, "MaximumTokenSupplyReached")
                .withArgs(_maxValue, _overflowTokenId);
            
        });

        it("Specified token id must be less than the maximum supply defined : IndexOutOfBounds", async () => {

            let _maxValue:number = parseInt(MAXIMUM_SUPPLY);

            let _overflowTokenId:number = _maxValue+1;

            expect(await charlieWalletAccount.getTokenOwner(
                _overflowTokenId
            ))
            .to.be.equal(Snippets.ZERO_ADDRESS);

        });

        it("Specified token id must be more than minimum value specified : IndexOutOfBounds", async () => {
        
            let _underflowTokenId:number = 0;

            expect(await charlieWalletAccount.getTokenOwner(
                _underflowTokenId
            ))
            .to.be.equal(Snippets.ZERO_ADDRESS);

        });

        it("Specified id must represent an already minted token. Also the token must not have been burned : TokenDoesNotExists", async () => {
        
            let nftItems: Array<any> = await ERC1155FactorySmartContract.getNFTItems();

            let _invalidTokenId:number = nftItems.length + 1;

            await expect(charlieWalletAccount.getTokenOwner(
                _invalidTokenId
            ))
            .not.to.be.properAddress;

        });

        it("Specified amount must be equal to the minting fee defined : PriceBelowMintingFee", async () => {
        
            let _to:string = bobWallet.address;
            let _tokenURI:string = "https://www.domain.tld";
            let _tokenId:number = 7;
            let _amount:number = 1;
            let _maximumSupply:number = MAXIMUM_SUPPLY;
            let _data:string = "0x0000";
            let _mintingFee:number = 1_000;

            await ERC1155FactorySmartContract.setMintingFee(_mintingFee);

            await expect(deployerWalletAccount.mintSingle(
                    _to,
                    _tokenId,
                    _amount,
                    _maximumSupply,
                    _tokenURI,
                    _data,
                    {value: (_mintingFee - 1)}
                ))
                .to.be.revertedWithCustomError(ERC1155FactorySmartContract, "PriceBelowMintingFee")
                .withArgs(_mintingFee, (_mintingFee - 1));

        });

        it("The caller must not be a contract address : UnAuthorizedCaller", async () => {
        
            

        });

    });

    describe("Search Capabilities", () => {

        //return;
     
        it("Search using a string : searchTokenURI", async () => {

            console.warn("     🟩 Search : Basic");
            
            await mintTokens();

            let _searchQuery:string = "uri-token-1.json";

            const searchResults: any = await ERC1155FactorySmartContract.searchTokenURI(_searchQuery);

            expect(searchResults.length).to.equal(1);

        });
        
        it("Search using a uint256 : searchTokenId", async () => {

            await mintTokens();

            let _tokenId:number = 5;

            const searchResults: any = await ERC1155FactorySmartContract.searchTokenId(_tokenId);

            let nftItem:any = Snippets.parseNFTItem(searchResults[0]);

            expect(searchResults.length).to.equal(1);
            expect(nftItem.tokenId).to.equal(_tokenId);

        });
        
        it("Search using a timestamp CREATED_BEFORE : searchTimestamp", async () => {

            console.warn("     🟩 Search : Created Timestamp");
            
            await mintTokens();

            let _timestamp:number = parseInt(`${new Date().getTime() / 1000}`) + 5000;

            const searchResults: any = await ERC1155FactorySmartContract.searchTimestamp(Snippets.CREATED_BEFORE, _timestamp);

            let nftItem:any = Snippets.parseNFTItem(searchResults[0]);

            expect(searchResults.length).to.equal(5);
            expect(nftItem.createdAt).to.lt(_timestamp);

        });
        
        it("Search using a timestamp CREATED_AT : searchTimestamp", async () => {

            let nftItems: Array<any> = await mintTokens();

            let _timestamp:number = Snippets.parseNFTItem(nftItems[0]).createdAt;

            const searchResults: any = await ERC1155FactorySmartContract.searchTimestamp(Snippets.CREATED_AT, _timestamp);

            let nftItem:any = Snippets.parseNFTItem(searchResults[0]);

            expect(searchResults.length).to.gt(0);
            expect(nftItem.createdAt).to.equal(_timestamp);

        });
        
        it("Search using a timestamp CREATED_AFTER : searchTimestamp", async () => {

            await mintTokens();

            let _timestamp:number = parseInt(`${new Date().getTime() / 1000}`) - 5000;

            const searchResults: any = await ERC1155FactorySmartContract.searchTimestamp(Snippets.CREATED_AFTER, _timestamp);

            let nftItem:any = Snippets.parseNFTItem(searchResults[0]);

            expect(searchResults.length).to.equal(5);
            expect(nftItem.createdAt).to.gt(_timestamp);

        });
        
        it("Search using a timestamp UPDATED_BEFORE : searchTimestamp", async () => {

            console.warn("     🟩 Search : Updated Timestamp");
            
            await mintTokens();

            let _timestamp:number = parseInt(`${new Date().getTime() / 1000}`) + 5000;

            const searchResults: any = await ERC1155FactorySmartContract.searchTimestamp(Snippets.UPDATED_BEFORE, _timestamp);

            expect(searchResults.length).to.equal(5);
            expect(Snippets.parseNFTItem(searchResults[0]).updatedAt).to.lt(_timestamp);

        });
        
        it("Search using a timestamp UPDATED_AT : searchTimestamp", async () => {

            let nftItems: Array<any> = await mintTokens();

            let _timestamp:number = Snippets.parseNFTItem(nftItems[0]).updatedAt;

            const searchResults: any = await ERC1155FactorySmartContract.searchTimestamp(Snippets.UPDATED_AT, _timestamp);

            expect(searchResults.length).to.gt(0);
            expect(Snippets.parseNFTItem(searchResults[0]).updatedAt).to.equal(_timestamp);

        });
        
        it("Search using a timestamp UPDATED_AFTER : searchTimestamp", async () => {

            await mintTokens();

            let _timestamp:number = parseInt(`${new Date().getTime() / 1000}`) - 5000;

            const searchResults: any = await ERC1155FactorySmartContract.searchTimestamp(Snippets.UPDATED_AFTER, _timestamp);

            expect(searchResults.length).to.equal(5);
            expect(Snippets.parseNFTItem(searchResults[0]).updatedAt).to.gt(_timestamp);

        });
        
        it("Search using an account address : searchAddress", async () => {

            console.warn("     🟩 Search : Accounts");
            
            await mintTokens();

            await transferTokens(); 

            const searchResults: any = await ERC1155FactorySmartContract.searchAddress(Snippets.ADDRESS, donWallet.address);

            expect(searchResults.length).to.equal(2);

            expect(Snippets.parseNFTItem(searchResults[0]).minterAddress).to.equal(deployerWallet.address);

            expect(Snippets.parseNFTItem(searchResults[0]).ownerAddress).to.equal(donWallet.address);

        });
        
        it("Search using an account address MINTER : searchAddress", async () => {
            
            await mintTokens();

            const searchResults: any = await ERC1155FactorySmartContract.searchAddress(Snippets.MINTER, deployerWallet.address);

            expect(searchResults.length).to.equal(5);
            expect(Snippets.parseNFTItem(searchResults[0]).minterAddress).to.equal(deployerWallet.address);

        });
        
        it("Search using an account address CREATOR : searchAddress", async () => {
            
            await mintTokens();

            const searchResults: any = await ERC1155FactorySmartContract.searchAddress(Snippets.CREATOR, aliceWallet.address);

            expect(searchResults.length).to.equal(5);
            expect([deployerWallet.address, aliceWallet.address].includes(Snippets.parseNFTItem(searchResults[0]).minterAddress)).to.be.true;

        });
        
        it("Search using an account address OWNER : searchAddress", async () => {
            
            await mintTokens();

            await transferTokens();

            // Don's Account
            let searchResults: any = await ERC1155FactorySmartContract.searchAddress(Snippets.OWNER, donWallet.address);

            let nftItem: any = Snippets.parseNFTItem(searchResults[0]);
            
            let tokenOwner: string = await ERC1155FactorySmartContract.getTokenOwner(nftItem.tokenId);

            expect(searchResults.length).to.equal(2);
            expect(tokenOwner).to.equal(donWallet.address);
            expect(nftItem.ownerAddress).to.equal(donWallet.address);

        });
        
    });

    describe("Role Management", () => {

        //return;
      
        beforeEach( async () => {
            
            await mintTokens();

        });

        it("Can grant an ADMIN role : grantAdminRole", async () => {
        
            console.warn("     🟩 ADMIN Roles");

            await deployerWalletAccount.grantAdminRole(donWallet.address);

            const donWalletHasAdminRole = await ERC1155FactorySmartContract.hasRole(Snippets.ADMIN_ROLE, donWallet.address);

            expect(donWalletHasAdminRole).to.be.true;

        });

        it("Can revoke an ADMIN role : revokeAdminRole", async () => {

            await deployerWalletAccount.grantAdminRole(donWallet.address);

            const donWalletHasAdminRole = await ERC1155FactorySmartContract.hasRole(Snippets.ADMIN_ROLE, donWallet.address);

            expect(donWalletHasAdminRole).to.be.true;

            await deployerWalletAccount.revokeAdminRole(donWallet.address);

            const donWalletStillHasAdminRole = await ERC1155FactorySmartContract.hasRole(Snippets.ADMIN_ROLE, donWallet.address);

            expect(donWalletStillHasAdminRole).to.be.false;

        });

        it("Can renounce an ADMIN role, can only renounce own account : renounceAdminRole", async () => {

            await deployerWalletAccount.grantAdminRole(donWallet.address);

            const donWalletHasAdminRole = await ERC1155FactorySmartContract.hasRole(Snippets.ADMIN_ROLE, donWallet.address);

            expect(donWalletHasAdminRole).to.be.true;

            await expect(deployerWalletAccount.renounceAdminRole(donWallet.address))
                .to.be.reverted;

            await donWalletAccount.renounceAdminRole(donWallet.address);

            const donWalletStillHasAdminRole = await ERC1155FactorySmartContract.hasRole(Snippets.ADMIN_ROLE, donWallet.address);

            expect(donWalletStillHasAdminRole).to.be.false;

        });

        it("Can renounce ownership of the smart contract : renounceContractOwnership", async () => {

            const deployerWalletHasAdminRole = await ERC1155FactorySmartContract.hasRole(Snippets.ADMIN_ROLE, deployerWallet.address);

            expect(deployerWalletHasAdminRole).to.be.true;

            const contractOwner:string = await ERC1155FactorySmartContract.getOwner();

            expect(contractOwner).to.be.equal(deployerWallet.address);

            await expect(charlieWalletAccount.renounceContractOwnership())
                .to.be.revertedWithCustomError(ERC1155FactorySmartContract, "InsufficientPermissions")
                .withArgs(
                    charlieWallet.address, 
                    Snippets.ADMIN_ROLE
                );

            await deployerWalletAccount.renounceContractOwnership();

            const newContractOwner:string = await ERC1155FactorySmartContract.getOwner();

            expect(newContractOwner).to.be.equal(Snippets.ZERO_ADDRESS);

        });

        it("Can grant an MINTER role : grantMinterRole", async () => {
        
            console.warn("     🟩 MINTER Roles");

            await deployerWalletAccount.grantMinterRole(donWallet.address);

            const donWalletHasMinterRole = await ERC1155FactorySmartContract.hasRole(Snippets.MINTER_ROLE, donWallet.address);

            expect(donWalletHasMinterRole).to.be.true;

        });

        it("Can revoke an MINTER role : revokeMinterRole", async () => {

            await deployerWalletAccount.grantMinterRole(donWallet.address);

            const donWalletHasMinterRole = await ERC1155FactorySmartContract.hasRole(Snippets.MINTER_ROLE, donWallet.address);

            expect(donWalletHasMinterRole).to.be.true;

            await deployerWalletAccount.revokeMinterRole(donWallet.address);

            const donWalletStillHasMinternRole = await ERC1155FactorySmartContract.hasRole(Snippets.MINTER_ROLE, donWallet.address);

            expect(donWalletStillHasMinternRole).to.be.false;

        });

        it("Can renounce an MINTER role, can only renounce own account : renounceMinterRole", async () => {

            await deployerWalletAccount.grantMinterRole(donWallet.address);

            const donWalletHasMinterRole = await ERC1155FactorySmartContract.hasRole(Snippets.MINTER_ROLE, donWallet.address);

            expect(donWalletHasMinterRole).to.be.true;

            await expect(deployerWalletAccount.renounceMinterRole(donWallet.address))
                .to.be.reverted;

            await donWalletAccount.renounceMinterRole(donWallet.address);

            const donWalletStillHasMinterRole = await ERC1155FactorySmartContract.hasRole(Snippets.MINTER_ROLE, donWallet.address);

            expect(donWalletStillHasMinterRole).to.be.false;

        });

    });

    //await mintTokens(11, 90);

    await new Promise(res =>  setTimeout(() => res(null), 5000));

});

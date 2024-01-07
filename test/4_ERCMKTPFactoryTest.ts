import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { any } from "hardhat/internal/core/params/argumentTypes";
import { assert } from "console";
import { moveTime } from "../scripts/helpers/deployer-helper";

const fs = require('fs');

const Snippets = require("../scripts/libs/Snippets");

const MAXIMUM_SUPPLY: number | any = parseInt(`${process.env.MAXIMUM_SUPPLY_1155}`);

const CHAIN_IDS:Array<any> = process.env.CHAIN_IDS !== null ? String(process.env.CHAIN_IDS).split(",") : [];

const provider: any = ethers.getDefaultProvider();

const targetDir:string = './test/txt/';

fs.mkdirSync(targetDir, { recursive: true });

//ERC721
const ERC721SmartContractAddressBuffer:any = fs.readFileSync(`${targetDir}ERC721.txt`);

const ERC721SmartContractAddress:string = ERC721SmartContractAddressBuffer.toString();

const ERC721SmartContractABIBuffer:any = fs.readFileSync(`./artifacts/contracts/ERC721Factory.sol/ERC721Factory.json`);

let ERC721SmartContractABI:any = ERC721SmartContractABIBuffer.toString();

let ERC721DeployedSmartContract: any;

//ERC1155
const ERC1155SmartContractAddressBuffer:any = fs.readFileSync(`${targetDir}ERC1155.txt`);

const ERC1155SmartContractAddress:string = ERC1155SmartContractAddressBuffer.toString();

const ERC1155SmartContractABIBuffer:any = fs.readFileSync(`./artifacts/contracts/ERC1155Factory.sol/ERC1155Factory.json`);

let ERC1155SmartContractABI: any = ERC1155SmartContractABIBuffer.toString();

let ERC1155DeployedSmartContract: any;

//ERCMKTP
const ERCLoggerSmartContractAddressBuffer: any = fs.readFileSync(`${targetDir}ERCLogger.txt`);

const ERCLoggerSmartContractAddress: string = ERCLoggerSmartContractAddressBuffer.toString();

const ERCLoggerSmartContractABIBuffer: any = fs.readFileSync(`./artifacts/contracts/ERCLogger.sol/ERCLogger.json`);

let ERCLoggerSmartContractABI: any = ERCLoggerSmartContractABIBuffer.toString();

describe("ERCMKTPFactory", async function () {

    let ERCMKTPFactorySmartContract:any;

    let deployerWallet:any, aliceWallet:any, bobWallet:any, charlieWallet:any, donWallet:any, args:any;

    let deployerWalletAccount:any;
    let aliceWalletAccount:any;
    let bobWalletAccount:any;
    let charlieWalletAccount:any;
    let donWalletAccount:any;

    beforeEach( async () => {

        const { smartContract, _deployerWallet, _aliceWallet, _bobWallet, _charlieWallet, _donWallet, _args } = await loadFixture(deploySmartContract);

        ERCMKTPFactorySmartContract = smartContract;
        deployerWallet = _deployerWallet;
        aliceWallet = _aliceWallet;
        bobWallet = _bobWallet;
        charlieWallet = _charlieWallet;
        donWallet = _donWallet;
        args = _args;

        deployerWalletAccount = await ERCMKTPFactorySmartContract.connect(deployerWallet);
        aliceWalletAccount = await ERCMKTPFactorySmartContract.connect(aliceWallet);
        bobWalletAccount = await ERCMKTPFactorySmartContract.connect(bobWallet);
        charlieWalletAccount = await ERCMKTPFactorySmartContract.connect(charlieWallet);
        donWalletAccount = await ERCMKTPFactorySmartContract.connect(donWallet);

    });

    const deploySmartContract = async (): Promise<{ smartContract: any; _deployerWallet:any ; _aliceWallet: any; _bobWallet: any, _charlieWallet: any, _donWallet: any, _args:any }> => {

        const [_deployerWallet, _aliceWallet, _bobWallet, _charlieWallet, _donWallet] = await ethers.getSigners();

        console.log("      💰  Deploying contracts with the account:", _deployerWallet.address);

        //console.log("      💴  Account balance:", (await provider.getBalance(_deployerWallet.address)).toString());

        console.log("      💴  Account address:", _deployerWallet.address, _aliceWallet.address, _bobWallet.address, _charlieWallet.address, _donWallet.address);

        const CONTRACT_FILE: any = process.env.CONTRACT_FILE_MKTP;

        const CONTRACT_PARAMS: any = require(`../scripts/contract-configs/${CONTRACT_FILE}.Config.ts`)

        // Setup Logger
        
        const ContractLogger = await ethers.getContractFactory(CONTRACT_PARAMS.LOGGER_LIBRARY);
        const contractLogger = await ContractLogger.deploy();
        await contractLogger.waitForDeployment();

        const loggerAddress:string = await contractLogger.getAddress();

        const targetDir: string = './test/txt/';

        fs.mkdirSync(targetDir, { recursive: true });

        fs.writeFileSync(`${targetDir}ERCLogger.txt`, loggerAddress);

        console.log("::: LOGGER CONTRACT ADDRESS ::: ", loggerAddress);

        // Setup Library

        const ContractLinkedLibrary = await ethers.getContractFactory(CONTRACT_PARAMS.LINKED_LIBRARY);
        const contractLinkedLibrary = await ContractLinkedLibrary.deploy();
        await contractLinkedLibrary.waitForDeployment();

        const ERCMKTPLSmartContract:any = await ethers.getContractFactory(
            CONTRACT_FILE,
            {
                libraries: {
                    Snippets: await contractLinkedLibrary.getAddress(),
                },
            }
        );

        
        console.log([
            "Deploy Args:\n",
            CONTRACT_PARAMS.ABI_VALUES,
            CONTRACT_PARAMS.ABI_ENCODED
        ]);
        

        const smartContract = await ERCMKTPLSmartContract.deploy(
            CONTRACT_PARAMS.ABI_ENCODED
        );

        await smartContract.waitForDeployment();

        CHAIN_IDS.map(async (chain: any) => {

            const path: any = `../frontend/src/_services/providers/data/context/libs/artifacts/${chain}`;

            if (!fs.existsSync(path)) {
                fs.mkdirSync(path, { recursive: true });
            }

            // Addresses

            const smartContractAddress: string = await smartContract.getAddress();

            fs.writeFileSync(
                `${path}/ERCMKTPFactoryAddress.json`,
                `{ "address": "${smartContractAddress}" }`
            );

            // Contracts

            fs.copyFile('./artifacts/contracts/ERCMKTPFactory.sol/ERCMKTPFactory.json', `${path}/ERCMKTPFactoryContract.json`, (err: any) => {
                if (err) throw err;
                console.log('Artifact file [ ERCMKTPFactory + Address ] copied successfully!');
            });

        })

        const _args:any = {
            contractABI: CONTRACT_PARAMS.ABI_VALUES
        }

        //Set Logger address

        const loggerTxnMKTP:any = await smartContract.connect(_deployerWallet).setLoggerAddress(ERCLoggerSmartContractAddress);

        await loggerTxnMKTP.wait();

        //For Testing purposes, approve the Marketplace

        let _txt: any;

        let _marketplaceAddress: string = await smartContract.getAddress();
        
        ERC721SmartContractABI = JSON.parse(ERC721SmartContractABI);

        ERC721DeployedSmartContract = new ethers.Contract(ERC721SmartContractAddress, ERC721SmartContractABI.abi, provider)

        //

        // console.log("\n:::\n");

        // console.log("::: ERC721DeployedSmartContract CONTRACT ADDRESS ::: ", ERC721SmartContractAddress, await ERC721DeployedSmartContract.getAddress());

        // console.log("::: ERC721DeployedSmartContract CONTRACT OWNER ::: ", await ERC721DeployedSmartContract.connect(_donWallet).getOwner());

        // console.log("::: ERC721DeployedSmartContract DEPLOYER ADDRESS ::: ", _deployerWallet.address);

        // console.log("::: ERC721DeployedSmartContract DEAN ADDRESS ::: ", _donWallet.address);

        // console.log("::: ERC721DeployedSmartContract TOKEN OWNER ::: ", await ERC721DeployedSmartContract.connect(_donWallet).ownerOf(1));

        // console.log("::: ERC721DeployedSmartContract MKTPC ::: ", _marketplaceAddress);

        // Set Marketplace address
        
        _txt = await ERC721DeployedSmartContract.connect(_aliceWallet).setMarketplaceAddress(_marketplaceAddress);

        await _txt.wait();

        //Set Logger address

        _txt = await ERC721DeployedSmartContract.connect(_aliceWallet).setLoggerAddress(loggerAddress);

        await _txt.wait();

        console.log("\n:::\n");

        ERC1155SmartContractABI = JSON.parse(ERC1155SmartContractABI);

        ERC1155DeployedSmartContract = new ethers.Contract(ERC1155SmartContractAddress, ERC1155SmartContractABI.abi, provider);

        // console.log("::: ERC1155DeployedSmartContract CONTRACT ADDRESS ::: ", ERC1155SmartContractAddress, await ERC1155DeployedSmartContract.getAddress());

        // console.log("::: ERC1155DeployedSmartContract CONTRACT OWNER ::: ", await ERC1155DeployedSmartContract.connect(_donWallet).getOwner());

        // console.log("::: ERC1155DeployedSmartContract DEPLOYER ADDRESS ::: ", _deployerWallet.address);

        // console.log("::: ERC1155DeployedSmartContract ALICE ADDRESS ::: ", _aliceWallet.address);

        // console.log("::: ERC1155DeployedSmartContract TOKEN OWNER ::: ", await ERC1155DeployedSmartContract.connect(_aliceWallet).getTokenOwner(1));

        // console.log("::: ERC1155DeployedSmartContract MKTPC ::: ", _marketplaceAddress);

        // Set Marketplace address

        _txt = await ERC1155DeployedSmartContract.connect(_aliceWallet).setMarketplaceAddress(_marketplaceAddress);

        await _txt.wait();

        //Set Logger address

        _txt = await ERC1155DeployedSmartContract.connect(_aliceWallet).setLoggerAddress(loggerAddress);

        await _txt.wait();

        return { smartContract, _deployerWallet, _aliceWallet, _bobWallet, _charlieWallet, _donWallet, _args };

    }

    const createMarketplaceItems = async (count:number = 5, auctionHours:number=0) => {

        let listingFee:number = args.contractABI[2];

        let price:number = 100;

        let txn: any;

        let isApprovedForAll: boolean;

        let approvedAddress: string;

        let marketplaceAddress: any = await ERCMKTPFactorySmartContract.getAddress();

        let _eventFilter: any;
        let _eventReceipt: any;

        let offset721: number = 0;
        let offset1155: number = 0;

        /// 721

        let marketplaceAddress721: any = await ERC721DeployedSmartContract.connect(deployerWallet).getMarketplaceAddress();

        expect(marketplaceAddress721).to.equal(marketplaceAddress);

        if (marketplaceAddress721 === marketplaceAddress) {

            if (count > 0) {

                let mintingFee721: any = await ERC721DeployedSmartContract.connect(deployerWallet).getTokenMintingFee();
                
                let currentSupply721: number = parseInt(`${await ERC721DeployedSmartContract.connect(deployerWallet).getTokenCurrentSupply()}`);

                offset721 = currentSupply721 + 1;

                for (let tokenId: number = offset721; tokenId < offset721 + count; tokenId++) {
                    
                    let txn: any = await ERC721DeployedSmartContract.connect(deployerWallet).mintNewToken(
                        aliceWallet.address,
                        `metadata-${tokenId}.json`,
                        tokenId,
                        { value: mintingFee721 }
                    );

                    await txn.wait();

                    //const items: any = await ERC721DeployedSmartContract.connect(aliceWallet).getNFTItems();

                    //const item: any = await ERC721DeployedSmartContract.connect(aliceWallet).getNFTItem(tokenId);

                    const owner: any = await ERC721DeployedSmartContract.connect(aliceWallet).ownerOf(tokenId);

                    expect(owner).to.equal(aliceWallet.address);

                    //console.log("TOKEN ID, ITEM, OWNER, ITEMS #", tokenId, item, owner, items);

                    txn = await ERC721DeployedSmartContract.connect(aliceWallet).approve(marketplaceAddress721, tokenId);

                    await txn.wait();

                    isApprovedForAll = await ERC721DeployedSmartContract.connect(deployerWallet).isApprovedForAll(deployerWallet.address, marketplaceAddress721);

                    //console.log("IS APPROVED FOR ALL (OWNER, OPERATOR)", isApprovedForAll, deployerWallet.address, marketplaceAddress721);

                    approvedAddress = await ERC721DeployedSmartContract.connect(deployerWallet).getApproved(tokenId);

                    //console.log("APPROVED ADDRESS", approvedAddress);

                };

                txn = await ERC721DeployedSmartContract.connect(aliceWallet).setApprovalForAll(marketplaceAddress721, true);

                await txn.wait();

                txn = await ERCMKTPFactorySmartContract.connect(aliceWallet).createNFTMarketItem(
                    ERC721SmartContractAddress,
                    Snippets.ERC721INTERFACE,
                    offset721,
                    price,
                    auctionHours,
                    {
                        value: listingFee
                    }
                );

                await txn.wait();
                
            }
            
            await Snippets.sleep(1);

        }

        _eventFilter = ERCMKTPFactorySmartContract.filters.NFTMarketItemCreated
        _eventReceipt = await ERCMKTPFactorySmartContract.queryFilter(_eventFilter, -1)
        //console.log("EVENT : ERCMKTPFactorySmartContract : createNFTMarketItem : 721 :", _eventReceipt[0].args);

        //const marketItems721: any = await ERCMKTPFactorySmartContract.connect(aliceWallet).getNFTMarketItems();

        //console.log(":::::: MARKET ITEMS ::::::", marketItems);

        //process.exit(1); return;

        // ***************************************************************************************************************

        /// 1155

        let marketplaceAddress1155: any = await ERC1155DeployedSmartContract.connect(deployerWallet).getMarketplaceAddress();

        expect(marketplaceAddress1155).to.equal(marketplaceAddress);

        if (marketplaceAddress1155 === marketplaceAddress) {

            if (count > 0) {

                let mintingFee1155: any = await ERC1155DeployedSmartContract.connect(deployerWallet).getTokenMintingFee();
                
                let currentSupply1155: number = parseInt(`${await ERC1155DeployedSmartContract.connect(deployerWallet).getTokenCurrentSupply()}`);

                offset1155 = currentSupply1155 + 1;

                for (let tokenId: number = offset1155; tokenId < offset1155 + count; tokenId++) {
                    
                    let txn: any = await ERC1155DeployedSmartContract.connect(deployerWallet).mintSingle(
                        aliceWallet.address,
                        tokenId,
                        tokenId * 10 / 2,
                        tokenId * 10 * 2,
                        `metadata-${tokenId}.json`,
                        Snippets.ZERO_ADDRESS,
                        { value: mintingFee1155 }
                    );

                    await txn.wait();

                    //const items: any = await ERC1155DeployedSmartContract.connect(aliceWallet).getNFTItems();

                    //const item: any = await ERC1155DeployedSmartContract.connect(aliceWallet).getNFTItem(tokenId);

                    const owner: any = await ERC1155DeployedSmartContract.connect(aliceWallet).getTokenOwner(tokenId);

                    expect(owner).to.equal(aliceWallet.address);

                    //console.log("TOKEN ID, ITEM, OWNER, ITEMS #", tokenId, item, owner, items);

                };

                txn = await ERC1155DeployedSmartContract.connect(aliceWallet).setApprovalForAll(marketplaceAddress1155, true);

                await txn.wait();

                isApprovedForAll = await ERC1155DeployedSmartContract.connect(deployerWallet).isApprovedForAll(aliceWallet.address, marketplaceAddress1155);

                //console.log("IS APPROVED FOR ALL (OWNER, OPERATOR)", isApprovedForAll, aliceWallet.address, marketplaceAddress1155);

                txn = await ERCMKTPFactorySmartContract.connect(aliceWallet).createNFTMarketItem(
                    ERC1155SmartContractAddress,
                    Snippets.ERC1155INTERFACE,
                    offset1155,
                    price,
                    auctionHours,
                    {
                        value: listingFee
                    }
                );

                await txn.wait();
                
            }
            
            await Snippets.sleep(1);

        }

        //_eventFilter = ERCMKTPFactorySmartContract.filters.NFTMarketItemCreated
        //_eventReceipt = await ERCMKTPFactorySmartContract.queryFilter(_eventFilter, -1)
        //console.log("EVENT : ERCMKTPFactorySmartContract : createNFTMarketItem : 1155 :", _eventReceipt[0].args);

        //const marketItems1155: any = await ERCMKTPFactorySmartContract.connect(aliceWallet).getNFTMarketItems();

        //console.log(":::::: MARKET ITEMS ::::::", marketItems1155);

        //process.exit(1); return;

        
        // ***************************************************************************************************************

        // Marketplace

        const items:any = await ERCMKTPFactorySmartContract.connect(charlieWallet).getNFTMarketItems();

        return { items: items, offset721: offset721, offset1155: offset1155 };

    }

    describe("Deployment", () => {

        console.log("  Deploying Contract ...", args);

        it("Should deploy the contract successfully!", async function () {

            expect(await ERCMKTPFactorySmartContract.getAddress()).to.be.properAddress;

        });

        it("It has a contract uri", async function () {

            expect(await ERCMKTPFactorySmartContract.contractURI()).to.equal(args.contractABI[0]);

        });

        it("It sets the listing fee", async function () {

            expect(await ERCMKTPFactorySmartContract.getTokenListingFee()).to.equal(args.contractABI[2]);

        });

        it("It has owner", async function () {

            expect(await ERCMKTPFactorySmartContract.getOwner()).to.equal(deployerWallet.address);

        });

        it("It has admins", async function () {

            expect(args.contractABI[1].length).to.be.gt(3);

        });

        it("It has a admin role", async function () {

            expect(await ERCMKTPFactorySmartContract.hasRole(Snippets.ADMIN_ROLE, deployerWallet.address)).to.be.true;

        });

    });

    describe("Marketplace Functions", () => {

        it(`Must be able to create marketplace items, list, delist & sell/buy`, async function () {

            console.warn("     🟩 Create marketplace items");

            let newPrice: number = 500;
            let listingFee: number = args.contractABI[2];

            let tokenIndexedID721: number = 1;
            let tokenIndexedID1155: number = 2;

            const createdItems: any = await createMarketplaceItems(5, 0);

            let tokenId721: number = createdItems.offset721;
            let tokenId1155: number = createdItems.offset1155;

            let marketplaceItems: any = await ERCMKTPFactorySmartContract.connect(charlieWallet).getNFTMarketItems();

            //console.log("CREATED ITEMS:", createdItems);

            //console.log("MARKETPLACE ITEMS:", marketplaceItems);

            expect(marketplaceItems[0].isListed).to.be.true;
            expect(marketplaceItems[0].sold).to.be.false;

            expect(marketplaceItems[1].isListed).to.be.true;
            expect(marketplaceItems[1].sold).to.be.false;

            console.log("      ✔ Created marketplace items");

            console.warn("     🟩 Must be able to delist marketplace items");

            await ERCMKTPFactorySmartContract.connect(aliceWallet).delistNFTMarketItem(
                tokenIndexedID721,
                false
            );

            await ERCMKTPFactorySmartContract.connect(aliceWallet).delistNFTMarketItem(
                tokenIndexedID1155,
                false
            );

            marketplaceItems = await ERCMKTPFactorySmartContract.connect(charlieWallet).getNFTMarketItems();

            //console.log("RETRIEVED ITEMS AFTER DELIST:", marketplaceItems);

            expect(marketplaceItems[0].isListed).to.be.false;
            expect(marketplaceItems[0].sold).to.be.false;

            expect(marketplaceItems[1].isListed).to.be.false;
            expect(marketplaceItems[1].sold).to.be.false;

            console.log("      ✔ Marketplace item delisted");

            console.warn("     🟩 Must be able to list again marketplace items");

            await ERCMKTPFactorySmartContract.connect(aliceWallet).listNFTMarketItem(
                tokenIndexedID721,
                newPrice,
                {
                    value: listingFee
                }
            );

            await ERCMKTPFactorySmartContract.connect(aliceWallet).listNFTMarketItem(
                tokenIndexedID1155,
                newPrice,
                {
                    value: listingFee
                }
            );

            marketplaceItems = await ERCMKTPFactorySmartContract.connect(charlieWallet).getNFTMarketItems();

            //console.log("RETRIEVED ITEMS AFTER RE-LIST:", marketplaceItems);

            expect(marketplaceItems[0].isListed).to.be.true;
            expect(marketplaceItems[0].sold).to.be.false;

            expect(marketplaceItems[1].isListed).to.be.true;
            expect(marketplaceItems[1].sold).to.be.false;

            console.log("      ✔ Marketplace item listed again");

            console.warn("     🟩 Must be able to sell/buy marketplace items");

            await ERCMKTPFactorySmartContract.connect(bobWallet).createMarketSale(
                tokenIndexedID721,
                {
                    value: newPrice
                }
            );

            await ERCMKTPFactorySmartContract.connect(bobWallet).createMarketSale(
                tokenIndexedID1155,
                {
                    value: newPrice
                }
            );

            marketplaceItems = await ERCMKTPFactorySmartContract.connect(charlieWallet).getNFTMarketItems();

            //console.log("RETRIEVED ITEMS AFTER SALE:", marketplaceItems);

            expect(marketplaceItems[0].isListed).to.be.false;
            expect(marketplaceItems[0].sold).to.be.true;

            expect(marketplaceItems[1].isListed).to.be.false;
            expect(marketplaceItems[1].sold).to.be.true;

        });

    });

    describe("Auction Functions", () => {

        it(`Must be able to create auction items, list, delist & sell/buy`, async function () {

            console.warn("     🟩 Create auction items");

            let newPrice: number = 500;
            let listingFee: number = args.contractABI[2];

            let tokenIndexedID721: number = 1;
            let tokenIndexedID1155: number = 2;

            const createdItems: any = await createMarketplaceItems(5, 1);

            let tokenId721: number = createdItems.offset721;
            let tokenId1155: number = createdItems.offset1155;

            let marketplaceItems: any = await ERCMKTPFactorySmartContract.connect(charlieWallet).getNFTMarketItems();

            expect(marketplaceItems[0].isListed).to.be.true;
            expect(marketplaceItems[0].sold).to.be.false;

            expect(marketplaceItems[1].isListed).to.be.true;
            expect(marketplaceItems[1].sold).to.be.false;

            console.log("      ✔ Created auction items");

            console.warn("     🟩 Must be able to delist auction items");

            await ERCMKTPFactorySmartContract.connect(aliceWallet).delistNFTMarketItem(
                tokenIndexedID721,
                false
            );

            await ERCMKTPFactorySmartContract.connect(aliceWallet).delistNFTMarketItem(
                tokenIndexedID1155,
                false
            );

            marketplaceItems = await ERCMKTPFactorySmartContract.connect(charlieWallet).getNFTMarketItems();

            //console.log("RETRIEVED AUCTION ITEMS AFTER DELIST:", marketplaceItems);

            expect(marketplaceItems[0].isListed).to.be.false;
            expect(marketplaceItems[0].sold).to.be.false;

            expect(marketplaceItems[1].isListed).to.be.false;
            expect(marketplaceItems[1].sold).to.be.false;

            console.log("      ✔ Auction item delisted");

            console.warn("     🟩 Must be able to list again auction items");

            await ERCMKTPFactorySmartContract.connect(aliceWallet).listNFTMarketItem(
                tokenIndexedID721,
                newPrice,
                {
                    value: listingFee
                }
            );

            await ERCMKTPFactorySmartContract.connect(aliceWallet).listNFTMarketItem(
                tokenIndexedID1155,
                newPrice,
                {
                    value: listingFee
                }
            );

            marketplaceItems = await ERCMKTPFactorySmartContract.connect(charlieWallet).getNFTMarketItems();

            //console.log("RETRIEVED AUCTION ITEMS AFTER RE-LIST:", marketplaceItems);

            expect(marketplaceItems[0].isListed).to.be.true;
            expect(marketplaceItems[0].sold).to.be.false;

            expect(marketplaceItems[1].isListed).to.be.true;
            expect(marketplaceItems[1].sold).to.be.false;

            console.log("      ✔ Auction item listed again");

            console.warn("     🟩 Must be able to sell/buy auction items");

            marketplaceItems = await ERCMKTPFactorySmartContract.connect(charlieWallet).getAuctionItems();

            //console.log("RETRIEVED AUCTION ITEMS FULL:", marketplaceItems);

            await expect(ERCMKTPFactorySmartContract.connect(aliceWallet).bidNFTMarketAuctionItem(
                tokenIndexedID721,
                {
                    value: newPrice - 1
                }
            )).to.be.revertedWith("BID_ERROR_BELOW_FLOOR_PRICE");

            await expect(ERCMKTPFactorySmartContract.connect(aliceWallet).bidNFTMarketAuctionItem(
                tokenIndexedID1155,
                {
                    value: newPrice - 1
                }
            )).to.be.revertedWith("BID_ERROR_BELOW_FLOOR_PRICE");

            await expect(ERCMKTPFactorySmartContract.connect(aliceWallet).bidNFTMarketAuctionItem(
                tokenIndexedID721,
                {
                    value: newPrice + 4
                }
            )).to.be.revertedWith("BID_ERROR_BELOW_THRESHOLD");

            await expect(ERCMKTPFactorySmartContract.connect(aliceWallet).bidNFTMarketAuctionItem(
                tokenIndexedID1155,
                {
                    value: newPrice + 4
                }
            )).to.be.revertedWith("BID_ERROR_BELOW_THRESHOLD");

            await ERCMKTPFactorySmartContract.connect(aliceWallet).bidNFTMarketAuctionItem(
                tokenIndexedID721,
                {
                    value: newPrice + 5
                }
            );

            await ERCMKTPFactorySmartContract.connect(aliceWallet).bidNFTMarketAuctionItem(
                tokenIndexedID1155,
                {
                    value: newPrice + 5
                }
            );

            marketplaceItems = await ERCMKTPFactorySmartContract.connect(charlieWallet).getAuctionItems();

            //console.log("RETRIEVED AUCTION ITEMS FULL: AFTER BID :", marketplaceItems);

            await expect(ERCMKTPFactorySmartContract.connect(bobWallet).createMarketSale(
                tokenIndexedID721,
                {
                    value: newPrice
                }
            )).to.be.revertedWithCustomError(ERCMKTPFactorySmartContract, "ItemAlreadyOnAuction")
                .withArgs(tokenIndexedID721);

            await expect(ERCMKTPFactorySmartContract.connect(bobWallet).createMarketSale(
                tokenIndexedID1155,
                {
                    value: newPrice
                }
            )).to.be.revertedWithCustomError(ERCMKTPFactorySmartContract, "ItemAlreadyOnAuction")
                .withArgs(tokenIndexedID1155);

            await moveTime(7200);

            await expect(ERCMKTPFactorySmartContract.connect(bobWallet).createMarketSale(
                tokenIndexedID721,
                {
                    value: newPrice
                }
            )).to.be.revertedWithCustomError(ERCMKTPFactorySmartContract, "CallerNotHighestBidder");

            await expect(ERCMKTPFactorySmartContract.connect(bobWallet).createMarketSale(
                tokenIndexedID1155,
                {
                    value: newPrice
                }
            )).to.be.revertedWithCustomError(ERCMKTPFactorySmartContract, "CallerNotHighestBidder");

            await expect(ERCMKTPFactorySmartContract.connect(aliceWallet).createMarketSale(
                tokenIndexedID721,
                {
                    value: newPrice
                }
            )).to.be.revertedWithCustomError(ERCMKTPFactorySmartContract, "ItemPriceTooLow")
                .withArgs(newPrice + 5, newPrice);

            await expect(ERCMKTPFactorySmartContract.connect(aliceWallet).createMarketSale(
                tokenIndexedID1155,
                {
                    value: newPrice
                }
            )).to.be.revertedWithCustomError(ERCMKTPFactorySmartContract, "ItemPriceTooLow")
                .withArgs(newPrice + 5, newPrice);

            await ERCMKTPFactorySmartContract.connect(aliceWallet).createMarketSale(
                tokenIndexedID721,
                {
                    value: newPrice + 5
                }
            );

            await ERCMKTPFactorySmartContract.connect(aliceWallet).createMarketSale(
                tokenIndexedID1155,
                {
                    value: newPrice + 5
                }
            );

            marketplaceItems = await ERCMKTPFactorySmartContract.connect(charlieWallet).getAuctionItems();

            //console.log("RETRIEVED AUCTION ITEMS FULL: AFTER SALE :", marketplaceItems);

        });

    });

    describe("Interact with State Variables via Getters & Setters", () => {

        it("Get the contract uri : getContractURI", async () => {

            console.warn("     🟩 URIs");

            let _contractURI: string = "ipfs://uriKey";

            let _contractURIBytes32: string = Snippets.fromStringToBytes32(_contractURI);
            
            await deployerWalletAccount.setContractURI(_contractURIBytes32);

            const contractURI: string = await deployerWalletAccount.getContractURI();

            expect(contractURI).to.equal(_contractURIBytes32);

            expect(_contractURI).to.equal(Snippets.fromBytes32ToString(_contractURIBytes32));

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

            await ERCMKTPFactorySmartContract.connect(deployerWallet).setNewOwner(_newOwner);

            const newOwner: string = await deployerWalletAccount.getOwner();

            expect(newOwner).to.equal(_newOwner);

        });

    });

    describe("Event Emissions", () => {

        it("Dispatched when the contract owner has been updated : OwnerChanged", async () => {
        
            console.warn("     🟩 Emit Events");

            await expect(ERCMKTPFactorySmartContract.connect(deployerWallet).setNewOwner(donWallet.address))
                .to.emit(ERCMKTPFactorySmartContract, "OwnerChanged")
                .withArgs(donWallet.address);

        });

        it("Dispatched when the contract uri has been updated : ContractURIChanged", async () => {
        
            let _contractURI:string = Snippets.fromStringToBytes32("ipfs://<ID>");

            await expect(ERCMKTPFactorySmartContract.setContractURI(_contractURI))
                .to.emit(ERCMKTPFactorySmartContract, "ContractURIChanged")
                .withArgs(_contractURI);

        });

        it("Dispatched when the listing fee has been updated : ListingFeeChanged", async () => {
            
            let _newListingFee:number = 100;
    
            await expect(ERCMKTPFactorySmartContract.setListingFee(_newListingFee))
                .to.emit(ERCMKTPFactorySmartContract, "ListingFeeChanged")
                .withArgs(_newListingFee);
    
        });
    
        it("Dispatched when the contract has received funds. : Received", async () => {
            
            let _account:string = deployerWallet.address;
            let _amount:number = 100;
    
            await expect(ERCMKTPFactorySmartContract.fallback({value: _amount}))
                .to.emit(ERCMKTPFactorySmartContract, "Received")
                .withArgs(_account, _amount);
    
        });

    });

    describe("Error Handling", () => {
        
        it("Insufficient permissions for caller : InsufficientPermissions", async () => {
        
            console.warn("     🟩 Throw Errors");

            let _newListingFee:number = args.contractABI[2];

            let _account:any = charlieWallet; 

            let _role:string = Snippets.ADMIN_ROLE;

            await expect(ERCMKTPFactorySmartContract.connect(_account).setListingFee(_newListingFee))
            .to.be.revertedWithCustomError(ERCMKTPFactorySmartContract, "InsufficientPermissions")
            .withArgs(_account.address, _role);

        });

        it("This contract is trying to be initialized without admins : NoAdmins", async () => {
        
            let _admins: any = args.contractABI[1];

            let _hasAdminRole: boolean = await ERCMKTPFactorySmartContract.hasRole(Snippets.ADMIN_ROLE, deployerWallet.address);

            expect(_hasAdminRole).to.be.true;

            _admins.map(async (_account: string) => {

                await expect(await ERCMKTPFactorySmartContract.hasRole(Snippets.ADMIN_ROLE, _account)).to.be.true;

            });

        });

        it("Specified listing amount must be equal to the listing fee defined : ListingPriceTooLow", async () => {

            let tokenIndexedID: number = 1;

            let tokenPrice: number = 0;

            let listingFee: number = parseInt(await ERCMKTPFactorySmartContract.connect(aliceWallet).getTokenListingFee());

            let insufficientListingFee: number = listingFee - 1;

            await expect( ERCMKTPFactorySmartContract.connect(aliceWallet).createNFTMarketItem(
                    ERC721SmartContractAddress,
                    Snippets.ERC721INTERFACE,
                    tokenIndexedID,
                    tokenPrice,
                    0,
                    {
                        value: insufficientListingFee
                    }
                ))
                .to.be.revertedWithCustomError(ERCMKTPFactorySmartContract, "ListingPriceTooLow")
                .withArgs(listingFee, insufficientListingFee);

        });

        it("Specified price amount must be above zero : ItemListingPriceTooLow", async () => {

            let tokenIndexedID: number = 1;

            let tokenPrice: number = 0;

            let listingFee: number = parseInt(await ERCMKTPFactorySmartContract.connect(aliceWallet).getTokenListingFee());

            await expect( ERCMKTPFactorySmartContract.connect(aliceWallet).createNFTMarketItem(
                    ERC721SmartContractAddress,
                    Snippets.ERC721INTERFACE,
                    tokenIndexedID,
                    tokenPrice,
                    0,
                    {
                        value: listingFee
                    }
                ))
                .to.be.revertedWithCustomError(ERCMKTPFactorySmartContract, "ItemListingPriceTooLow");

        });

        it("The caller must not be a contract address : UnAuthorizedCaller", async () => {
        
            

        });

    });

    describe("Search Capabilities", () => {
        
        it("Search using a string : searchTokenURI", async () => {

            console.warn("     🟩 Search : Basic");

            await createMarketplaceItems(5, 0);

            let _searchQuery:string = "metadata-1";

            const searchResults: any = await ERCMKTPFactorySmartContract.searchTokenURI(
                _searchQuery,
                [
                    ERC721SmartContractAddress,
                    ERC1155SmartContractAddress
                ]
            );

            expect(searchResults[0].length).to.equal(0);
            expect(searchResults[1].length).to.equal(3);
            expect(searchResults[2].length).to.equal(1);

        });
        
        it("Search using a uint256 : searchTokenId", async () => {

            await createMarketplaceItems(5, 0);

            let _tokenId:number = 1;

            const searchResults: any = await ERCMKTPFactorySmartContract.searchTokenId(
                _tokenId,
                [
                    ERC721SmartContractAddress,
                    ERC1155SmartContractAddress
                ]
            );

            expect(searchResults[0].length).to.equal(0);
            expect(searchResults[1].length).to.equal(1);
            expect(searchResults[2].length).to.equal(1);
            
            let nftItem721:any = Snippets.parseNFTItem(searchResults[1][0]);
            let nftItem1155:any = Snippets.parseNFTItem(searchResults[2][0]);

            expect(nftItem721.tokenId).to.equal(_tokenId);
            expect(nftItem1155.tokenId).to.equal(_tokenId);

        });

        it("Search using a timestamp CREATED_BEFORE : searchTimestamp", async () => {

            console.warn("     🟩 Search : Created Timestamp");

            await createMarketplaceItems(5, 0);

            let _timestamp: number = parseInt(`${new Date().getTime() / 1000}`) + 50000;

            const searchResults: any = await ERCMKTPFactorySmartContract.searchTimestamp(
                Snippets.CREATED_BEFORE,
                _timestamp,
                [
                    ERC721SmartContractAddress,
                    ERC1155SmartContractAddress
                ]
            );

            expect(searchResults[0].length).to.equal(2);
            expect(searchResults[1].length).to.equal(11);
            expect(searchResults[2].length).to.equal(10);

            let nftItemMKT: any = Snippets.parseMarketItem(searchResults[0][0]);
            let nftItem721: any = Snippets.parseNFTItem(searchResults[1][0]);
            let nftItem1155: any = Snippets.parseNFTItem(searchResults[2][0]);

            expect(nftItemMKT.createdAt).to.lt(_timestamp);
            expect(nftItem721.createdAt).to.lt(_timestamp);
            expect(nftItem1155.createdAt).to.lt(_timestamp);

        });

        it("Search using a timestamp CREATED_AT : searchTimestamp", async () => {

            await createMarketplaceItems(5, 0);

            //Todo: MKT

            let nftItemsMKT: any = await ERCMKTPFactorySmartContract.getNFTMarketItems();

            let _timestampMKT: number = Snippets.parseMarketItem(nftItemsMKT[0]).createdAt;

            const searchResultsMKT: any = await ERCMKTPFactorySmartContract.searchTimestamp(
                Snippets.CREATED_AT,
                _timestampMKT,
                [
                    Snippets.ZERO_ADDRESS,
                    Snippets.ZERO_ADDRESS
                ]
            );

            let nftItemMKT: any = Snippets.parseMarketItem(searchResultsMKT[0][0]);

            expect(searchResultsMKT[0].length).to.gt(0);
            expect(nftItemMKT.createdAt).to.equal(_timestampMKT);


            // 721
            let nftItems721: any = await ERCMKTPFactorySmartContract.getNFT721Items(ERC721SmartContractAddress);

            let _timestamp721: number = Snippets.parseNFTItem(nftItems721[0]).createdAt;

            const searchResults721: any = await ERCMKTPFactorySmartContract.searchTimestamp(
                Snippets.CREATED_AT,
                _timestamp721,
                [
                    ERC721SmartContractAddress,
                    Snippets.ZERO_ADDRESS
                ]
            );

            let nftItem721: any = Snippets.parseNFTItem(searchResults721[1][0]);

            expect(searchResults721[1].length).to.gt(0);
            expect(nftItem721.createdAt).to.equal(_timestamp721);

            // 1155
            let nftItems1155: any = await ERCMKTPFactorySmartContract.getNFT1155Items(ERC1155SmartContractAddress);

            let _timestamp1155: number = Snippets.parseNFTItem(nftItems1155[0]).createdAt;

            const searchResults1155: any = await ERCMKTPFactorySmartContract.searchTimestamp(
                Snippets.CREATED_AT,
                _timestamp1155,
                [
                    Snippets.ZERO_ADDRESS,
                    ERC1155SmartContractAddress
                ]
            );

            let nftItem1155: any = Snippets.parseNFTItem(searchResults1155[2][0]);

            expect(searchResults1155[2].length).to.gt(0);
            expect(nftItem1155.createdAt).to.equal(_timestamp1155);

        });

        it("Search using a timestamp CREATED_AFTER : searchTimestamp", async () => {

            await createMarketplaceItems(5, 0);

            let _timestamp: number = parseInt(`${new Date().getTime() / 1000}`) - 700000;

            const searchResults: any = await ERCMKTPFactorySmartContract.searchTimestamp(
                Snippets.CREATED_AFTER,
                _timestamp,
                [
                    ERC721SmartContractAddress,
                    ERC1155SmartContractAddress
                ]
            );

            expect(searchResults[0].length).to.equal(2);
            expect(searchResults[1].length).to.equal(11);
            expect(searchResults[2].length).to.equal(10);

            let nftItemMKT: any = Snippets.parseMarketItem(searchResults[0][0]);
            let nftItem721: any = Snippets.parseNFTItem(searchResults[1][0]);
            let nftItem1155: any = Snippets.parseNFTItem(searchResults[2][0]);

            expect(nftItemMKT.createdAt).to.gt(_timestamp);
            expect(nftItem721.createdAt).to.gt(_timestamp);
            expect(nftItem1155.createdAt).to.gt(_timestamp);

        });

        it("Search using a timestamp UPDATED_BEFORE : searchTimestamp", async () => {

            console.warn("     🟩 Search : Created Timestamp");

            await createMarketplaceItems(5, 0);

            let _timestamp: number = parseInt(`${new Date().getTime() / 1000}`) + 50000;

            const searchResults: any = await ERCMKTPFactorySmartContract.searchTimestamp(
                Snippets.UPDATED_BEFORE,
                _timestamp,
                [
                    ERC721SmartContractAddress,
                    ERC1155SmartContractAddress
                ]
            );

            expect(searchResults[0].length).to.equal(2);
            expect(searchResults[1].length).to.equal(11);
            expect(searchResults[2].length).to.equal(10);

            let nftItemMKT: any = Snippets.parseMarketItem(searchResults[0][0]);
            let nftItem721: any = Snippets.parseNFTItem(searchResults[1][0]);
            let nftItem1155: any = Snippets.parseNFTItem(searchResults[2][0]);

            expect(nftItemMKT.updatedAt).to.lt(_timestamp);
            expect(nftItem721.updatedAt).to.lt(_timestamp);
            expect(nftItem1155.updatedAt).to.lt(_timestamp);

        });

        it("Search using a timestamp UPDATED_AT : searchTimestamp", async () => {

            await createMarketplaceItems(5, 0);

            //Todo: MKT

            let nftItemsMKT: any = await ERCMKTPFactorySmartContract.getNFTMarketItems();

            let _timestampMKT: number = Snippets.parseMarketItem(nftItemsMKT[0]).updatedAt;

            const searchResultsMKT: any = await ERCMKTPFactorySmartContract.searchTimestamp(
                Snippets.UPDATED_AT,
                _timestampMKT,
                [
                    Snippets.ZERO_ADDRESS,
                    Snippets.ZERO_ADDRESS
                ]
            );

            let nftItemMKT: any = Snippets.parseMarketItem(searchResultsMKT[0][0]);

            expect(searchResultsMKT[0].length).to.gt(0);
            expect(nftItemMKT.updatedAt).to.equal(_timestampMKT);


            // 721
            let nftItems721: any = await ERCMKTPFactorySmartContract.getNFT721Items(ERC721SmartContractAddress);

            let _timestamp721: number = Snippets.parseNFTItem(nftItems721[0]).updatedAt;

            const searchResults721: any = await ERCMKTPFactorySmartContract.searchTimestamp(
                Snippets.UPDATED_AT,
                _timestamp721,
                [
                    ERC721SmartContractAddress,
                    Snippets.ZERO_ADDRESS
                ]
            );

            let nftItem721: any = Snippets.parseNFTItem(searchResults721[1][0]);

            expect(searchResults721[1].length).to.gt(0);
            expect(nftItem721.updatedAt).to.equal(_timestamp721);

            // 1155
            let nftItems1155: any = await ERCMKTPFactorySmartContract.getNFT1155Items(ERC1155SmartContractAddress);

            let _timestamp1155: number = Snippets.parseNFTItem(nftItems1155[0]).updatedAt;

            const searchResults1155: any = await ERCMKTPFactorySmartContract.searchTimestamp(
                Snippets.UPDATED_AT,
                _timestamp1155,
                [
                    Snippets.ZERO_ADDRESS,
                    ERC1155SmartContractAddress
                ]
            );

            let nftItem1155: any = Snippets.parseNFTItem(searchResults1155[2][0]);

            expect(searchResults1155[2].length).to.gt(0);
            expect(nftItem1155.updatedAt).to.equal(_timestamp1155);

        });

        it("Search using a timestamp UPDATED_AFTER : searchTimestamp", async () => {

            await createMarketplaceItems(5, 0);

            let _timestamp: number = parseInt(`${new Date().getTime() / 1000}`) - 700000;

            const searchResults: any = await ERCMKTPFactorySmartContract.searchTimestamp(
                Snippets.UPDATED_AFTER,
                _timestamp,
                [
                    ERC721SmartContractAddress,
                    ERC1155SmartContractAddress
                ]
            );

            expect(searchResults[0].length).to.equal(0);
            expect(searchResults[1].length).to.equal(11);
            expect(searchResults[2].length).to.equal(10);

            //let nftItemMKT: any = Snippets.parseMarketItem(searchResults[0][0]);
            let nftItem721: any = Snippets.parseNFTItem(searchResults[1][0]);
            let nftItem1155: any = Snippets.parseNFTItem(searchResults[2][0]);

            //expect(nftItemMKT.updatedAt).to.gt(_timestamp);
            expect(nftItem721.updatedAt).to.gt(_timestamp);
            expect(nftItem1155.updatedAt).to.gt(_timestamp);

        });


        it("Search using an account address : searchAddress", async () => {

            console.warn("     🟩 Search : Accounts");

            await createMarketplaceItems(5, 0);

            const searchResults: any = await ERCMKTPFactorySmartContract.searchAddress(
                Snippets.ADDRESS,
                aliceWallet.address,
                [
                    ERC721SmartContractAddress,
                    ERC1155SmartContractAddress
                ]
            );

            expect(searchResults[0].length).to.equal(2);

            expect(searchResults[1].length).to.equal(8);

            expect(searchResults[2].length).to.equal(9);

            expect(Snippets.parseNFTItem(searchResults[1][0]).minterAddress).to.equal(deployerWallet.address);

            expect(Snippets.parseNFTItem(searchResults[2][0]).minterAddress).to.equal(deployerWallet.address);

        });
        
        it("Search using an account address SELLER : searchAddress", async () => {

            await createMarketplaceItems(5, 0);

            const searchResults: any = await ERCMKTPFactorySmartContract.searchAddress(
                Snippets.MINTER,
                deployerWallet.address,
                [
                    ERC721SmartContractAddress,
                    ERC1155SmartContractAddress
                ]
            );

            expect(searchResults[0].length).to.equal(0);

            expect(searchResults[1].length).to.equal(11);

            expect(searchResults[2].length).to.equal(10);

            expect(Snippets.parseNFTItem(searchResults[1][0]).minterAddress).to.equal(deployerWallet.address);

            expect(Snippets.parseNFTItem(searchResults[2][0]).minterAddress).to.equal(deployerWallet.address);

        });
        
        it("Search using an account address CREATOR : searchAddress", async () => {

            await createMarketplaceItems(5, 0);

            const searchResults: any = await ERCMKTPFactorySmartContract.searchAddress(
                Snippets.CREATOR,
                aliceWallet.address,
                [
                    ERC721SmartContractAddress,
                    ERC1155SmartContractAddress
                ]
            );

            expect(searchResults[0].length).to.equal(0);

            expect(searchResults[1].length).to.equal(10);

            expect(searchResults[2].length).to.equal(10);

            expect([deployerWallet.address, aliceWallet.address].includes(Snippets.parseNFTItem(searchResults[1][0]).minterAddress)).to.be.true;

            expect([deployerWallet.address, aliceWallet.address].includes(Snippets.parseNFTItem(searchResults[2][0]).minterAddress)).to.be.true;

        });
        
        it("Search using an account address OWNER : searchAddress", async () => {
            
            await createMarketplaceItems(5, 0);

            //721

            // Deployer Account
            let searchResults: any = await ERCMKTPFactorySmartContract.searchAddress(
                Snippets.OWNER,
                deployerWallet.address,
                [
                    ERC721SmartContractAddress,
                    ERC1155SmartContractAddress
                ]
            );

            let nftItem721: any = Snippets.parseNFTItem(searchResults[1][0]);
            
            let tokenOwner721: string = await ERCMKTPFactorySmartContract.getTokenOwner721(ERC721SmartContractAddress, nftItem721.tokenId);

            expect(searchResults[1].length).to.equal(1);
            expect(tokenOwner721).to.equal(deployerWallet.address);
            expect(nftItem721.ownerAddress).to.equal(deployerWallet.address);

            // Alice Wallet
            searchResults = await ERCMKTPFactorySmartContract.searchAddress(
                Snippets.OWNER,
                aliceWallet.address,
                [
                    ERC721SmartContractAddress,
                    ERC1155SmartContractAddress
                ]
            );

            nftItem721 = Snippets.parseNFTItem(searchResults[1][0]);

            tokenOwner721 = await ERCMKTPFactorySmartContract.getTokenOwner721(ERC721SmartContractAddress, nftItem721.tokenId);

            expect(searchResults[1].length).to.equal(8);
            expect(tokenOwner721).to.equal(aliceWallet.address);
            expect(nftItem721.ownerAddress).to.equal(aliceWallet.address);

            // Bob Wallet
            searchResults = await ERCMKTPFactorySmartContract.searchAddress(
                Snippets.OWNER,
                donWallet.address,
                [
                    ERC721SmartContractAddress,
                    ERC1155SmartContractAddress
                ]
            );

            nftItem721 = Snippets.parseNFTItem(searchResults[1][0]);

            tokenOwner721 = await ERCMKTPFactorySmartContract.getTokenOwner721(ERC721SmartContractAddress, nftItem721.tokenId);

            expect(searchResults[1].length).to.equal(1);
            expect(tokenOwner721).to.equal(donWallet.address);
            expect(nftItem721.ownerAddress).to.equal(donWallet.address);

            //1155

            // Deployer Account
            searchResults = await ERCMKTPFactorySmartContract.searchAddress(
                Snippets.OWNER,
                aliceWallet.address,
                [
                    ERC721SmartContractAddress,
                    ERC1155SmartContractAddress
                ]
            );

            let nftItem1155: any = Snippets.parseNFTItem(searchResults[2][0]);
            
            let tokenOwner1155: string = await ERCMKTPFactorySmartContract.getTokenOwner1155(ERC1155SmartContractAddress, nftItem1155.tokenId);

            expect(searchResults[2].length).to.equal(9);
            expect(tokenOwner1155).to.equal(aliceWallet.address);
            expect(nftItem1155.ownerAddress).to.equal(aliceWallet.address);

        });
        
    });

    describe("Role Management", () => {
        
        it("Can grant an ADMIN role : grantAdminRole", async () => {
        
            console.warn("     🟩 ADMIN Roles");

            await deployerWalletAccount.grantAdminRole(donWallet.address);

            const donWalletHasAdminRole = await ERCMKTPFactorySmartContract.hasRole(Snippets.ADMIN_ROLE, donWallet.address);

            expect(donWalletHasAdminRole).to.be.true;

        });

        it("Can revoke an ADMIN role : revokeAdminRole", async () => {

            await deployerWalletAccount.grantAdminRole(donWallet.address);

            const donWalletHasAdminRole = await ERCMKTPFactorySmartContract.hasRole(Snippets.ADMIN_ROLE, donWallet.address);

            expect(donWalletHasAdminRole).to.be.true;

            await deployerWalletAccount.revokeAdminRole(donWallet.address);

            const donWalletStillHasAdminRole = await ERCMKTPFactorySmartContract.hasRole(Snippets.ADMIN_ROLE, donWallet.address);

            expect(donWalletStillHasAdminRole).to.be.false;

        });

        it("Can renounce an ADMIN role, can only renounce own account : renounceAdminRole", async () => {

            await deployerWalletAccount.grantAdminRole(donWallet.address);

            const donWalletHasAdminRole = await ERCMKTPFactorySmartContract.hasRole(Snippets.ADMIN_ROLE, donWallet.address);

            expect(donWalletHasAdminRole).to.be.true;

            await expect(deployerWalletAccount.renounceAdminRole(donWallet.address))
                .to.be.reverted;

            await donWalletAccount.renounceAdminRole(donWallet.address);

            const donWalletStillHasAdminRole = await ERCMKTPFactorySmartContract.hasRole(Snippets.ADMIN_ROLE, donWallet.address);

            expect(donWalletStillHasAdminRole).to.be.false;

        });

        it("Can renounce ownership of the smart contract : renounceContractOwnership", async () => {

            const deployerWalletHasAdminRole = await ERCMKTPFactorySmartContract.hasRole(Snippets.ADMIN_ROLE, deployerWallet.address);

            expect(deployerWalletHasAdminRole).to.be.true;

            const contractOwner:string = await ERCMKTPFactorySmartContract.getOwner();

            expect(contractOwner).to.be.equal(deployerWallet.address);

            await expect(charlieWalletAccount.renounceContractOwnership())
                .to.be.revertedWithCustomError(ERCMKTPFactorySmartContract, "InsufficientPermissions")
                .withArgs(
                    charlieWallet.address, 
                    Snippets.ADMIN_ROLE
                );

            await deployerWalletAccount.renounceContractOwnership();

            const newContractOwner:string = await ERCMKTPFactorySmartContract.getOwner();

            expect(newContractOwner).to.be.equal(Snippets.ZERO_ADDRESS);

        });

    });

    await new Promise(res =>  setTimeout(() => res(null), 5000));

});

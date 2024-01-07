import { ethers, network } from "hardhat";

interface accountAddress {
    address: string;
}

interface walletAccount {
    delegate?: (address: string) => {};
    castVote?: (proposalId: number, vote: number) => {};
}

interface smartContract {
    connect: (address: accountAddress) => walletAccount,
    delegate: (address: string) => {},
}

const abiEncodeFunctionData: any = (functionName:any, functionArgumentList:any, args:any) => {

    const abi: any = [`function ${functionName}(${functionArgumentList.join(', ')})`];

    //console.log("ARG : , ", [functionName, functionArgumentList, args]);

    //console.log("ABI : , ", [`function ${functionName}(${functionArgumentList.join(', ')})`])

    const encodedFunctionInterface = new ethers.Interface(abi);

    const encodedFunctionData = encodedFunctionInterface.encodeFunctionData(functionName, args);

    return encodedFunctionData;

}

const getEncodedFunctionData: any = (executorWalletAddress:string) => {

    return abiEncodeFunctionData("executeProposal", ["address executorWalletAddress"], [executorWalletAddress]);

}

const delegateAccounts: Function = async (
    ERCGovernanceTokenSmartContract: smartContract,
    deployerWallet: accountAddress,
    voter1Wallet: accountAddress,
    voter2Wallet: accountAddress,
    voter3Wallet: accountAddress,
    voter4Wallet: accountAddress,
    voter5Wallet: accountAddress
)  : Promise<any> =>  {

    const ercGovernanceTokenSmartContractawaitTX:any = await ERCGovernanceTokenSmartContract.delegate(deployerWallet.address);
    await ercGovernanceTokenSmartContractawaitTX.wait(1);

    const voter1WalletAccount: any = await ERCGovernanceTokenSmartContract.connect(voter1Wallet);
    const voter2WalletAccount: any = await ERCGovernanceTokenSmartContract.connect(voter2Wallet);
    const voter3WalletAccount: any = await ERCGovernanceTokenSmartContract.connect(voter3Wallet);
    const voter4WalletAccount: any = await ERCGovernanceTokenSmartContract.connect(voter4Wallet);
    const voter5WalletAccount: any = await ERCGovernanceTokenSmartContract.connect(voter5Wallet);

    const voter1WalletAccountTX:any = await voter1WalletAccount.delegate(voter1Wallet.address);
    await voter1WalletAccountTX.wait(1);

    const voter2WalletAccountTX:any = await voter2WalletAccount.delegate(voter2Wallet.address);
    await voter2WalletAccountTX.wait(1);
    
    const voter3WalletAccountTX:any = await voter3WalletAccount.delegate(voter3Wallet.address);
    await voter3WalletAccountTX.wait(1);
    
    const voter4WalletAccountTX:any = await voter4WalletAccount.delegate(voter4Wallet.address);
    await voter4WalletAccountTX.wait(1);
    
    const voter5WalletAccountTX:any = await voter5WalletAccount.delegate(voter5Wallet.address);
    await voter5WalletAccountTX.wait(1);
    
}

const castVotes: Function = async (
    ERC20DAOSmartContract: smartContract,
    id:any,
    voter1Wallet: accountAddress,
    voter2Wallet: accountAddress,
    voter3Wallet: accountAddress,
    voter4Wallet: accountAddress,
    voter5Wallet: accountAddress,
    votingPeriod: number
)  : Promise<any> => {

    // 0 = Against, 1 = For, 2 = Abstain

    const voter1WalletAccount: any = await ERC20DAOSmartContract.connect(voter1Wallet);
    const voter2WalletAccount: any = await ERC20DAOSmartContract.connect(voter2Wallet);
    const voter3WalletAccount: any = await ERC20DAOSmartContract.connect(voter3Wallet);
    const voter4WalletAccount: any = await ERC20DAOSmartContract.connect(voter4Wallet);
    const voter5WalletAccount: any = await ERC20DAOSmartContract.connect(voter5Wallet);

    await voter1WalletAccount.castVote(id, 1)
    await voter2WalletAccount.castVote(id, 1)
    await voter3WalletAccount.castVote(id, 1)
    await voter4WalletAccount.castVote(id, 0)
    await voter5WalletAccount.castVote(id, 2)

    await moveBlocks(votingPeriod + 1);

}

const moveBlocks: Function = async (amount: number) : Promise<any> => {
    //console.log(`Attempt to move ${amount} blocks`);
    for (let i = 0; i < amount; i++) {

        await network.provider.request({
            method: "evm_mine",
            params: []
        });

    }
    //console.log(`Moved ${amount} blocks`);

}

const moveTime: Function = async (amount: number) : Promise<any> => {
    //console.log(`Attempt to move ${amount} seconds`);
    await network.provider.send("evm_increaseTime", [amount]);
    //console.log(`Moved ${amount} seconds`);

}

const createProposal: Function = async (treasurySmartContract: any, proposalId: any, proposerWallet: any, executorWallet: any, proposalDescription:string, amount:any) : Promise<any> => {
    
    const createProposalTX:any = await treasurySmartContract.createProposal(
        proposalId,
        proposalDescription,
        proposerWallet.address,
        executorWallet.address, 
        { 
            value: amount
        }
    
    );

    await createProposalTX.wait(1);

}

const makeProposal: Function = async (
    governorSmartContract: any,
    treasurySmartContract: any,
    proposerWallet: any,
    executorWallet: any,
    amount: any,
    proposalDescription: string,
    votingDelay:number
) : Promise<any> => {

    const encodedFunctionData:string = getEncodedFunctionData(executorWallet.address);

    //console.log("ENCODED FUNCTION DATA : GOVERNOR PROPOSE :", [treasurySmartContract.getAddress()], [0], [encodedFunctionData], proposalDescription);

    const proposeTX: any = await governorSmartContract.connect(proposerWallet).propose([treasurySmartContract.getAddress()], [0], [encodedFunctionData], proposalDescription);

    await proposeTX.wait(1);

    await moveBlocks(votingDelay+1);

    const proposeEventFilter:any = governorSmartContract.filters.ProposalCreated
    const proposeEventReceipt:any = await governorSmartContract.queryFilter(proposeEventFilter, -10)

    //console.log("PROPOSE RECEIPT ARGS:", proposeEventReceipt[0].args);

    const proposalID:any = proposeEventReceipt[0].args.proposalId;

    await createProposal(
        treasurySmartContract,
        proposalID,
        proposerWallet,
        executorWallet,
        proposalDescription,
        amount
    );

    let proposalPayload:any = await treasurySmartContract.getProposalDetails(proposalID);

    /* console.log(
        "Created Proposal",
        [
            proposalID,
            [
                treasurySmartContract,
                proposalID,
                executorWallet.address,
                proposalDescription,
                amount
            ]
            ,proposalPayload
        ]
    ) */

    return proposalID;

}

const queueProposal: Function = async (
    governorDAOSmartContract: any,
    treasurySmartContract: any,
    hash:any,
    id: any,
    executor:any
) : Promise<any> => {

    const governorSmartContract:any = await governorDAOSmartContract.connect(executor)

    const encodedFunctionData = getEncodedFunctionData(executor.address);

    const queueTX:any = await governorSmartContract.queue([treasurySmartContract.getAddress()], [0], [encodedFunctionData], hash)

    await queueTX.wait(1);

    return await governorSmartContract.state(id);

}

const executeProposal: Function = async (
    governorDAOSmartContract: any,
    treasurySmartContract: any,
    hash:any,
    proposalId: any,
    minimumDelay: number,
    executorWallet:any
) : Promise<any> => {

    const governorSmartContract:any = await governorDAOSmartContract.connect(executorWallet)

    const encodedFunctionData = getEncodedFunctionData(executorWallet.address);

    await moveBlocks(1);

    await moveTime(minimumDelay + 1);

    const executeTX:any = await governorSmartContract.execute([treasurySmartContract.getAddress()], [0], [encodedFunctionData], hash)

    await executeTX.wait(1);

    await moveBlocks(1);

    await moveTime(minimumDelay + 1);

    const stateId:number = await governorSmartContract.state(proposalId);

    //console.log("I LOVE YOU RUDO", stateId);

    const treasurySmartContractConnectedAccount: any = treasurySmartContract.connect(executorWallet);

    const treasurySmartContractTx: any = await treasurySmartContractConnectedAccount.executeProposal(
        proposalId
    );

    //console.log("I LOVE YOU RUDO", proposalId);

    await treasurySmartContractTx.wait(1);

    let proposalPayload:any = await treasurySmartContract.getProposalDetails(proposalId);

    return [stateId, executorWallet, proposalPayload];

}

export {moveBlocks, moveTime, makeProposal, castVotes, delegateAccounts, queueProposal, executeProposal}

// SPDX-License-Identifier: MIT
/**
 * Created on 2023-05-05 14:35
 * @summary:
 * @author: dovellous
 */
pragma solidity ^0.8.20;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "hardhat/console.sol";

contract JWLTreasury is ERC721URIStorage, Ownable, AccessControl {

    uint256 private _tokenIds;

    struct ExecutableProposal {
        uint256 tokenId;
        uint256 proposalId;
        string proposalDescription;
        address proposerWalletAddress;
        string tokenFullURI;
        uint256 totalFunds;
        address executorWalletAddress;
        bool amountDisbursed;
        bool executorStillOwner;
        uint256 proposalStatus; 
        uint256 createdAt;
        uint256 executedAt;
    }

    event ProposalCreated(
        uint256 tokenId,
        uint256 proposalId,
        string proposalDescription,
        address proposerWalletAddress,
        string tokenFullURI,
        uint256 totalFunds,
        address executorWalletAddress,
        bool amountDisbursed,
        bool executorStillOwner,
        uint256 proposalStatus,
        uint256 createdAt,
        uint256 executedAt
    );

    event ProposalExecuted(
        uint256 tokenId,
        uint256 proposalId,
        string proposalDescription,
        address proposerWalletAddress,
        string tokenFullURI,
        uint256 totalFunds,
        address executorWalletAddress,
        bool amountDisbursed,
        bool executorStillOwner,
        uint256 proposalStatus,
        uint256 createdAt,
        uint256 executedAt
    );

    struct NFTokenProposalMeta {
        address executorWalletAddress;
        uint256 proposalId;
        uint256 tokenId;
    }

    event Log(string func, uint gas);

    mapping(uint256=>ExecutableProposal) public executableProposal;

    mapping(uint256=>NFTokenProposalMeta) public tokenIdToProposal;

    bytes32 proposerRole;
    bytes32 executorRole;

    string tokenBaseURI;

    constructor(
        string memory _name, 
        string memory _symbol, 
        string memory _baseURI,
        bytes32 _proposerRole,
        bytes32 _executorRole

    ) ERC721(
        _name, 
        _symbol
     )
     Ownable(_msgSender())
     {
        tokenBaseURI = _baseURI;
        proposerRole = _proposerRole;
        executorRole = _executorRole;
    }

    function owner() public view virtual override(
        Ownable
    ) returns (address){
        return super.owner();
    }

    function isReleased(
        uint256 proposalId
    ) public view returns (bool){

        return executableProposal[proposalId].amountDisbursed;

    }

    function getProposalDetails(
        uint256 proposalId
    ) public view returns (ExecutableProposal memory){

        return executableProposal[proposalId];

    }

    function getProposalExecutor(
        uint256 proposalId
    ) public view returns (address){

        return executableProposal[proposalId].executorWalletAddress;

    }

    function getProposalFunds(
        uint256 proposalId
    ) public view returns (uint256){

        return executableProposal[proposalId].totalFunds;

    }

    function isExecutorStillOwner(
        uint256 proposalId
    ) public view returns (bool){

        return executableProposal[proposalId].executorWalletAddress == msg.sender;

    }

    function getProposalDescription(
        uint256 proposalId
    ) public view returns (string memory){

        return executableProposal[proposalId].proposalDescription;

    }

    function getProposalNFT(
        uint256 proposalId
    ) public view returns (uint256){

        return executableProposal[proposalId].tokenId;

    }

    function proposalIsExecuted(
        uint256 proposalId
    ) public view returns (bool){

        return executableProposal[proposalId].amountDisbursed;

    }

    function createProposal(
        uint256 proposalId,
        string memory proposalDescription,
        address proposerWalletAddress,
        address executorWalletAddress
    ) public payable returns (ExecutableProposal memory) {

        uint256 tokenId = _tokenIds++;
        string memory tokenFullURI = string(
            abi.encodePacked(tokenBaseURI,Strings.toString(proposalId))
        );
        _mint(executorWalletAddress, tokenId);
        _setTokenURI(tokenId, tokenFullURI);

        tokenIdToProposal[tokenId] = NFTokenProposalMeta(
            executorWalletAddress,
            proposalId,
            tokenId
        );

        executableProposal[proposalId] = ExecutableProposal(
            tokenId,
            proposalId,
            proposalDescription,
            proposerWalletAddress,
            tokenFullURI,
            msg.value,
            payable(executorWalletAddress),
            false,
            true,
            1,
            block.timestamp,
            0
        );

        emit ProposalCreated(
            tokenId,
            proposalId,
            proposalDescription,
            proposerWalletAddress,
            tokenFullURI,
            msg.value,
            payable(executorWalletAddress),
            false,
            true,
            1,
            block.timestamp,
            0
        );

        return executableProposal[proposalId];

    }

    function executeProposal(
        uint256 proposalId
    ) public returns (ExecutableProposal memory) {

        ExecutableProposal memory _exe = executableProposal[proposalId];

        require(
            msg.sender == _exe.executorWalletAddress, 
            "Only the approved executor can call this function"
        );

        require(
            !_exe.amountDisbursed, 
            "Amount already disbursed"
        );

        _exe.amountDisbursed = true;

        _exe.executedAt = block.timestamp;

        payable(_exe.executorWalletAddress).transfer(_exe.totalFunds);

        executableProposal[proposalId] = _exe;

        console.log(_exe.executorWalletAddress, _exe.totalFunds);

        emit ProposalExecuted(
            _exe.tokenId,
            _exe.proposalId,
            _exe.proposalDescription,
            _exe.proposerWalletAddress,
            _exe.tokenFullURI,
            _exe.totalFunds,
            _exe.executorWalletAddress,
            _exe.amountDisbursed,
            true,
            7,
            _exe.createdAt,
            block.timestamp
        );

        return _exe;

    }

    /**
     * @dev See {IERC721-safeTransferFrom}.
     */
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public virtual override (ERC721, IERC721) {
        super.safeTransferFrom(from, to, tokenId, data);
        NFTokenProposalMeta memory _meta = tokenIdToProposal[tokenId];
        ExecutableProposal memory _exe = executableProposal[_meta.proposalId];
        _exe.executorStillOwner = false;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) 
        public view virtual override(
            AccessControl, 
            ERC721URIStorage 
        ) returns (bool) {
        return interfaceId == type(AccessControl).interfaceId ||  
        interfaceId == type(ERC721URIStorage).interfaceId || 
        super.supportsInterface(interfaceId);
    }

    
    // Fallback function must be declared as external.
    fallback() external payable {
        // send / transfer (forwards 2300 gas to this fallback function)
        // call (forwards all of the gas)
        //emit Log("fallback", gasleft());
    }

    // Receive is a variant of fallback that is triggered when msg.data is empty
    receive() external payable {
        //emit Log("receive", gasleft());
    }

    // Helper function to check the balance of this contract
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

}
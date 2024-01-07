// SPDX-License-Identifier: MIT
/**
 * Created on 2023-05-05 14:36
 * @summary:
 * @author: dovellous
 */
pragma solidity ^0.8.19;
pragma experimental ABIEncoderV2;

/*********************************** Imports **********************************/

import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "../ERC721/IERC721Factory.sol";
import "../ERC1155/IERC1155Factory.sol";
import "../common/ERCMKTPModifiers.sol";
import "../common/IERCLogging.sol";

contract ERCMKTPFactoryBase is
    Pausable,
    ERC721Holder,
    ERC1155Holder,
    ERCMKTPModifiers
{

    uint256 public _tokenIndexedIDs;

    uint256 public _tokenIndexedAuctionIDs;

    uint256 public _soldItems;

    uint256 public _listedItems;
    /// Owner of the contract. 
    /// This is only for compatibility for other protocols.
    address payable public owner;

    address loggerAddress;
    /// @dev Contract URI where this code resides
    bytes32 public contractURI;

    /// @dev Marker item listing fee
    uint256 public listingFee;

    mapping(uint256 => Structs.AuctionDetails) public tokenIndexedID2AuctionDetails;

    mapping(uint256 => Structs.NFTMarketItem) public tokenIndexedID2NFTMarketItem;

    /// @dev Token Id to Token Activity mapping
    mapping(uint256 => Structs.NFTMarketItemActivity[]) public tokenIdToNFTMarketItemActivity;

    /// @dev Token Id to NFTMarketItem mapping
    mapping(uint256 => Structs.NFTMarketItem) public tokenIdToNFTMarketItem;

    /*********************************** Events ***********************************/

    /// Dispatched when the contract owner has been updated.
    event OwnerChanged(
        address newOwner
    );

    /// Dispatched when the contract uri has been updated.
    event ContractURIChanged(
        bytes32 newURI
    );


    /// Dispatched when the marketplace address has been updated.
    event MarketplaceAddressChanged(
        address newMarketplaceAddress
    );

    /// Dispatched when the minting fee has bene updated.
    event ListingFeeChanged(uint256 newListingFee);

    event Received(address, uint);

    event NFTMarketItemCreated(uint256 tokenIndexedID);

    event NFTMarketItemSold(uint256 tokenIndexedID, uint256 amount, address buyer);

    event NFTMarketItemListed(uint256 tokenIndexedID);

    event NFTMarketItemDelisted(uint256 tokenIndexedID);

    /**
     * @dev Initialize the  base contract
     *
     */
    constructor(){}

    /**
     * @dev Get the owner of the specified token id
     * @param _account The address of the smart contract
     * @param _tokenId The id of the token to get the owner from
     * @return address The wallet address of the token owner.
     *
    */
    function getTokenOwner1155(
        address _account,
        uint256 _tokenId
    ) public view returns (
        address
    ) {
        
        return IERC1155Factory(_account).getTokenOwner(_tokenId);

    }

    /**
     * @dev Get a list of all NFTItems inthe ERC1155 Smart contract Address
     * @param _account The address of the smart contract
     * @return Structs.NFTItem[] An array of NFTItems returned from the search query.
     *
     */
    function getNFT1155Items(
        address _account
    ) public view returns (
        Structs.NFT[] memory
    ) {
        
        Structs.NFT[] memory nftItems1155;

        if(_account != address(0)){

            nftItems1155 = IERC1155Factory(_account).getNFTItems();

        }

        return nftItems1155;

    }

    /**
     * @dev Get the owner of the specified token id
     * @param _account The address of the smart contract
     * @param _tokenId The id of the token to get the owner from
     * @return address The wallet address of the token owner.
     *
     */
    function getTokenOwner721(
        address _account,
        uint256 _tokenId
    ) public view returns (
        address
    ) {

        return IERC721Factory(_account).ownerOf(_tokenId);

    }

    /**
     * @dev Get a list of all NFTItems inthe ERC721 Smart contract Address
     * @param _account The address of the smart contract
     * @return Structs.NFTItem[] An array of NFTItems returned from the search query.
     *
     */
    function getNFT721Items(
        address _account
    ) public view returns (
        Structs.NFT[] memory
    ) {
        
        Structs.NFT[] memory nftItems721;

        if(_account != address(0)){

            nftItems721 = IERC721Factory(_account).getNFTItems();

        }

        return nftItems721;

    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, ERC1155Holder) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Fallback function must be declared as external.
    fallback() external payable {}

    // Receive is a variant of fallback that is triggered when msg.data is empty
    receive() external payable virtual {

        emit Received(Snippets.msgSender(), msg.value);

    }

}

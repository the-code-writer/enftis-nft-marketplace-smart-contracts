// SPDX-License-Identifier: MIT
/**
 * Created on 2023-05-05 14:36
 * @summary:
 * @author: dovellous
 */
pragma solidity ^0.8.19;
pragma experimental ABIEncoderV2;

/*********************************** Imports **********************************/

import "./ERC721FactoryBase.sol";
import "./ERC721FactoryWorker.sol";
import "./ERC721FactoryMinter.sol";
import "./ERC721FactoryBurner.sol";

/**
 * @dev {ERC721} token, including:
 *
 *  - deploy with upgradeability, replaced constructors with initializer functions
 *  - a admin role that allows for token minting (creation)
 *  - royalty information See {ERC721Royalty}.
 *  - token ID and URI autogeneration
 *
 * This contract uses {AccessControl} to lock permissioned functions using the
 * different roles
 *
 */

interface IERC721Factory {

    
    // ==================== Begin Reading State Variables ==================== //

    // URIs

    /**
     * @dev Returns the base uri of the contract.
     * @return url string.
     *
     */
    function getBaseURI() external view returns (string memory);

    /**
     * @dev Retreives the contract url where the source code resides.
     * @return url bytes32.
     *
     */
    function getContractURI() external view returns (bytes32);

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     * @param _tokenId tokenId.
     * @return string uri of the tokenId.
     *
     */
    function getTokenURI(
        uint256 _tokenId
    ) external view returns (string memory);

    // Admin

    /**
     * @dev Returns current _owner address. This is only for compatibility 
     * for other protocols.
     * @return _owner address.
     *
     */
    function getOwner() external view returns (address );

    // Marketplace

    /**
     * @dev Retrieves the marketplace address approved for toke transfers.
     * @return marketplaceAddress.
     *
     */
    function getMarketplaceAddress() external view returns (address );

    // Royalties

    /**
     * @dev Returns current _owner address. This is only for compatibility 
     * for opensea and other protocols.
     * @return royaltyFraction.
     *
     */
    function getRoyaltyFraction() external view returns (uint96 );

    /**
     * @dev The default receiver of the token royalties.
     * @return address.
     *
     */
    function getRoyaltyReceiver() external view returns (address );

    /**
     * @dev Retrieves the royalty info of a token.
     * @param _tokenId the id of the token.
     * @param _tokenPrice the price of the token.
     * @return royaltyItemStruct the royalty info of the token.
     * 
     * Requirements:
     *
     * - `tokenId` must exist.
     * 
     */
    function getTokenRoyaltyInfo(
        uint256 _tokenId,
        uint256 _tokenPrice
    )
        external
        view
        returns (Structs.RoyaltyItem memory);

    /**
     * @dev Retrieves the royalty fee dinominator.
     * @return uint96
     *
     * Notes: 
     * When passing the royalty percentage
     * - It must not be a decimal
     * - You have to multiply the percentage by the fee denominator
     * - For example: 3% => 3 * _feeDenominator()
     */
    function getRoyaltyFeeDenominator() external pure returns (uint96 );

    // Supply

    /**
     * @dev Retrieves the royalty info of a token including the fee base on price supplied.
     * @return `tokenMaximumSupply`
     *
     */
    function getTokenMaximumSupply() external view returns (uint256 );

    /**
     * @dev Retrieves the royalty info of a token including the fee base on price supplied.
     * @return `_tokenCurrentSupply`
     *
     */
    function getTokenCurrentSupply() external view returns (uint256);

    /**
     * @dev Retrieves the current token id. This represents
     * the current token supply.
     * @return _tokenIdCounter.
     */
    function getTokenCurrentId() external view returns (uint256);

    // ==================== End Reading State Variables ==================== //

    // ==================== Begin Read Mint Data ==================== //

    /**
     * @dev Retrieves the royalty info of a token including the fee base on price supplied.
     *
     */
    function getTokenMintingFee() external view returns (uint256);

    /**
     * @dev Retrieves and array of tokens minted by caller.
     * @return Structs.NFTItem[] An array of NFTItems returned from the search query.
     *
     */
    function getTokensMintedByMe() external view returns (Structs.NFT[] memory);

    /**
     * @dev Retrieves and array of tokens minted by an address.
     * @param _account account address that minted the token.
     * @return Structs.NFTItem[] An array of NFTItems returned from the search query.
     *
     */
    function getTokensMintedByAddress(
        address _account
    ) external view returns (Structs.NFT[] memory);

    /**
     * @dev Get the minter of the token id
     * @param _tokenId The id of the token to get the minter from.
     * @return address
     * 
     * Requirements:
     *
     * - `tokenId` must exist.
     * 
     */
    function getTokenMinter(
        uint256 _tokenId
    )
        external
        view
        returns (address);

    /**
     * @dev Get the first account to receive the token id
     * @param _tokenId The id of the token to get the mintee from.
     * @return address
     * 
     * Requirements:
     *
     * - `tokenId` must exist.
     * 
     */
    function getTokenMintee(
        uint256 _tokenId
    )
        external
        view
        returns (address);

    // ==================== End Read Mint Data ==================== //

    // ==================== Begin Read Creator Data ==================== //

    /**
     * @dev Retrieves and array of tokens created by caller
     * @return Structs.NFT[] An array of NFTItems returned from the search query.
     *
     */
    function getTokensCreatedByMe() external view returns (Structs.NFT[] memory);

    /**
     * @dev Retrieves and array of tokens created by an address.
     * @param _account account address that created the token.
     * @return Structs.NFT[] An array of NFTItems returned from the search query.
     *
     */
    function getTokensCreatedByAddress(
        address _account
    ) external view returns (Structs.NFT[] memory);

    /**
     * @dev Get the creator of the token id
     * @param _tokenId The id of the token to get the creator from.
     * @return address
     * 
     * Requirements:
     *
     * - `tokenId` must exist.
     * 
     */
    function getTokenCreator(
        uint256 _tokenId
    )
        external
        view
        returns (address);

    // ==================== End Read Creator Data ==================== //

    // ==================== Begin Read Owner Data ==================== //

    /**
     * @dev Retrieves and array of tokens owned by caller.
     * @return Structs.NFT[] An array of NFTItems returned from the search query.
     *
     */
    function getTokensOwnedByMe() external view returns (Structs.NFT[] memory);

    /**
     * @dev Retrieves and array of tokens owned by an address.
     * @param _account account address that owns the token.
     * @return Structs.NFT[] An array of NFTItems returned from the search query.
     *
     */
    function getTokensOwnedByAddress(
        address _account
    ) external view returns (Structs.NFT[] memory);

    /**
     * @dev Get the owner of the token id
     * @param _tokenId The id of the token to get the owner from.
     * @return address
     * 
     * Requirements:
     *
     * - `tokenId` must exist.
     * 
     */
    function getTokenOwner(
        uint256 _tokenId
    )
        external
        view
        returns (address);

    /**
     * @dev Retrieves the number of tokens owned  by an account address.
     * @param _account The account address to get the balance from.
     * @return The balance of the account.
     */
    function getAccountTokenBalance(
        address _account
    ) external view returns (uint256);

    // ==================== End Read Owner Data ==================== //

    // Tokens

    /**
     * @dev Retrieves full details on an NFT.
     * @param _tokenId The id of the token to get the details from.
     * @return Structs.NFTItem 
     * @return string The token uri string that contains the metdata { see: tokenURIs }.
     * 
     * Requirements:
     *
     * - `tokenId` must exist.
     * 
     */
    function getNFTItem(
        uint256 _tokenId
    )
        external
        view
        returns (Structs.NFTItem memory, string memory);

    /**
     * @dev Retrieves a list of all available tokens.
     * @return @return Structs.NFTItem[] memory nftItems : an array of NFT items.
     */
    function getNFTItems() external view returns (Structs.NFT[] memory);

    /**
     * @dev Retrieves the activity history of a token.
     * @param _tokenId The id of the token to get the activity history.
     * @return TokenActivityItem[] 
     * 
     * Requirements:
     *
     * - `tokenId` must exist.
     * 
     */
    function getTokenAuditTrail(
        uint256 _tokenId
    ) 
    external 
    view 
    returns (Structs.TokenActivityItem[] memory);

    // Collections

    /**
     * @dev Retrieves the collection name.
     * @return The token name.
     */
    function collectionName() external view returns (string memory );

    /**
     * @dev Retrieves the collection symbol.
     * @return The token symbol.
     */
    function collectionSymbol() external view returns (string memory);

    // Category

    /**
     * @dev Retrieves the category of the collection.
     * @return Enums.TokenCategory tokenCategory
     */
    function collectionCategory() external view returns (Enums.TokenCategory);

    /**
     * @dev Retrieves the full description of the collection.
     * @return description text of the collection
     */
    function collectionDescription() external view returns (string memory);

    /**
     * @dev Retrieves a path to a banner media of this collection
     * @return bannerURL The uri to an image resource
     */
    function collectionBannerMedia() external view returns (string memory);

    /**
     * @dev Retrieves a path to a display picture of this collection
     * @return photoURL The uri to an image resource
     */
    function collectionDisplayPicture() external view returns (string memory);

    // Search

    /**
     * @dev Search and NFT, caller might have entered a tokenId
     * @param _uint256 The id of the token to look for
     * @return Structs.NFT[] An array of NFTItems returned from the search query.
     *
     */
    function searchTokenId(
        uint256 _uint256
    ) external view returns (
        Structs.NFT[] memory
    );

    /**
     * @dev Search and NFT, caller might have entered part or full token uri
     * @param _string Part or full token uri
     * @return Structs.NFT[] An array of NFTItems returned from the search query.
     *
     */
    function searchTokenURI(
        string memory _string
    ) external view returns (
        Structs.NFT[] memory
    );

    /**
     * @dev Search NFTs using a set of key value pair
     * @param _itemKey The NFT key to validate the query against.
     * @param _uint256 The data holds the encoded params to use in the query
     * @return Structs.NFT[] An array of NFTItems returned from the search query.
     *
     */
    function searchTimestamp(
        bytes32 _itemKey, 
        uint256 _uint256
    ) external view returns (
        Structs.NFT[] memory
    );

    /**
     * @dev Search NFTs using a set of key value pair
     * @param _itemKey The NFT key to validate the query against.
     * @param _address The data holds the encoded params to use in the query
     * @return Structs.NFT[] An array of NFTItems returned from the search query.
     *
     */
    function searchAddress(
        bytes32 _itemKey, 
        address _address
    ) external view returns (
        Structs.NFT[] memory
    );

    /******************************* Write Functions ******************************/

    /**
     * @dev Transfers a token to an account address `_to`.
     * @param _to Account to receive the token.
     * @param _tokenId The id of the token to transfer
     *
     * Requirements:
     *
     * - Only Admin can call this method
     */
    function transferToken(
        address _to, 
        uint256 _tokenId, 
        address _from
    ) 
        external ;

    /**
     * @dev Transfers `tokenId` token from `from` to `to`.
     *
     * WARNING: Note that the caller is responsible to confirm that the recipient is capable of receiving ERC721
     * or else they may be permanently lost. Usage of {safeTransferFrom} prevents loss, though the caller must
     * understand this adds an external call which potentially creates a reentrancy vulnerability.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `tokenId` token must be owned by `from`.
     * - If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 tokenId) external;

    /**
     * @dev Gives permission to `to` to transfer `tokenId` token to another account.
     * The approval is cleared when the token is transferred.
     *
     * Only a single account can be approved at a time, so approving the zero address clears previous approvals.
     *
     * Requirements:
     *
     * - The caller must own the token or be an approved operator.
     * - `tokenId` must exist.
     *
     * Emits an {Approval} event.
     */
    function approve(address to, uint256 tokenId) external;

    /**
     * @dev Approve or remove `operator` as an operator for the caller.
     * Operators can call {transferFrom} or {safeTransferFrom} for any token owned by the caller.
     *
     * Requirements:
     *
     * - The `operator` cannot be the caller.
     *
     * Emits an {ApprovalForAll} event.
     */
    function setApprovalForAll(address operator, bool approved) external;

    /**
     * @dev Grants an admin role to an account.
     * @param _account Account to grant the admin role.
     *
     * Requirements:
     *
     * - Only Admin can call this method
     */
    function grantAdminRole(address _account) external;

    /**
     * @dev Revokes an admin role from an account.
     * @param _account Account to revoke the admin role.
     *
     * Requirements:
     *
     * - Only Admin can call this method
     */
    function revokeAdminRole(address _account) external;

    /**
     * @dev Renounces an admin role from an account.
     * @param _account Account to renounce the admin role.
     *
     * Requirements:
     *
     * - Only Admin can call this method
     */
    function renounceAdminRole(address _account) external;

    /**
     * @dev Renounces ownership of the smart contract.
     *
     * Requirements:
     *
     * - Only Admin can call this method
     */
    function renounceContractOwnership() external;

    /**
     * @dev Grants the minter tole to an account.
     * @param _account Account to grant the minter role.
     *
     * Requirements:
     *
     * - Only Admin can call this method
     */
    function grantMinterRole(address _account) external;

    /**
     * @dev Revokes the minter role from an account.
     * @param _account Account to revoke the minter role.
     *
     * Requirements:
     *
     * - Only Admin can call this method
     */
    function revokeMinterRole(address _account) external;

    /**
     * @dev Sets the new base uri for this contract.
     * @param _account Base uri of the contract to change to.
     *
     * Requirements:
     *
     * - Only Admin can call this method
     */
    function renounceMinterRole(address _account) external;

    function approveAddressForToken(
        address _account,
        uint256 _tokenId
    ) 
        external;

    /**
     * @dev Sets the new base uri for this contract.
     * @param _newBaseURI Base uri of the contract to change to.
     *
     * Emits an {BaseURIChanged} event.
     * 
     * Requirements:
     *
     * - Only Admin can call this method
     */
    function setBaseURI(string calldata _newBaseURI) external;

    /**
     * @dev Sets the new contract uri for this contract.
     * @param _newContractURI Contract uri of the contract to 
     * change to (for contract level metadata).
     *
     * Emits an {ContractURIChanged} event.
     *
     * Requirements:
     *
     * - Only Admin can call this method.
     */
    function setContractURI(
        bytes32 _newContractURI
    ) external;

    /**
     * @dev Sets the collection description.
     * @param _description The lengthy description  of the collection.
     *
     * Emits an {CollectionDescriptionChanged} event.
     *
     * Requirements:
     *
     * - Only Admin can call this method
     */
    function setCollectionDescription(
        string calldata _description
    ) external;

    /**
     * @dev Sets collection banner media.
     * @param _bannerURL The uri of the collection dp.
     *
     * Emits an {CollectionBannerMediaChanged} event.
     *
     * Requirements:
     *
     * - Only Admin can call this method
     */
    function setCollectionBannerMedia(
        string calldata _bannerURL
    ) external;

    /**
     * @dev Sets collection display picture.
     * @param _photoURL The uri of the collection dp.
     *
     * Emits an {CollectionDisplayPictureChanged} event.
     *
     * Requirements:
     *
     * - Only Admin can call this method
     */
    function setCollectionDisplayPicture(
        string calldata _photoURL
    ) external;

    /**
     * @dev Sets the new marketplace address.
     * @param _newMarketplaceAddress marketplace address that will list the collection.
     *
     * Emits an {MarketplaceAddressChanged} event.
     *
     * Requirements:
     *
     * - Only Admin can call this method
     * - _newMarketplaceAddress must not be a zero address
     * 
     */
    function setMarketplaceAddress(
        address _newMarketplaceAddress
    ) external;
 
    /**
     * @dev Sets the new minting fee.
     * @param _newMintingFee New minting fee.
     *
     * Emits an {MintingFeeChanged} event.
     * 
     * Requirements:
     *
     * - Only Admin can call this method
     */
    function setMintingFee(
        uint256 _newMintingFee
    ) external;

    /**
     * @dev Sets the new _owner for this contract. 
     * This is only for compatibility for opensea and other protocols.
     * @param _newOwner New Owner address to set _owner to.
     *
     * Emits an {OwnerChanged} event.
     * 
     * Requirements:
     *
     * - Only Owner can call this method
     * - `_newOwner` must not be a zero address.
     */
    function setNewOwner(
        address _newOwner
    ) external;

    function ownerOf(
        uint256 _tokenId
    ) external view returns (address);

}


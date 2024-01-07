// SPDX-License-Identifier: MIT
/**
 * Created on 2023-05-05 14:36
 * @summary:
 * @author: dovellous
 */
pragma solidity ^0.8.19;
pragma experimental ABIEncoderV2;

/*********************************** Imports **********************************/

import "./ERCMKTPFactoryBase.sol";
import "./ERCMKTPFactoryWorker.sol";
import "./ERCMKTPFactoryAuction.sol";
contract ERCMKTPFactoryGetSet is
    ERCMKTPFactoryBase,
    ERCMKTPFactoryWorker,
    ERCMKTPFactoryAuction
{

    /**
     * Constructor arguments for erc721 implementation.
     *
     * @param _data encoded parameters
     */
    constructor (
        bytes memory _data
    ) payable ERCMKTPFactoryBase() {

        /**
         * initializer arguments for erc721 implementation.
         *
         * @param _contractURI encoded parameters
         * @param _admins encoded parameters
         * @param _listingFee encoded parameters
         */
        (
            bytes32 _contractURI,
            address[] memory _admins,
            uint256 _listingFee
        ) = abi.decode(
                _data,
                (
                    bytes32,
                    address[],
                    uint256
                )
            );

        address[] memory adminsArray = _admins;
        
        uint256 adminsLength = _admins.length;

        // Revert if we do not have admins
        if (adminsLength == 0) {
            revert Errors.NoAdmins();
        }

        // setup admin roles
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _grantRole(Snippets.ADMIN_ROLE, _msgSender());
        for (uint256 i; i < adminsLength; ++i) {
            _grantRole(Snippets.ADMIN_ROLE, adminsArray[i]);
        }

        // setup states
        
        contractURI = _contractURI;

        listingFee = _listingFee;
        
        owner = payable(_msgSender());

    }

    // ==================== Begin Reading State Variables ==================== //

    // URIs

    /**
     * @dev Retreives the contract url where the source code resides.
     * @return url bytes32.
     *
     */
    function getContractURI() external view returns (bytes32) {
        return contractURI;
    }

    // Admin

    /**
     * @dev Returns current _owner address. This is only for compatibility 
     * for other protocols.
     * @return _owner address.
     *
     */
    function getTokenListingFee() external view returns (uint256) {
        return listingFee;
    }

    // Admin

    /**
     * @dev Returns current _owner address. This is only for compatibility 
     * for other protocols.
     * @return _owner address.
     *
     */
    function getOwner() external view returns (address ) {
        return owner;
    }

    /**
     * @dev Returns current _owner address. This is only for compatibility 
     * for other protocols.
     * @return _tokenIndexedIDs.current.
     *
     */
    function getCurrentIndexedID() external view returns (uint256 ) {
        return _tokenIndexedIDs;
    }
    // ==================== End Reading State Variables ==================== //

    // ==================== Begin Read List Data ==================== //

    /**
     * @dev Retrieves and array of tokens minted by an address.
     * @param _account account address that minted the token.
     * @return Structs.NFTMarketItem[] An array of NFTMarketItems returned from the search query.
     *
     */
    function getNFTMarketItemsListedByAddress(
        address _account
    ) external view returns (Structs.NFTMarketItem[] memory) {
        return _search(Snippets.MINTER, abi.encode(_account));
    }

    /**
     * @dev Get the lister of the token id
     * @param _marketItemId The id of the token to get the minter from.
     * @return address
     * 
     * Requirements:
     *
     * - `_marketItemExists` must exist.
     * 
     */
    function getNFTItemUserAddresses(
        uint256 _marketItemId
    )
        external
        view
        whileIsValidMarketItem(getNFTMarketItem(_marketItemId))
        returns (address payable[3] memory)
    {
        Structs.NFTMarketItem memory marketplaceItem = tokenIdToNFTMarketItem[_marketItemId];
        return marketplaceItem.creatorSellerOwner;
    }

    // ==================== End Read List Data ==================== //

    // ==================== Begin Read Mint Data ==================== //

    /**
     * @dev Retrieves and array of tokens minted by an address.
     * @param _account account address that minted the token.
     * @return Structs.NFTMarketItem[] An array of NFTMarketItems returned from the search query.
     *
     */
    function getNFTItemsMintedByAddress(
        address _account
    ) external view returns (Structs.NFTMarketItem[] memory) {
        return _search(Snippets.MINTER, abi.encode(_account));
    }

    // ==================== End Read Mint Data ==================== //

    // ==================== Begin Read Creator Data ==================== //

    /**
     * @dev Retrieves and array of tokens created by an address.
     * @param _account account address that created the token.
     * @return Structs.NFTMarketItem[] An array of NFTMarketItems returned from the search query.
     *
     */
    function getNFTItemsCreatedByAddress(
        address _account
    ) external view returns (Structs.NFTMarketItem[] memory) {
        return _search(Snippets.CREATOR, abi.encode(_account));
    }

    // ==================== End Read Creator Data ==================== //

    // ==================== Begin Read Owner Data ==================== //

    /**
     * @dev Retrieves and array of tokens owned by caller.
     * @return Structs.NFTMarketItem[] An array of NFTMarketItems returned from the search query.
     *
     */
    function getNFTItemsOwnedByMe() external view returns (Structs.NFTMarketItem[] memory) {
        return _search(Snippets.OWNER, abi.encode(_msgSender()));
    }

    /**
     * @dev Retrieves and array of tokens owned by an address.
     * @param _account account address that owns the token.
     * @return Structs.NFTMarketItem[] An array of NFTMarketItems returned from the search query.
     *
     */
    function getNFTItemsOwnedByAddress(
        address _account
    ) external view returns (Structs.NFTMarketItem[] memory) {
        return _search(Snippets.OWNER, abi.encode(_account));
    }

    // ==================== End Read Owner Data ==================== //

    // Tokens

    /**
     * @dev Retrieves full details on an NFTMarketItem.
     * @param _marketItemId The id of the token to get the details from.
     * @return Structs.NFTMarketItem memory
.
     * 
     * Requirements:
     *
     * - `_marketItemExists` must exist.
     * 
     */
    function getNFTMarketItem(
        uint256 _marketItemId
    )
        public
        view
        returns (Structs.NFTMarketItem memory)
    {
        return tokenIndexedID2NFTMarketItem[_marketItemId];
    }

    /**
     * @dev Retrieves a list of all available tokens.
     * @return @return Structs.NFTMarketItem[] memory marketplaceItems : an array of NFTMarketItem items.
     */
    function getNFTMarketItems() external view returns (Structs.NFTMarketItem[] memory) {
        return _marketplaceItems();
    }

    /**
     * @dev Retrieves the activity history of a token.
     * @param _marketItemId The id of the token to get the activity history.
     * @return TokenActivityItem[] 
     * 
     * Requirements:
     *
     * - `_marketItemExists` must exist.
     * 
     */
    function getNFTItemAuditTrail(
        uint256 _marketItemId
    ) 
    public 
    view 
    whileIsValidMarketItem(getNFTMarketItem(_marketItemId))
    returns (Structs.NFTMarketItemActivity[] memory) {
        return tokenIdToNFTMarketItemActivity[_marketItemId];
    }

    /**
     * @dev Search and NFTMarketItem, caller might have entered a _marketItemExists
     * @param _uint256 The id of the token to look for
     * @return Structs.NFTMarketItem[] An array of NFTMarketItems returned from the search query.
     *
     */
    function searchTokenId(
        uint256 _uint256,
        address[] memory _extendedSearchAddress
    ) public view returns (
        Structs.NFTMarketItem[] memory,
        Structs.NFT[] memory,
        Structs.NFT[] memory
    ) {
        
        // Encode the _account parameter and pass it to the search function

        Structs.NFTMarketItem[] memory nftItemsMKT = _search(Snippets.TOKEN_ID, abi.encode(_uint256));

        Structs.NFT[] memory nftItems721;

        Structs.NFT[] memory nftItems1155;

        if(_extendedSearchAddress.length > 0 && _extendedSearchAddress[0] != address(0)){

            IERC721Factory erc721NFTFactorySmartContract  = IERC721Factory(_extendedSearchAddress[0]);
            
            nftItems721 = erc721NFTFactorySmartContract.searchTokenId(_uint256);

        }

        if(_extendedSearchAddress.length > 1 && _extendedSearchAddress[1] != address(0)){

            IERC1155Factory erc1155NFTFactorySmartContract = IERC1155Factory(_extendedSearchAddress[1]);
            
            nftItems1155 = erc1155NFTFactorySmartContract.searchTokenId(_uint256);

        }

        return (nftItemsMKT, nftItems721, nftItems1155);

    }

    /**
     * @dev Search and NFTMarketItem, caller might have entered part or full token uri
     * @param _string Part or full token uri
     * @return Structs.NFTMarketItem[] An array of NFTMarketItems returned from the search query.
     *
     */
    function searchTokenURI(
        string memory _string,
        address[] memory _extendedSearchAddress
    ) external view returns (
        Structs.NFTMarketItem[] memory,
        Structs.NFT[] memory,
        Structs.NFT[] memory
    ) {
        // Encode the _account parameter and pass it to the search function

        Structs.NFTMarketItem[] memory nftItemsMKT = _search(Snippets.STRING, abi.encode(_string));

        Structs.NFT[] memory nftItems721;

        Structs.NFT[] memory nftItems1155;

        if(_extendedSearchAddress.length > 0 && _extendedSearchAddress[0] != address(0)){

            IERC721Factory erc721NFTFactorySmartContract  = IERC721Factory(_extendedSearchAddress[0]);
            
            nftItems721 = erc721NFTFactorySmartContract.searchTokenURI(_string);

        }

        if(_extendedSearchAddress.length > 1 && _extendedSearchAddress[1] != address(0)){

            IERC1155Factory erc1155NFTFactorySmartContract = IERC1155Factory(_extendedSearchAddress[1]);
            
            nftItems1155 = erc1155NFTFactorySmartContract.searchTokenURI(_string);

        }

        return (nftItemsMKT, nftItems721, nftItems1155);

    }

    /**
     * @dev Search NFTMarketItems using a set of key value pair
     * @param _itemKey The NFTMarketItem key to validate the query against.
     * @param _uint256 The data holds the encoded params to use in the query
     * @return Structs.NFTMarketItem[] An array of NFTMarketItems returned from the search query.
     *
     */
    function searchTimestamp(
        bytes32 _itemKey, 
        uint256 _uint256,
        address[] memory _extendedSearchAddress
    ) external view returns (
        Structs.NFTMarketItem[] memory,
        Structs.NFT[] memory,
        Structs.NFT[] memory
    ) {
        // Encode the _account parameter and pass it to the search function

        Structs.NFTMarketItem[] memory nftItemsMKT = _search(_itemKey, abi.encode(_uint256));

        Structs.NFT[] memory nftItems721;

        Structs.NFT[] memory nftItems1155;

        if(_extendedSearchAddress.length > 0 && _extendedSearchAddress[0] != address(0)){

            IERC721Factory erc721NFTFactorySmartContract  = IERC721Factory(_extendedSearchAddress[0]);
            
            nftItems721 = erc721NFTFactorySmartContract.searchTimestamp(_itemKey, _uint256);

        }

        if(_extendedSearchAddress.length > 1 && _extendedSearchAddress[1] != address(0)){

            IERC1155Factory erc1155NFTFactorySmartContract = IERC1155Factory(_extendedSearchAddress[1]);
            
            nftItems1155 = erc1155NFTFactorySmartContract.searchTimestamp(_itemKey, _uint256);

        }

        return (nftItemsMKT, nftItems721, nftItems1155);

    }

    /**
     * @dev Search NFTMarketItems using a set of key value pair
     * @param _itemKey The NFTMarketItem key to validate the query against.
     * @param _address The data holds the encoded params to use in the query
     * @return Structs.NFTMarketItem[] An array of NFTMarketItems returned from the search query.
     *
     */
    function searchAddress(
        bytes32 _itemKey, 
        address _address,
        address[] memory _extendedSearchAddress
    ) external view returns (
        Structs.NFTMarketItem[] memory,
        Structs.NFT[] memory,
        Structs.NFT[] memory
    ) {
        // Encode the _account parameter and pass it to the search function

        Structs.NFTMarketItem[] memory nftItemsMKT = _search(_itemKey, abi.encode(_address));

        Structs.NFT[] memory nftItems721;

        Structs.NFT[] memory nftItems1155;

        if(_extendedSearchAddress.length > 0 && _extendedSearchAddress[0] != address(0)){

            IERC721Factory erc721NFTFactorySmartContract  = IERC721Factory(_extendedSearchAddress[0]);
            
            nftItems721 = erc721NFTFactorySmartContract.searchAddress(_itemKey, _address);

        }

        if(_extendedSearchAddress.length > 1 && _extendedSearchAddress[1] != address(0)){

            IERC1155Factory erc1155NFTFactorySmartContract = IERC1155Factory(_extendedSearchAddress[1]);
            
            nftItems1155 = erc1155NFTFactorySmartContract.searchAddress(_itemKey, _address);

        }

        return (nftItemsMKT, nftItems721, nftItems1155);

    }

    /******************************* Write Functions ******************************/

    /**
     * @dev Grants an admin role to an account.
     * @param _account Account to grant the admin role.
     *
     * Requirements:
     *
     * - Only Admin can call this method
     */
    function grantAdminRole(address _account) external onlyAdmin {
        grantRole(Snippets.ADMIN_ROLE, _account);
    }

    /**
     * @dev Revokes an admin role from an account.
     * @param _account Account to revoke the admin role.
     *
     * Requirements:
     *
     * - Only Admin can call this method
     */
    function revokeAdminRole(address _account) external onlyAdmin {
        revokeRole(Snippets.ADMIN_ROLE, _account);
    }

    /**
     * @dev Renounces an admin role from an account.
     * @param _account Account to renounce the admin role.
     *
     * Requirements:
     *
     * - Only Admin can call this method
     */
    function renounceAdminRole(address _account) external onlyAdmin {
        renounceRole(Snippets.ADMIN_ROLE, _account);
    }

    /**
     * @dev Renounces ownership of the smart contract.
     *
     * Requirements:
     *
     * - Only Admin can call this method
     */
    function renounceContractOwnership() external onlyAdmin {
        owner = payable(address(0));
    }

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
    ) external onlyAdmin {
        /**
         * @title:
         */
        contractURI = _newContractURI;
        emit ContractURIChanged(_newContractURI);
    }

    /**
     * @dev Sets the new minting fee.
     * @param _newListingFee New minting fee.
     *
     * Emits an {ListingFeeChanged} event.
     * 
     * Requirements:
     *
     * - Only Admin can call this method
     */
    function setListingFee(
        uint256 _newListingFee
    ) external onlyAdmin whileValidAmount(_newListingFee) {
        listingFee = _newListingFee;
        emit ListingFeeChanged(_newListingFee);
    }

    /**
     * @dev Sets the logger address.
     * @param _logger Address of the logger.
     * 
     * Requirements:
     *
     * - Only Admin can call this method
     */
    function setLoggerAddress(
        address _logger
    ) external onlyAdmin{
        require(_logger != address(0), "ILA");
        loggerAddress = _logger;
    }

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
    ) external onlyOwner whileValidAddress(_newOwner) {
        owner = payable(_newOwner);
        emit OwnerChanged(_newOwner);
    }

}

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

contract ERC721FactoryGetSet is
    ERC721FactoryBase,
    ERC721FactoryWorker,
    ERC721FactoryMinter,
    ERC721FactoryBurner
{

    /**
     * Constructor arguments for erc721 implementation.
     *
     * @param _name contract token name
     * @param _symbol contract token symbol
     * @param _data encoded parameters
     */
    constructor (
        string memory _name,
        string memory _symbol,
        bytes memory _data
    ) payable ERC721FactoryBase(_name, _symbol) {

        /**
         * initializer arguments for erc721 implementation.
         *
         * @param _name encoded parameters
         * @param _symbol encoded parameters
         * @param _contractURI encoded parameters
         * @param _baseUri encoded parameters
         * @param _tokenMaximumSupply encoded parameters
         * @param _royaltyFraction encoded parameters
         * @param _royaltyReceiver encoded parameters
         * @param _admins encoded parameters
         * @param _minters encoded parameters
         * @param _mintingFee encoded parameters
         * @param _tokenCategoryEnumIndex encoded parameters
         * @param _isPausable encoded parameters
         * @param _isBurnable encoded parameters
         */
        (
            bytes32 _contractURI,
            string memory _baseUri,
            uint256 _tokenMaximumSupply,
            uint96 _royaltyFraction,
            address _royaltyReceiver,
            address[] memory _admins,
            address[] memory _minters,
            uint256 _mintingFee,
            Enums.TokenCategory _tokenCategoryEnumIndex,
            bool _isPausable,
            bool _isBurnable
        ) = abi.decode(
                _data,
                (
                    bytes32,
                    string,
                    uint256,
                    uint96,
                    address,
                    address[],
                    address[],
                    uint256,
                    Enums.TokenCategory,
                    bool,
                    bool
                )
            );

        address[] memory adminsArray = _admins;
        uint256 adminsLength = _admins.length;

        address[] memory mintersArray = _minters;
        uint256 mintersLength = _minters.length;

        // Revert if we do not have admins
        if (adminsLength == 0) {
            revert Errors.NoAdmins();
        }

        // Revert if we do not have minters
        if (mintersLength == 0) {
            revert Errors.NoMinters();
        }

        // setup admin roles
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(Snippets.ADMIN_ROLE, msg.sender);
        for (uint256 i; i < adminsLength; ++i) {
            _grantRole(Snippets.ADMIN_ROLE, adminsArray[i]);
        }

        // setup admin role
        _grantRole(Snippets.MINTER_ROLE, msg.sender);
        for (uint256 i; i < mintersLength; ++i) {
            _grantRole(Snippets.MINTER_ROLE, mintersArray[i]);
        }

        // _tokenMaximumSupply of 0 implies no limit
        if (_tokenMaximumSupply != 0) {
            tokenMaximumSupply = _tokenMaximumSupply;
        } else {
            tokenMaximumSupply = type(uint256).max;
        }

        // setup the royalties receiver for each secondary purchase and above
        if (_royaltyFraction != 0 && _royaltyReceiver != address(0)) {
            royaltiesDisabledUntil = 0;
            royaltyReceiver = payable(_royaltyReceiver);
            royaltyFraction = _royaltyFraction;
            _setDefaultRoyalty(_royaltyReceiver, _royaltyFraction);
        }

        // setup states
        baseTokenURI = _baseUri;
        
        contractURI = _contractURI;

        mintingFee = _mintingFee;

        contractOptionIsBurnable = _isBurnable;
        
        contractOptionIsPausable = _isPausable;

        tokenCategory = _tokenCategoryEnumIndex; 
        
        owner = payable(msg.sender);

    }

    // ==================== Begin Reading State Variables ==================== //

    // URIs

    /**
     * @dev Returns the base uri of the contract.
     * @return url string.
     *
     */
    function getBaseURI() external view returns (string memory) {
        return baseTokenURI;
    }

    /**
     * @dev Retreives the contract url where the source code resides.
     * @return url bytes32.
     *
     */
    function getContractURI() external view returns (bytes32) {
        return contractURI;
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     * @param _tokenId tokenId.
     * @return string uri of the tokenId.
     *
     */
    function getTokenURI(
        uint256 _tokenId
    ) external view returns (string memory) {
        return tokenURI(_tokenId);
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

    // Marketplace

    /**
     * @dev Retrieves the marketplace address approved for toke transfers.
     * @return marketplaceAddress.
     *
     */
    function getMarketplaceAddress() external view returns (address ) {
        return marketplaceAddress;
    }

    // Royalties

    /**
     * @dev Returns current _owner address. This is only for compatibility 
     * for opensea and other protocols.
     * @return royaltyFraction.
     *
     */
    function getRoyaltyFraction() external view returns (uint96 ) {
        return royaltyFraction;
    }

    /**
     * @dev The default receiver of the token royalties.
     * @return address.
     *
     */
    function getRoyaltyReceiver() external view returns (address ) {
        return royaltyReceiver;
    }

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
        validToken(_exists(_tokenId), _tokenId, tokenMaximumSupply)
        returns (Structs.RoyaltyItem memory)
    {
        (address _royaltyReceiver, uint256 _royaltyAmount) = royaltyInfo(
            _tokenId,
            _tokenPrice
        );

        Structs.RoyaltyItem memory _royaltyItemStruct;

        if (_royaltyAmount != 0 && _royaltyReceiver != address(0)) {
            _royaltyItemStruct = Structs.RoyaltyItem(
                true,
                payable(_royaltyReceiver),
                (_royaltyAmount * _feeDenominator() / _tokenPrice),
                _royaltyAmount,
                _tokenPrice,
                _tokenId
            );
        }

        //Cleanup : @see 
        // https://github.com/dovellous/com-enftis/blob/master/gas-saving-tips/cleanup-variables.md

        delete _royaltyReceiver;
        delete _royaltyAmount;

        return _royaltyItemStruct;
    }

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
    function getRoyaltyFeeDenominator() external pure returns (uint96 ) {
        return _feeDenominator();
    }

    // Supply

    /**
     * @dev Retrieves the royalty info of a token including the fee base on price supplied.
     * @return `tokenMaximumSupply`
     *
     */
    function getTokenMaximumSupply() external view returns (uint256 ) {
        return tokenMaximumSupply;
    }

    /**
     * @dev Retrieves the royalty info of a token including the fee base on price supplied.
     * @return `_tokenCurrentSupply`
     *
     */
    function getTokenCurrentSupply() external view returns (uint256) {
        return _tokenCurrentSupply;
    }

    /**
     * @dev Retrieves the current token id. This represents
     * the current token supply.
     * @return _tokenIdCounter.
     */
    function getTokenCurrentId() external view returns (uint256) {
        return _tokenIdCounter;
    }

    // ==================== End Reading State Variables ==================== //

    // ==================== Begin Read Mint Data ==================== //

    /**
     * @dev Retrieves the royalty info of a token including the fee base on price supplied.
     *
     */
    function getTokenMintingFee() external view returns (uint256) {
        return mintingFee;
    }

    /**
     * @dev Retrieves and array of tokens minted by caller.
     * @return Structs.NFTItem[] An array of NFTItems returned from the search query.
     *
     */
    function getTokensMintedByMe() external view returns (Structs.NFT[] memory) {
        return _search(Snippets.MINTER, abi.encode(msg.sender));
    }

    /**
     * @dev Retrieves and array of tokens minted by an address.
     * @param _account account address that minted the token.
     * @return Structs.NFTItem[] An array of NFTItems returned from the search query.
     *
     */
    function getTokensMintedByAddress(
        address _account
    ) external view returns (Structs.NFT[] memory) {
        return _search(Snippets.MINTER, abi.encode(_account));
    }

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
        validToken(_exists(_tokenId), _tokenId, tokenMaximumSupply)
        returns (address)
    {
        (Structs.NFTItem memory nftItem,) = getNFTItem(_tokenId);
        return nftItem.minterAddress;
    }

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
        validToken(_exists(_tokenId), _tokenId, tokenMaximumSupply)
        returns (address)
    {
        (Structs.NFTItem memory nftItem,) = getNFTItem(_tokenId);
        return nftItem.creatorAddress[1];
    }

    // ==================== End Read Mint Data ==================== //

    // ==================== Begin Read Creator Data ==================== //

    /**
     * @dev Retrieves and array of tokens created by caller
     * @return Structs.NFT[] An array of NFTItems returned from the search query.
     *
     */
    function getTokensCreatedByMe() external view returns (Structs.NFT[] memory) {
        return _search(Snippets.CREATOR, abi.encode(msg.sender));
    }

    /**
     * @dev Retrieves and array of tokens created by an address.
     * @param _account account address that created the token.
     * @return Structs.NFT[] An array of NFTItems returned from the search query.
     *
     */
    function getTokensCreatedByAddress(
        address _account
    ) external view returns (Structs.NFT[] memory) {
        return _search(Snippets.CREATOR, abi.encode(_account));
    }

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
        validToken(_exists(_tokenId), _tokenId, tokenMaximumSupply)
        returns (address)
    {
        (Structs.NFTItem memory nftItem,) = getNFTItem(_tokenId);
        return nftItem.creatorAddress[0];
    }

    // ==================== End Read Creator Data ==================== //

    // ==================== Begin Read Owner Data ==================== //

    /**
     * @dev Retrieves and array of tokens owned by caller.
     * @return Structs.NFT[] An array of NFTItems returned from the search query.
     *
     */
    function getTokensOwnedByMe() external view returns (Structs.NFT[] memory) {
        return _search(Snippets.OWNER, abi.encode(msg.sender));
    }

    /**
     * @dev Retrieves and array of tokens owned by an address.
     * @param _account account address that owns the token.
     * @return Structs.NFT[] An array of NFTItems returned from the search query.
     *
     */
    function getTokensOwnedByAddress(
        address _account
    ) external view returns (Structs.NFT[] memory) {
        return _search(Snippets.OWNER, abi.encode(_account));
    }

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
        public
        view
        validToken(_exists(_tokenId), _tokenId, tokenMaximumSupply)
        returns (address)
    {
        return ownerOf(_tokenId);
    }

    /**
     * @dev Retrieves the number of tokens owned  by an account address.
     * @param _account The account address to get the balance from.
     * @return The balance of the account.
     */
    function getAccountTokenBalance(
        address _account
    ) external view returns (uint256) {
        return balanceOf(_account);
    }

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
        public
        view
        validToken(_exists(_tokenId), _tokenId, tokenMaximumSupply)
        returns (Structs.NFTItem memory, string memory)
    {
        return (tokenIdToNFTItem[_tokenId], tokenURIs[_tokenId]);
    }

    /**
     * @dev Retrieves a list of all available tokens.
     * @return @return Structs.NFTItem[] memory nftItems : an array of NFT items.
     */
    function getNFTItems() external view returns (Structs.NFT[] memory) {
        return _tokens();
    }

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
    public
    validToken(_exists(_tokenId), _tokenId, tokenMaximumSupply)
    returns (Structs.TokenActivityItem[] memory) {
        return IERCLogging(loggerAddress).getERCTokenLogging(address(this), _tokenId);
    }

    // Collections

    /**
     * @dev Retrieves the collection name.
     * @return The token name.
     */
    function collectionName() external view returns (string memory ) {
        return name();
    }

    /**
     * @dev Retrieves the collection symbol.
     * @return The token symbol.
     */
    function collectionSymbol() external view returns (string memory) {
        return symbol();
    }

    // Category

    /**
     * @dev Retrieves the category of the collection.
     * @return Enums.TokenCategory tokenCategory
     */
    function collectionCategory() external view returns (Enums.TokenCategory) {
        return tokenCategory;
    }

    /**
     * @dev Retrieves the full description of the collection.
     * @return description text of the collection
     */
    function collectionDescription() external view returns (string memory) {
        return description;
    }

    /**
     * @dev Retrieves a path to a banner media of this collection
     * @return bannerURL The uri to an image resource
     */
    function collectionBannerMedia() external view returns (string memory) {
        return bannerURL;
    }

    /**
     * @dev Retrieves a path to a display picture of this collection
     * @return photoURL The uri to an image resource
     */
    function collectionDisplayPicture() external view returns (string memory) {
        return photoURL;
    }

    // Search

    /**
     * @dev Search and NFT, caller might have entered a tokenId
     * @param _uint256 The id of the token to look for
     * @return Structs.NFT[] An array of NFTItems returned from the search query.
     *
     */
    function searchTokenId(
        uint256 _uint256
    ) public view returns (
        Structs.NFT[] memory
    ) {
        // Encode the _account parameter and pass it to the search function
        return _search(Snippets.TOKEN_ID, abi.encode(_uint256));

    }

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
    ) {
        // Encode the _account parameter and pass it to the search function
        return _search(Snippets.STRING, abi.encode(_string));

    }

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
    ) {
        // Encode the _account parameter and pass it to the search function
        return _search(_itemKey, abi.encode(_uint256));

    }

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
    ) {
        // Encode the _account parameter and pass it to the search function
        return _search(_itemKey, abi.encode(_address));

    }

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
        external 
       
        validToken(
            _exists(_tokenId), 
            _tokenId, 
            tokenMaximumSupply
        ) 
        whenIsApprovedOrOwner(
            _isAuthorized(_ownerOf(_tokenId), msg.sender, _tokenId)
        )
         
    {   

        console.log(ownerOf(_tokenId), _from, _to, _tokenId);

        if(_from == address(0)){
            _from = msg.sender;
        }
        safeTransferFrom(_from, _to, _tokenId);
    }

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
     * @dev Grants the minter tole to an account.
     * @param _account Account to grant the minter role.
     *
     * Requirements:
     *
     * - Only Admin can call this method
     */
    function grantMinterRole(address _account) external onlyAdmin {
        grantRole(Snippets.MINTER_ROLE, _account);
    }

    /**
     * @dev Revokes the minter role from an account.
     * @param _account Account to revoke the minter role.
     *
     * Requirements:
     *
     * - Only Admin can call this method
     */
    function revokeMinterRole(address _account) external onlyAdmin {
        revokeRole(Snippets.MINTER_ROLE, _account);
    }

    /**
     * @dev Sets the new base uri for this contract.
     * @param _account Base uri of the contract to change to.
     *
     * Requirements:
     *
     * - Only Admin can call this method
     */
    function renounceMinterRole(address _account) external {
        renounceRole(Snippets.MINTER_ROLE, _account);
    }

    function approveAddressForToken(
        address _account,
        uint256 _tokenId
    ) 
        external 
        validToken(
            _exists(_tokenId), 
            _tokenId, 
            tokenMaximumSupply
        ) 
    {
        approve(_account, _tokenId);
        emit ApprovedAddressForTokenChanged(_account, _tokenId);
    }

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
    function setBaseURI(string calldata _newBaseURI) external onlyAdmin {
        baseTokenURI = _newBaseURI;
        emit BaseURIChanged(_newBaseURI);
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
    ) external onlyAdmin {
        description = _description;
        emit CollectionDescriptionChanged(_description);
    }

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
    ) external onlyAdmin {
        bannerURL = _bannerURL;
        emit CollectionBannerMediaChanged(_bannerURL);
    }

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
    ) external onlyAdmin {
        photoURL = _photoURL;
        emit CollectionDisplayPictureChanged(_photoURL);
    }

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
    ) external validAccount(_newMarketplaceAddress) onlyAdmin {
        if (marketplaceAddress != address(0)) {
            setApprovalForAll(marketplaceAddress, false);
        }
        marketplaceAddress = payable(_newMarketplaceAddress);
        setApprovalForAll(_newMarketplaceAddress, true);
        emit MarketplaceAddressChanged(_newMarketplaceAddress);
    }
 
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
    ) external onlyAdmin nonZeroAmount(_newMintingFee) {
        mintingFee = _newMintingFee;
        emit MintingFeeChanged(_newMintingFee);
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
    ) external onlyAdmin {
        require(_logger != address(0), "IAA");
        loggerAddress = _logger;
        console.log(loggerAddress);
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
    ) external onlyOwner validAccount(_newOwner) {
        owner = payable(_newOwner);
        emit OwnerChanged(_newOwner);
    }

}

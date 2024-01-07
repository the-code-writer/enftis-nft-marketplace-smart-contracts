// SPDX-License-Identifier: MIT
/**
 * Created on 2023-05-05 14:36
 * @summary:
 * @author: dovellous
 */
pragma solidity ^0.8.19;
pragma experimental ABIEncoderV2;

/*********************************** Imports **********************************/

import "./ERC1155FactoryBase.sol";
import "./ERC1155FactoryWorker.sol";
import "./ERC1155FactoryMinter.sol";
import "./ERC1155FactoryBurner.sol";

/**
 * @dev {ERC1155} token, including:
 *
 *  - deploy with upgradeability, replaced constructors with initializer functions
 *  - a admin role that allows for token minting (creation)
 *  - royalty information See {ERC1155Royalty}.
 *  - token ID and URI autogeneration
 *
 * This contract uses {AccessControl} to lock permissioned functions using the
 * different roles
 *
 */

contract ERC1155FactoryGetSet is
    ERC1155FactoryBase,
    ERC1155FactoryWorker,
    ERC1155FactoryMinter,
    ERC1155FactoryBurner
{

    /**
     * Constructor arguments for erc1155 implementation.
     *
     * @param _url contract url
     * @param _data encoded parameters
     */
    constructor(
        string memory _url,
        bytes memory _data
    ) payable ERC1155FactoryBase(_url) {
        /**
         * initializer arguments for erc1155 implementation.
         *
         * @param _isPausable encoded parameters
         * @param _isBurnable encoded parameters
         * @param _admins encoded parameters
         * @param _minters encoded parameters
         * @param _royaltyFee encoded parameters
         * @param _mintingFee encoded parameters
         * @param _tokenMaximumSupply encoded parameters
         * @param _baseUri encoded parameters
         * @param _contractURI encoded parameters
         */
        (
            bool _isPausable,
            bool _isBurnable,
            address[] memory _admins,
            address[] memory _minters,
            uint96 _royaltyFee,
            uint256 _mintingFee,
            uint256 _tokenMaximumSupply,
            string memory _baseUri
        ) = abi.decode(
                _data,
                (
                    bool,
                    bool,
                    address[],
                    address[],
                    uint96,
                    uint256,
                    uint256,
                    string
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

        // setup states
        _setDefaultRoyalty(msg.sender, _royaltyFee);

        _setURI(_baseUri);

        //contractURI = _contractURI;

        mintingFee = _mintingFee;

        contractOptionIsPausable = _isPausable;

        contractOptionIsBurnable = _isBurnable;

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
        return super.uri(0);
    }

    /**
     * @dev See {IERC1155Metadata-tokenURI}.
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
    function getOwner() external view returns (address) {
        return owner;
    }

    // Marketplace

    /**
     * @dev Retrieves the marketplace address approved for toke transfers.
     * @return marketplaceAddress.
     *
     */
    function getMarketplaceAddress() external view returns (address) {
        return marketplaceAddress;
    }

    // Supply

    /**
     * @dev Returns the total quantity for a token ID
     * @param _tokenId uint256 ID of the token to query
     * @return Structs.Supplies
     *
     */
    function getTokenSupplies(
        uint256 _tokenId
    ) external view returns (Structs.Supplies memory) {
        return
            Structs.Supplies(
                mintedSupplyById[_tokenId],
                currentSupplyById[_tokenId],
                maxSupplyById[_tokenId]
            );
    }

    /**
     * @dev Retrieves the royalty info of a token including the fee base on price supplied.
     * @return `tokenMaximumSupply`
     *
     */
    function getTokenMaximumSupply() external view returns (uint256) {
        return tokenMaximumSupply;
    }

    /**
     * @dev Retrieves the current token id. This represents
     * the current token supply.
     * @return _tokenIdCounter.
     */
    function getTokenCurrentSupply() external view returns (uint256) {
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
    function getTokensMintedByMe()
        external
        view
        returns (Structs.NFT[] memory)
    {
        return _search(Snippets.MINTER, abi.encode(_msgSender()));
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
        (Structs.NFTItem memory nftItem, , ) = getNFTItem(_tokenId);
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
        (Structs.NFTItem memory nftItem, , ) = getNFTItem(_tokenId);
        return nftItem.creatorAddress[1];
    }

    // ==================== End Read Mint Data ==================== //

    // ==================== Begin Read Creator Data ==================== //

    /**
     * @dev Retrieves and array of tokens created by caller
     * @return Structs.NFT[] An array of NFTItems returned from the search query.
     *
     */
    function getTokensCreatedByMe()
        external
        view
        returns (Structs.NFT[] memory)
    {
        return _search(Snippets.CREATOR, abi.encode(_msgSender()));
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
    function getTokenCreator(uint256 _tokenId) external view returns (address) {
        return tokenIdToNFTItem[_tokenId].creatorAddress[0];
    }

    // ==================== End Read Creator Data ==================== //

    // ==================== Begin Read Owner Data ==================== //

    /**
     * @dev Retrieves and array of tokens owned by caller.
     * @return Structs.NFT[] An array of NFTItems returned from the search query.
     *
     */
    function getTokensOwnedByMe() external view returns (Structs.NFT[] memory) {
        return _search(Snippets.OWNER, abi.encode(_msgSender()));
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
    function getTokenOwner(uint256 _tokenId) public view returns (address) {
        return
            _exists(_tokenId)
                ? tokenIdToNFTItem[_tokenId].ownerAddress
                : address(0);
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
        returns (Structs.NFTItem memory, string memory, Structs.Supplies memory)
    {
        return (
            tokenIdToNFTItem[_tokenId],
            tokenURI(_tokenId),
            Structs.Supplies(
                mintedSupplyById[_tokenId],
                currentSupplyById[_tokenId],
                maxSupplyById[_tokenId]
            )
        );
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
        external
        validToken(_exists(_tokenId), _tokenId, tokenMaximumSupply)
        returns (Structs.TokenActivityItem[] memory)
    {
        return
            IERCLogging(loggerAddress).getERCTokenLogging(
                address(this),
                _tokenId
            );
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
    ) external view returns (Structs.NFT[] memory) {
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
    ) external view returns (Structs.NFT[] memory) {
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
    ) external view returns (Structs.NFT[] memory) {
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
    ) external view returns (Structs.NFT[] memory) {
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
        address _from,
        address _to,
        uint256 _tokenId,
        uint256 _amount,
        bytes memory data
    ) external
     {
        /*
        address _tokenOwner = tokenIdToNFTItem[_tokenId].creatorAddress[1];
        if (_tokenOwner == address(0)_tokenOwner == address(0)) {
            revert Errors.TokenDoesNotExists();
        }
        if (!_tokenOwner, msg.sender) {
            revert Errors.NotApprovedOrOwner(_tokenId);
        }
        */
        safeTransferFrom(_from, _to, _tokenId, _amount, data);
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

    /**
     * @dev Will update the base URI for the token
     * @param _tokenId The token to update. msg.sender must be its creator.
     * @param _tokenURI New URI for the token.
     */
    function setTokenURI(uint256 _tokenId, string memory _tokenURI) external {
        require(_exists(_tokenId), "TDE");
        if (tokenIdToNFTItem[_tokenId].creatorAddress[1] != msg.sender) {
            revert Errors.NotTokenOwner();
        }
        tokenURIs[_tokenId] = _tokenURI;
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
    function setMintingFee(uint256 _newMintingFee) external onlyAdmin {
        if (_newMintingFee > 0) {
            mintingFee = _newMintingFee;
            emit MintingFeeChanged(_newMintingFee);
        }
    }

    /**
     * @dev Sets the logger address.
     * @param _logger Address of the logger.
     *
     * Requirements:
     *
     * - Only Admin can call this method
     */
    function setLoggerAddress(address _logger) external onlyAdmin {
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
    function setNewOwner(address _newOwner) external onlyOwner {
        if (_newOwner != address(0)) {
            owner = payable(_newOwner);
            emit OwnerChanged(_newOwner);
        }
    }

    /**
     * @dev Burns `amount` tokens of token type `id` from `account`. See {ERC1155-_burn}.
     *
     * @param _from address of account to burn .
     * @param _tokenId tokenId to burn.
     * @param _amount token amount to burn.
     *
     * Emits a TransferSingle event.
     *
     * Requirements:
     * - `from` cannot be the zero address.
     * - `from` must have at least amount tokens of token type id.
     * - The caller must own `tokenId` or be an approved operator.
     */
    function burn(
        address _from,
        uint256 _tokenId,
        uint256 _amount
    ) public virtual override(ERC1155Burnable, ERC1155FactoryBurner) burnable {
        ERC1155FactoryBurner.burn(_from, _tokenId, _amount);
    }

    /**
     * @dev Burns `amount` tokens of token type `id` from `from`. See {ERC1155-_burn}.
     * Extension of {ERC1155} that allows token holders to destroy both their
     * own tokens and those that they have been approved to use.
     * @param _account address of account to burn from.
     * @param _ids tokenIds to burn.
     * @param _values token amounts to burn.
     *
     * Emits a TransferBatch event.
     *
     * Requirements:
     * - `from` cannot be the zero address.
     * - `from` must have at least amount tokens of token type id.
     * - The caller must own `tokenId` or be an approved operator.
     */
    function burnBatch(
        address _account,
        uint256[] memory _ids,
        uint256[] memory _values
    ) public virtual override(ERC1155Burnable, ERC1155FactoryBurner) burnable {
        ERC1155FactoryBurner.burnBatch(_account, _ids, _values);
    }

    /**
     * @dev Hook that is called before any token transfer. This includes minting
     * and burning, as well as batched variants.
     *
     * The same hook is called on both single and batched variants. For single
     * transfers, the length of the `ids` and `amounts` arrays will be 1.
     *
     * Calling conditions (for each `id` and `amount` pair):
     *
     * - When `from` and `to` are both non-zero, `amount` of ``from``'s tokens
     * of token type `id` will be  transferred to `to`.
     * - When `from` is zero, `amount` tokens of token type `id` will be minted
     * for `to`.
     * - when `to` is zero, `amount` of ``from``'s tokens of token type `id`
     * will be burned.
     * - `from` and `to` are never both zero.
     * - `ids` and `amounts` have the same, non-zero length.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _update(address from, address to, uint256[] memory ids, uint256[] memory amounts) internal virtual override(ERC1155FactoryBase) {
        ERC1155FactoryBase._update(
            from,
            to,
            ids,
            amounts
        );
    }
}

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

interface IERC1155Factory {

    
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
    function getContractURI() external view returns (string memory);

    /**
     * @dev See {IERC1155Metadata-tokenURI}.
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

    // Supply

    /**
     * @dev Returns the total quantity for a token ID
     * @param _tokenId uint256 ID of the token to query
     * @return Structs.Supplies
     *
     */
    function getTokenSupplies(
        uint256 _tokenId
    ) external view returns (Structs.Supplies memory);

    /**
     * @dev Retrieves the royalty info of a token including the fee base on price supplied.
     * @return `tokenMaximumSupply`
     *
     */
    function getTokenMaximumSupply() external view returns (uint256 );

    /**
     * @dev Retrieves the current token id. This represents
     * the current token supply.
     * @return _tokenIdCounter.
     */
    function getTokenCurrentSupply() external view returns (uint256);

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
        returns (Structs.NFTItem memory, string memory, Structs.Supplies memory);

    /**
     * @dev Retrieves a list of all available tokens.
     * @return @return Structs.NFTItem[] memory nftItems : an array of NFT items.
     */
    function getNFTItems() external view returns (Structs.NFT[] memory);

    // Collections

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
        address _from,
        address _to,
        uint256 _tokenId,
        uint256 _amount,
        bytes memory data
    ) 
        external;


    /**
     * @dev Transfers `amount` tokens of token type `id` from `from` to `to`.
     *
     * Emits a {TransferSingle} event.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - If the caller is not `from`, it must have been approved to spend ``from``'s tokens via {setApprovalForAll}.
     * - `from` must have a balance of tokens of type `id` of at least `amount`.
     * - If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155Received} and return the
     * acceptance magic value.
     */
    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes calldata data) external;
    
    /**
     * @dev xref:ROOT:erc1155.adoc#batch-operations[Batched] version of {safeTransferFrom}.
     *
     * Emits a {TransferBatch} event.
     *
     * Requirements:
     *
     * - `ids` and `amounts` must have the same length.
     * - If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155BatchReceived} and return the
     * acceptance magic value.
     */
    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] calldata ids,
        uint256[] calldata amounts,
        bytes calldata data
    ) external;


    /**
     * @dev Handles the receipt of a single ERC1155 token type. This function is
     * called at the end of a `safeTransferFrom` after the balance has been updated.
     *
     * NOTE: To accept the transfer, this must return
     * `bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"))`
     * (i.e. 0xf23a6e61, or its own function selector).
     *
     * @param operator The address which initiated the transfer (i.e. msg.sender)
     * @param from The address which previously owned the token
     * @param id The ID of the token being transferred
     * @param value The amount of tokens being transferred
     * @param data Additional data with no specified format
     * @return `bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"))` if transfer is allowed
     */
    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external returns (bytes4);
    
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

  /**
   * @dev Will update the base URI for the token
   * @param _tokenId The token to update. _msgSender() must be its creator.
   * @param _tokenURI New URI for the token.
   */
  function setTokenURI(
    uint256 _tokenId,
    string memory _tokenURI
  ) external;
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
        string memory _newContractURI
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
     
    function setNewOwner(
        address _newOwner
    ) external onlyOwner validAccount(_newOwner) {
        owner = payable(_newOwner);
        emit OwnerChanged(_newOwner);
    }*/

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
    ) external;

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
    ) external;

    function ownerOf(
        uint256 _tokenId
    ) external view returns (address);

}


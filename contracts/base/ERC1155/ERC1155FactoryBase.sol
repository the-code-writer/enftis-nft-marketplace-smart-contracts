// SPDX-License-Identifier: MIT
/**
 * Created on 2023-05-05 14:36
 * @summary:
 * @author: dovellous
 */
pragma solidity ^0.8.19;
pragma experimental ABIEncoderV2;

/*********************************** Imports **********************************/

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import '@openzeppelin/contracts/token/common/ERC2981.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';
import "@openzeppelin/contracts/utils/Pausable.sol";
import '@openzeppelin/contracts/utils/Multicall.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

import "../common/ERCFallback.sol";
import "../common/ERCModifiers.sol";
import "../common/IERCLogging.sol";

contract ERC1155FactoryBase is
    ERC1155,
    ERC1155URIStorage,
    ERC2981,
    ERC1155Burnable,
    Pausable,
    ERCFallback,
    ERCModifiers
{

    /// @dev Counters for tokenIds.
    uint256 public _tokenIdCounter;

    /// @dev Counters for token current supply.
    uint256 public _tokenCurrentSupply;

    /// Owner of the contract. 
    /// This is only for compatibility for other protocols.
    address payable public owner;

    /// @dev Marketplace address
    address payable public marketplaceAddress;

    /// @dev Token Maximum Supply
    uint256 public tokenMaximumSupply;

    /// @dev Logger address
    address public loggerAddress;
    
    /// @dev Contract URI where this code resides
    //string public contractURI;

    // max supply for each tokenId
    mapping(uint256 => uint256) public maxSupplyById;

    // minted supply for each tokenId
    mapping(uint256 => uint256) public mintedSupplyById;

    // minted supply for each tokenId
    mapping(uint256 => uint256) public currentSupplyById;

    /// @dev Token Id to Token URI mapping
    mapping(uint256 => string) internal tokenURIs;

    /// @dev Token Id to NFTItem mapping
    mapping(uint256 => Structs.NFTItem) public tokenIdToNFTItem;


    /*********************************** Events ***********************************/

    /// Dispatched when the contract owner has been updated.
    event OwnerChanged(
        address newOwner
    );

    /// Dispatched when the base uri has been updated.
    event BaseURIChanged(
        string newURI
    );

    /// Dispatched when the marketplace address has been updated.
    event MarketplaceAddressChanged(
        address newMarketplaceAddress
    );

    /// Dispatched when the minting fee has bene updated.
    event MintingFeeChanged(uint256 newMintingFee);

    /// Dispatched when a token has been minted.
    event TokenMinted(
        address creator,
        address minter,
        uint256 indexed newTokenId,
        uint256 batchSize
    );

    /// Dispatched when a token has been burned.
    event TokenBurned(
        address creator,
        address burner,
        uint256 indexed burnedTokenId,
        uint256 batchSize
    );

    /// Dispatched when a token has been transfered.
    event TokenTransfered(
        address creator,
        address burner,
        uint256 indexed transferedTokenId,
        uint256 batchSize
    );

    event Received(address, uint);
    
    /**
     * @dev Initialize the  base contract
     * @param _url NFT Base URI
     *
     */
    constructor(
        string memory _url
    ) ERC1155(_url) {}


    /**
        * @dev Returns whether the specified token exists by checking to see if it has a creator
        * @param _tokenId uint256 ID of the token to query the existence of
        * @return bool whether the token exists
        */
    function _exists(
        uint256 _tokenId
    ) internal view returns (bool) {
        return tokenIdToNFTItem[_tokenId].tokenId > 0;
    }

    
    /**
     * @dev Returns the base uri of the contract.
     *
     * This implementation returns the same URI for *all* token types. It relies
     * on the token type ID substitution mechanism
     * https://eips.ethereum.org/EIPS/eip-1155#metadata[defined in the EIP].
     *
     * Clients calling this function must replace the `\{id\}` substring with the
     * actual token type ID.
     *
     * Concatenates the base URI with a tokenURI based on the tokenId.
     *
     * @return string the base URI concatenated with the specified tokenURI for a tokenId.
     *
     */

    function baseURI() external view returns (string memory) {
        return super.uri(0);
    }

    /**
     * @dev Sets a new URI for all token types, by relying on the token type ID
        * substitution mechanism
        * https://eips.ethereum.org/EIPS/eip-1155#metadata[defined in the EIP].
    * @param _newURI New URI for all tokens
    */
    function setBaseURI(
        string memory _newURI
    ) external onlyOwner {
        _setURI(_newURI);
        emit BaseURIChanged(_newURI);
    }

    /**
     * @dev See {IERC1155MetadataURI-uri}.
     *
     * This implementation returns the same URI for *all* token types. It relies
     * on the token type ID substitution mechanism
     * https://eips.ethereum.org/EIPS/eip-1155#metadata[defined in the EIP].
     *
     * Clients calling this function must replace the `\{id\}` substring with the
     * actual token type ID.
     *
     * Concatenates the base URI with a tokenURI based on the tokenId.
     *
     * @param _tokenId the tokenId pointing to the tokenURI in the tokenURIs mapping.
     * @return string the base URI concatenated with the specified tokenURI for a tokenId.
     */
    function uri(uint256 _tokenId)
        public
        view
        virtual
        override(ERC1155, ERC1155URIStorage)
        returns (string memory)
    {
        if(_tokenId == 0){
            return super.uri(0);
        }
        return tokenURI(_tokenId);
    }

    
    function tokenURI(
        uint256 _tokenId
    )
        public
        view
        virtual
        returns (string memory)
    {
            
            return Snippets.getTokenURIFromID(
                _tokenId,
                super.uri(0),
                tokenURIs[_tokenId]
            );
        
    }
    
    /// @dev Set the royalty for all collection
    /// @param _feeNumerator The fee for collection
    function setDefaultRoyalty(address _receiver, uint96 _feeNumerator)
        external
        onlyOwner
    {
        _setDefaultRoyalty(_receiver, _feeNumerator);
    }

    /// @dev Set royalty fee for specific token
    /// @param _tokenId The tokenId where to add the royalty
    /// @param _receiver The royalty receiver
    /// @param _feeNumerator the fee for specific tokenId
    function setTokenRoyalty(
        uint256 _tokenId,
        address _receiver,
        uint96 _feeNumerator
    ) external onlyOwner {
        _setTokenRoyalty(_tokenId, _receiver, _feeNumerator);
    }

    /// @dev Allow owner to delete the default royalty for all collection
    function deleteDefaultRoyalty() external onlyOwner {
        _deleteDefaultRoyalty();
    }

    /// @dev Reset specific royalty
    /// @param tokenId The token id where to reset the royalty
    function resetTokenRoyalty(uint256 tokenId) external onlyOwner {
        _resetTokenRoyalty(tokenId);
    }

    /**
     * @dev Hook that is called after any token transfer. This includes minting
     * and burning, as well as batched variants.
     *
     * The same hook is called on both single and batched variants. For single
     * transfers, the length of the `id` and `amount` arrays will be 1.
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
    function _update(address from, address to, uint256[] memory ids, uint256[] memory amounts) internal virtual  override {
        
        if(paused()){
            revert Errors.DisabledOption('PAUSED');
        }
        unchecked {
                
            for(uint256 i; i < amounts.length; ++i){

                //Minted
                if (from == address(0)) {
                    IERCLogging(loggerAddress).logTokenActivity(
                        address(this),
                        from,
                        to,
                        ids[i],
                        Enums.TokenActivityType.Mint,
                        block.timestamp
                    );
                    emit TokenMinted(from, to, ids[i], amounts[i]);
                }

                //Burned
                if (to == address(0)) {
                    IERCLogging(loggerAddress).logTokenActivity(
                        address(this),
                        from,
                        to,
                        ids[i],
                        Enums.TokenActivityType.Burn,
                        block.timestamp
                    );
                    emit TokenBurned(from, to, ids[i], amounts[i]);
                }

                //Transfered
                if (to != address(0) && from != address(0)) {
                    //Log Eventnin after transfer

                    Structs.NFTItem memory _NFT = tokenIdToNFTItem[ids[i]];

                    _NFT.ownerAddress = to;
                    _NFT.updatedAt = block.timestamp;

                    tokenIdToNFTItem[ids[i]] = _NFT;
                    
                    IERCLogging(loggerAddress).logTokenActivity(
                        address(this),
                        from,
                        to,
                        ids[i],
                        Enums.TokenActivityType.Transfer,
                        block.timestamp
                    );

                    emit TokenTransfered(from, to, ids[i], amounts[i]);

                    delete _NFT;

                }

            }

        }

        super._update(from, to, ids, amounts);

    }



    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(
        bytes4 _interfaceId
    )
        public
        view
        virtual
        override(AccessControl, ERC2981, ERC1155)
        returns (bool)
    {
        return
            _interfaceId == type(IERC2981).interfaceId ||
            _interfaceId == type(IERC1155).interfaceId ||
            _interfaceId == type(IERC1155MetadataURI).interfaceId ||
            super.supportsInterface(_interfaceId);
    }

    // Fallback function must be declared as external.
    fallback() external payable {}

    // Receive is a variant of fallback that is triggered when msg.data is empty
    receive() external payable virtual {
        emit Received(msg.sender, msg.value);
    }
}

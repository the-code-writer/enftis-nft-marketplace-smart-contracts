// SPDX-License-Identifier: MIT
/**
 * Created on 2023-05-05 14:36
 * @summary:
 * @author: dovellous
 */
pragma solidity ^0.8.19;
pragma experimental ABIEncoderV2;

import "./ERC1155FactoryWorker.sol";

abstract contract ERC1155FactoryMinter is ERC1155FactoryWorker {

    using Snippets for *;

    /// Minting fee
    uint256 public mintingFee;

    /*********************************** Mappings ***********************************/

    mapping(uint256 => Structs.RoyaltyItem) internal tokenIdToRoyaltyItem;

    /**
     * @dev Retrieves the royalty info of a token including the fee base on price supplied.
     *
     */
    function tokenURIExists(
        string memory _tokenURI
    ) public pure returns (bool) {
        return bytes(_tokenURI).length == 0;
    }

    /**
     * @dev Mints a new token type and assigns _initialSupply to an address
     * NOTE: remove onlyOwner if you want third parties to create new tokens on
     *       your contract (which may change your IDs)
     * NOTE: The token id must be passed. This allows lazy creation of tokens or
     *       creating NFTs by setting the id's high bits with the method
     *       described in ERC1155 or to use ids representing values other than
     *       successive small integers. If you wish to create ids as successive
     *       small integers you can either subclass this class to count onchain
     *       or maintain the offchain cache of identifiers recommended in
     *       ERC1155 and calculate successive ids from that.
     *
     *      Mints a new token for the first time to set maxSupply and tokenURI.
     *
     * @param _to address of account to mint to.
     * @param _tokenId is the tokenId to mint.
     * @param _amount amount to be minted.
     * @param _maxSupply sets the max token supply of a token if maxSupplyById[tokenId] = 0.
     * @param _tokenURI sets the tokenURI of a token if tokenURIs[tokenId] is an empty string.
     * @param _data data to be passed to _mint.
     *
     * Emits a TransferSingle event.
     *
     * Requirements:
     *
     * - The caller must be a minter.
     * - `to` cannot be the zero address.
     * - If `to` refers to a smart contract,
     * it must implement IERC1155Receiver.onERC1155Received and return the acceptance magic value.
     */
    function mintSingle(
        address _to,
        uint256 _tokenId,
        uint256 _amount,
        uint256 _maxSupply,
        string memory _tokenURI,
        bytes memory _data
    ) public payable onlyMinter {

        // Ensure that the amount supplied is equal to the minting fee specified.
        
        _mintHelper(Structs.MinterHelperParams(
            _tokenId,
            _amount,
            _maxSupply,
            _tokenURI,
            _to
        ));

        _mint(_to, _tokenId, _amount, _data);

    }

    /**
     * @dev Mints a batch of new tokens.
     *
     * @param _to address of account to mint to.
     * @param _tokenIds tokenIds to be minted.
     * @param _amounts amounts to be minted.
     * @param _maxSupplies maxSupplies sets the max allowed to be minted if maxSupply[tokenId] = 0.
     * @param _tokenURIs sets the tokenURI of a token if tokenURIs[tokenId] is an empty string. If left empty defaults to tokenId.
     * @param _data data to be passed to _mintBatch.
     *
     * Emits a TransferBatch event.
     *
     * Requirements:
     *
     * - tokenIds, amounts, tokenURIs array size must be equal.
     * - The caller must be a minter.
     * - Account cannot be the zero address.
     */
    function mintBatch(
        address _to,
        uint256[] calldata _tokenIds,
        uint256[] calldata _amounts,
        uint256[] memory _maxSupplies,
        string[] memory _tokenURIs,
        bytes memory _data
    ) public payable onlyMinter {

        uint256 tokenQuantities = _tokenIds.length;

        if (
            !(tokenQuantities == _maxSupplies.length &&
                tokenQuantities == _amounts.length &&
                tokenQuantities == _tokenURIs.length)
        ) {
            revert Errors.ArrayLengthMismatch();
        }
        for (uint256 i; i < tokenQuantities; ++i) {

            _mintHelper(Structs.MinterHelperParams(
                _tokenIds[i],
                _amounts[i],
                _maxSupplies[i],
                _tokenURIs[i],
                _to
            ));

        }
        _mintBatch(_to, _tokenIds, _amounts, _data);
    }

    /**
     * @dev Helper that handles business logic for tokenMaximumSupply, maxTokenSupply, currentSupply and tokenURIs.
     *
     * @param _data sets the tokenURI of a token if tokenURIs[tokenId] is an empty string.
     */
    function _mintHelper(
        Structs.MinterHelperParams memory _data
    ) internal {

        // Ensure that the amount supplied is equal to the minting fee specified.
        if (msg.value < mintingFee) {
            revert Errors.PriceBelowMintingFee({
                mintingFee: mintingFee,
                value: msg.value
            });
        }

        if(maxSupplyById[_data.tokenId] == 0){

            //Token Creation

            _tokenIdCounter++;
                
            if (_tokenIdCounter > tokenMaximumSupply) {
                revert Errors.MaximumTokenSupplyReached({
                    maxValue: tokenMaximumSupply,
                    value: _data.tokenId
                });
            }
        
            if (_data.maxSupply == 0) {
                revert Errors.ZeroTokenSupply({
                    maxSupplyById: tokenMaximumSupply,
                    tokenId: _data.tokenId
                });
            }

            maxSupplyById[_data.tokenId] = _data.maxSupply;

        }
        
        if (mintedSupplyById[_data.tokenId] + _data.amount > maxSupplyById[_data.tokenId]) {
            revert Errors.SpecifiedTokenSupplyReached({
                maxSupplyById: maxSupplyById[_data.tokenId],
                tokenId: _data.tokenId
            });
        }

        if (bytes(tokenURIs[_data.tokenId]).length == 0) {
            tokenURIs[_data.tokenId] = _data.tokenURI;
        }

        tokenIdToNFTItem[_data.tokenId] = Structs.NFTItem(
            _msgSender(),
            [_msgSender(), _data.to],
            _data.to,
            _data.tokenId,
            block.timestamp,
            block.timestamp
        );

        mintedSupplyById[_data.tokenId] = mintedSupplyById[_data.tokenId] + _data.amount;

        currentSupplyById[_data.tokenId] = currentSupplyById[_data.tokenId] + _data.amount;

    }

    /**
     * @dev Pauses token transfers. See {Pausable}.
     *
     * Requirements:
     *
     * - Only Owner/Admin can call this method.
     * - Only contracts with pausable active can call this method.
     */
    function pause() public onlyAdmin onlyWhenIsPausable {
        _pause();
    }

    /**
     * @dev Unpauses token transfers. See {Pausable}.
     *
     * Requirements:
     *
     * - Only Owner/Admin can call this method.
     * - Only contracts with pausable active can call this method.
     */
    function unpause() public onlyAdmin onlyWhenIsPausable {
        _unpause();
    }

    /*********************************** Internal Functions ***********************************/

}

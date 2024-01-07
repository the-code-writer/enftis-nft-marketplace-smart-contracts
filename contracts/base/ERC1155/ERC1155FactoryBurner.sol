// SPDX-License-Identifier: MIT
/**
 * Created on 2023-05-05 14:36
 * @summary:
 * @author: dovellous
 */
pragma solidity ^0.8.19;
pragma experimental ABIEncoderV2;

import "./ERC1155FactoryWorker.sol";

abstract contract ERC1155FactoryBurner is ERC1155FactoryWorker {

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
    ) public virtual burnable override {
        if (_from != _msgSender() && !isApprovedForAll(_from, _msgSender())) {
            revert Errors.NotApprovedOrOwner();
        }
        _burn(_from, _tokenId, _amount);
        _resetTokenRoyalty(_tokenId);
        currentSupplyById[_tokenId] = currentSupplyById[_tokenId] - _amount;
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
    ) public virtual burnable override {
        if (_account != _msgSender() && !isApprovedForAll(_account, _msgSender())) {
            revert Errors.NotApprovedOrOwner();
        }
        _burnBatch(_account, _ids, _values);
        for (uint256 i; i < _values.length; ++i) {
            _resetTokenRoyalty(_ids[i]);
            currentSupplyById[_ids[i]] = currentSupplyById[_ids[i]] - _values[i];
        }
    }

}

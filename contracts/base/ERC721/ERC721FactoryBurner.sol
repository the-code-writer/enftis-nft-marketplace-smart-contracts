// SPDX-License-Identifier: MIT
/**
 * Created on 2023-05-05 14:36
 * @summary:
 * @author: dovellous
 */
pragma solidity ^0.8.19;
pragma experimental ABIEncoderV2;

import "./ERC721FactoryWorker.sol";

abstract contract ERC721FactoryBurner is ERC721FactoryWorker {

    /**
     * @dev Burns `tokenId`. See {ERC721-_burn}.
     * @param _tokenId id of the token to burn.
     *
     * Requirements:
     *
     * - The caller must own `tokenId` or be an approved operator.
     */
    function burnToken(uint256 _tokenId) public whenIsApprovedOrOwner(
            _isAuthorized(_ownerOf(_tokenId), _msgSender(), _tokenId)
        ) {
        
        _resetTokenRoyalty(_tokenId);

        _tokenCurrentSupply--;

        super._burn(_tokenId);
        
    }
}

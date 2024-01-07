// SPDX-License-Identifier: MIT
/**
 * Created on 2023-05-05 14:36
 * @summary:
 * @author: dovellous
 */
pragma solidity ^0.8.19;
pragma experimental ABIEncoderV2;

import "./ERC721FactoryWorker.sol";

abstract contract ERC721FactoryMinter is ERC721FactoryWorker {

    using Snippets for *;
    /// royalty states

    address payable public royaltyReceiver;

    uint96 public royaltyFraction;

    uint256 public royaltiesDisabledUntil;

    /// Minting fee
    uint256 public mintingFee;

    /*********************************** Mappings ***********************************/

    mapping(uint256 => Structs.RoyaltyItem) internal tokenIdToRoyaltyItem;

    mapping(string => bool) internal usedTokenURIs;

    /**
     * @dev Retrieves the royalty info of a token including the fee base on price supplied.
     *
     */
    function tokenURIExists(
        string calldata _tokenURI
    ) public view returns (bool) {
        return usedTokenURIs[_tokenURI] == true;
    }

    /**
     * @dev Mints a new token.
     *
     * @param _to address to mint to.
     * @param _tokenURI uri of the token to be minted.
     * @return tokenId id of the minted token.
     *
     * Requirements:
     *
     * - The caller must be an admin or owner.
     */
    function mintNewToken(
        address _to,
        string calldata _tokenURI,
        uint96 _royaltyFraction
    ) public payable onlyMinter returns (uint256) {

        _tokenIdCounter++;

        // Set the tokenId
        uint256 newTokenId = _tokenIdCounter;

        if (newTokenId > tokenMaximumSupply) {
            revert Errors.MaximumTokenSupplyReached({
                maxValue: tokenMaximumSupply,
                value: newTokenId
            });
        }

        // Ensure that the amount supplied is equal to the minting fee specified.
        if (msg.value < mintingFee) {
            revert Errors.PriceBelowMintingFee({
                mintingFee: mintingFee,
                value: msg.value
            });
        }

        // Ensure that the token URI provided already exists. NFTs are non-fungible.
        if (tokenURIExists(_tokenURI)) {
            revert Errors.TokenURIAlreadyExists({
                tokenURI: _tokenURI
            });
        }

        unchecked {

            tokenIdToNFTItem[newTokenId] = Structs.NFTItem(
                _msgSender(),
                [_msgSender(), _to],
                _to,
                newTokenId,
                block.timestamp,
                block.timestamp
            );

            tokenURIs[newTokenId] = _tokenURI;

            usedTokenURIs[_tokenURI] = true;

            _safeMint(_to, newTokenId);

            _setTokenURI(newTokenId, _tokenURI);

            // Give the marketplace approval to transact NFTs between users
            if(marketplaceAddress != address(0)){
                setApprovalForAll(marketplaceAddress, true);
            } 

            _tokenCurrentSupply++;

            if (royaltiesDisabledUntil < block.timestamp) {
                if (_royaltyFraction > 0) {
                    setRoyalties(
                        _msgSender(),
                        _royaltyFraction,
                        newTokenId
                    );
                }
            }
        }

        return newTokenId;

    }

    /**
     * @dev Sets the new royalty percentage.
     * @param _royaltyFraction The percentage to pay the royalties.
     * @param _royaltyReceiver The receiver of the royalties
     * @param _tokenId The id of the token to set the royalty
     * 
     * If we set 1, per = 100 * 1 -> 100 / 100 => 1%
     * 
     * There are no fractions in solidity
     *
     * Emits an {RoyaltyFractionChanged} event.
     *
     * Requirements:
     *
     * - Only Admin can call this method
     * - The royaltyReceiver must not be a zero address
     * 
     * Notes 
     * - If _royaltyFraction is zero hen royalties are disabled for new items for that moment
     * - If _tokenId is zero or undefined, set the default values
     * 
     */
    function setRoyalties(
        address _royaltyReceiver,
        uint96 _royaltyFraction,
        uint256 _tokenId
    ) public onlyAdmin whenRoyaltiesAreEnabled(royaltiesDisabledUntil) {

        if(_royaltyReceiver != address(0)){
            royaltyReceiver = payable(_royaltyReceiver);
            if(_tokenId != 0){
                _setTokenRoyalty(
                    _tokenId,
                    _royaltyReceiver,
                    _royaltyFraction
                );
            }else{
                _setDefaultRoyalty(
                    _royaltyReceiver, 
                    _royaltyFraction
                );
            }
        }
        royaltyFraction = _royaltyFraction;
        emit RoyaltiesChanged(_royaltyReceiver, _royaltyFraction, _tokenId);
    }

    /*
     * @dev Enables / Disabled royalties for a specific period
     * @param _timestamp the block timestamp afterwhich royalties can be set
     * 
     * Requirements:
     * - Only the admin can call this function
     * 
     */
    function disableRoyaltiesUntil(uint256 _timestamp) external onlyAdmin {
        royaltiesDisabledUntil = _timestamp;
        if(_timestamp > 0){
            emit RoyaltiesDisabled(_timestamp);
        }else{
            emit RoyaltiesEnabled();
        }
    }
 
}

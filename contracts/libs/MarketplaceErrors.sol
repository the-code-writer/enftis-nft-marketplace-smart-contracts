// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
pragma experimental ABIEncoderV2;

/*

============
Errors.sol
============

name        :   Enftis NFT Factory Token
symbol      :   ENFTIS
tokenTypes  :   ERC721, ERC165, ERC2968
maxSupply   :   uint256.max()
solhcVersion:   0.8.20
version     :   1.0.0
released    :   25 March 2023
developers  :   @enftix
license     :   MIT License
networks    :   ethereum, polygon, binance

*/

import "./Enums.sol";
import "./Structs.sol";

library MarketplaceErrors {

    /*********************************** Errors ***********************************/

    /**
     * Insufficient permissions for caller.
     *
     * @param marketplaceItem - requested account role.
     */
    error InvalidMarketItem(
        Structs.NFTMarketItem marketplaceItem
    );

    /**
     * Insufficient permissions for caller.
     *
     * @param interfaceId - requested account role.
     */
    error InvalidInterfaceId(
        bytes4 interfaceId
    );

    /**
     * @dev Caller is not approved or owner of the token.
     *
     */
    error CallerNotLister();

    /**
     * @dev Caller is not approved or owner of the token.
     *
     */
    error CallerNotSeller();

    /**
     * @dev Caller is not approved or owner of the token.
     *
     */
    error CallerNotHighestBidder();

    /**
     * @dev Caller is not approved or owner of the token.
     */
    error NotTokenOwner();

    /**
     * This contract was not initialized with that option
     *
     * @param tokenIndexedID : whether this contract has that option active.
     */
    error ItemAlreadySold(uint256 tokenIndexedID);

    /**
     * This contract was not initialized with that option
     *
     * @param tokenIndexedID : whether this contract has that option active.
     */
    error ItemAlreadyOnSale(uint256 tokenIndexedID);

    /**
     * This contract was not initialized with that option
     *
     * @param tokenIndexedID : whether this contract has that option active.
     */
    error ItemAlreadyOnAuction(uint256 tokenIndexedID);

    /**
     * Specified amount must be equal to the minting fee defined.
     *
     * @param mintingFee : fee for minting a token.
     * @param value : entered value.
     *
     * Requirements:
     *
     * - value >= mintingFee.
     */
    error ItemPriceTooLow(
        uint256 mintingFee,
        uint256 value
    );

    /**
     * Specified item amount must not be zero.
     *
     * Requirements:
     *
     * - value > 0.
     */
    error ItemListingPriceTooLow();

    /**
     * Specified amount must be equal to the minting fee defined.
     *
     * @param mintingFee : fee for minting a token.
     * @param value : entered value.
     *
     * Requirements:
     *
     * - value >= mintingFee.
     */
    error ListingPriceTooLow(
        uint256 mintingFee,
        uint256 value
    );

    /**
     * Specified account address must be a valid ethereum wallet address.
     *
     * @param account the uri of the token.
     *
     * Requirements:
     *
     * - account address must not be a zero address(0).
     */

    error InvalidAddress(address account);

    /**
     * Specified account address must be a valid ethereum wallet address.
     *
     * @param amount the uri of the token.
     *
     * Requirements:
     *
     * - account address must not be a zero address(0).
     */
    error InvalidAmount(uint256 amount);

}

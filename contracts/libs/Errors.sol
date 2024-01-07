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

library Errors {

    /*********************************** Errors ***********************************/

    /**
     * Insufficient permissions for caller.
     *
     * @param caller - caller address.
     * @param requiredRole - requested account role
     */
    error InsufficientPermissions(
        address caller,
        bytes32 requiredRole
    );

    /**
     * @dev Caller is not approved or owner of the token.
     *
     */
    error NotApprovedOrOwner();

    /**
     * @dev Caller is not approved or owner of the token.
     *
     */
    error NotTokenOwner();

    /**
     * This contract was not initialized with that option
     *
     * @param option : whether this contract has that option active.
     */
    error DisabledOption(string option);

    /**
     * This contract is trying to be initialized without admins.
     *
     */
    error NoAdmins();

    /**
     * This contract is trying to be initialized without minters.
     *
     */
    error NoMinters();

    /**
     * Specified id must be less than the max supply defined.
     *
     * @param maxValue : max supply specified during initialization.
     * @param value : entered value.
     *
     * Requirements:
     *
     * - tokenId must be below tokenMaximumSupply.
     */
    error MaximumTokenSupplyReached(uint256 maxValue, uint256 value);

    /**
     * Specified id must be less than the max supply defined.
     *
     * @param tokenId : entered tokenId.
     *
     * Requirements:
     *
     * - tokenId must be below tokenMaximumSupply.
     */
    error IndexOutOfBounds(uint256 tokenId);
 
    /**
     * Specified id must represent an already minted token. Also the token must not have been burned.
     *
     * @param tokenId : entered tokenId.
     *
     * Requirements:
     *
     * - tokenId must have been minted or not burned.
     */
    error TokenDoesNotExists(uint256 tokenId);

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
    error PriceBelowMintingFee(
        uint256 mintingFee,
        uint256 value
    );

    /**
     * The specified tokenURI must be unique. Non fungible token are unique unlike ERC20
     *
     * @param tokenURI : entered tokenURI.
     *
     * Requirements:
     *
     * - _tokenURI must be unique since NFTs are non-fungible.
     */

    error TokenURIAlreadyExists(
        string tokenURI
    );

    /**
     * @dev Specified amount must be equal to the minting fee defined.
     *
     *
     * Requirements:
     *
     * - Value must be more than zero.
     */

    error InvalidAmount();

    /**
     * @dev The caller must not be a contract address.
     *
     *
     * Requirements:
     *
     * - Code size of the caller address must not be zero
     */

    error UnAuthorizedCaller(address account);

    /**
     * Specified account address must be a valid ethereum wallet address.
     *
     * @param account the uri of the token.
     *
     * Requirements:
     *
     * - account address must not be a zero address(0).
     */

    error ZeroAddress(address account);

    /**
     * Royalties are disabled for the time being.
     *
     * @param timestamp the timestamp afterwhich royalties can be set again.
     *
     * Requirements:
     *
     * - account address must not be a zero address(0).
     */

    error RoyaltiesDisabled(uint256 timestamp);

    /**
     * Array lengths are mismatched.
     */
    error ArrayLengthMismatch();

    /**
     * Specified id must be less than the max tokenIds defined.
     *
     * @param maxSupplyById max tokenIds specified in initialization.
     * @param tokenId entered tokenId.
     *
     */
    error SpecifiedTokenSupplyReached(uint256 maxSupplyById, uint256 tokenId);

    /**
     * tokenMaximumSupply must be greater than zero.
     *
     * @param maxSupplyById max supply specified in initialization.
     * @param tokenId entered tokenId.
     *
     */
    error ZeroTokenSupply(uint256 maxSupplyById, uint256 tokenId);

}

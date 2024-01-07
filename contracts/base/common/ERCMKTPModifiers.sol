// SPDX-License-Identifier: MIT
/**
 * Created on 2023-05-05 14:35
 * @summary:
 * @author: dovellous
 */
pragma solidity ^0.8.19;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./ERCFallback.sol";
import "../ERC721/IERC721Factory.sol";
import "../ERC1155/IERC1155Factory.sol";

import "../../libs/Snippets.sol";
import "../../libs/Structs.sol";
import "../../libs/MarketplaceErrors.sol";

abstract contract ERCMKTPModifiers is AccessControl, ERCFallback {
    /********************************* Modifiers **********************************/

    /**
     * @dev : reverts InsufficientPermissions error if caller does not have admin or owner role.
     */
    function _onlyAdmin() private view {
        if (
            !hasRole(Snippets.ADMIN_ROLE, _msgSender()) &&
            !hasRole(DEFAULT_ADMIN_ROLE, _msgSender())
        ) {
            revert Errors.InsufficientPermissions({
                caller: _msgSender(),
                requiredRole: Snippets.ADMIN_ROLE
            });
        }
    }

    modifier onlyAdmin() {
        _onlyAdmin();
        _;
    }

    /**
     * @dev : reverts InsufficientPermissions error if caller does not have owner role.
     */
    function _onlyOwner() private view {
        if (!hasRole(DEFAULT_ADMIN_ROLE, _msgSender())) {
            revert Errors.InsufficientPermissions({
                caller: _msgSender(),
                requiredRole: DEFAULT_ADMIN_ROLE
            });
        }
    }

    modifier onlyOwner() {
        _onlyOwner();
        _;
    }

    /**
     * @dev : reverts ItemHasBeenSold error if the item has been sold.
     */
    function _whileNotSold(
        Structs.NFTMarketItem memory _marketplaceItem
    ) private pure {
        if (_marketplaceItem.sold) {
            revert MarketplaceErrors.ItemAlreadySold(
                _marketplaceItem.tokenIndexedID
            );
        }
    }

    modifier whileNotSold(Structs.NFTMarketItem memory _marketplaceItem) {
        _whileNotSold(_marketplaceItem);
        _;
    }

    /**
     * @dev : reverts ItemAlreadyOnSale error if the item is on sale.
     */
    function _whileNotOnSale(
        Structs.NFTMarketItem memory _marketplaceItem
    ) private pure {
        if (_marketplaceItem.isListed) {
            revert MarketplaceErrors.ItemAlreadyOnSale(
                _marketplaceItem.tokenIndexedID
            );
        }
    }

    modifier whileNotOnSale(Structs.NFTMarketItem memory _marketplaceItem) {
        _whileNotOnSale(_marketplaceItem);
        _;
    }

    /**
     * @dev : reverts ItemAlreadyOnAuction error if the item is on auction.
     */
    function _whileNotOnAuction(
        Structs.NFTMarketItem memory _marketplaceItem
    ) private pure {
        if (_marketplaceItem.isAuction) {
            revert MarketplaceErrors.ItemAlreadyOnAuction(
                _marketplaceItem.tokenIndexedID
            );
        }
    }

    modifier whileNotOnAuction(Structs.NFTMarketItem memory _marketplaceItem) {
        _whileNotOnAuction(_marketplaceItem);
        _;
    }

    /**
     * @dev : reverts InvalidAddress error if the adress is invalid.
     */
    function _whileValidAmount(uint256 _amount) private pure {
        if (_amount < 1) {
            revert MarketplaceErrors.InvalidAmount(_amount);
        }
    }

    modifier whileValidAmount(uint256 _amount) {
        _whileValidAmount(_amount);
        _;
    }

    /**
     * @dev : reverts InvalidAddress error if the adress is invalid.
     */
    function _whileValidAddress(address _account) private pure {
        if (_account == address(0)) {
            revert MarketplaceErrors.InvalidAddress(_account);
        }
    }

    modifier whileValidAddress(address _account) {
        _whileValidAddress(_account);
        _;
    }

    /**
     * @dev : reverts InvalidAddress error if the adress is invalid.
     */
    function _whileIsValidInterface(
        bytes4 tokenInterfaceId,
        address tokenContractAddress
    ) private view {
        if (tokenInterfaceId == Snippets.ERC721INTERFACE) {
            if (
                !ERC165Checker.supportsInterface(
                    tokenContractAddress,
                    Snippets.ERC721INTERFACE
                )
            ) {
                revert MarketplaceErrors.InvalidInterfaceId(tokenInterfaceId);
            }
        }

        if (tokenInterfaceId == Snippets.ERC1155INTERFACE) {
            if (
                !ERC165Checker.supportsInterface(
                    tokenContractAddress,
                    Snippets.ERC1155INTERFACE
                )
            ) {
                revert MarketplaceErrors.InvalidInterfaceId(tokenInterfaceId);
            }
        }
    }

    modifier whileIsValidInterface(
        bytes4 tokenInterfaceId,
        address tokenContractAddress
    ) {
        _whileIsValidInterface(tokenInterfaceId, tokenContractAddress);
        _;
    }

    /**
     * @dev : reverts CallerNotSeller error if caller does not have owner role.
     */
    function _whileIsTokenOwner(
        Structs.NFTMarketItem memory _marketplaceItem
    ) private view {
        if (_marketplaceItem.tokenInterfaceId == Snippets.ERC721INTERFACE) {
            if (
                IERC721Factory(_marketplaceItem.tokenContractAddress).ownerOf(_marketplaceItem.tokenId) !=
                Snippets.msgSender()
            ) {
                revert MarketplaceErrors.NotTokenOwner();
            }
        }

        if (_marketplaceItem.tokenInterfaceId == Snippets.ERC1155INTERFACE) {
            if (
                IERC1155Factory(_marketplaceItem.tokenContractAddress).ownerOf(_marketplaceItem.tokenId) !=
                Snippets.msgSender()
            ) {
                revert MarketplaceErrors.NotTokenOwner();
            }
        }
    }

    modifier whileIsTokenOwner(
        Structs.NFTMarketItem memory _marketplaceItem
    ) {
        _whileIsTokenOwner(_marketplaceItem);
        _;
    }

    /**
     * @dev : reverts NotApprovedOrOwner error if the account is a not owner or approved.
     *
     */
    function _whileIsValidMarketItem(
        Structs.NFTMarketItem memory _marketplaceItem
    ) private pure {
        if (_marketplaceItem.tokenId < 1) {
            revert MarketplaceErrors.InvalidMarketItem(_marketplaceItem);
        }
    }

    modifier whileIsValidMarketItem(
        Structs.NFTMarketItem memory _marketplaceItem
    ) {
        _whileIsValidMarketItem(_marketplaceItem);
        _;
    }

    /********************************* Modifiers **********************************/
}

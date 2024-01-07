// SPDX-License-Identifier: MIT
/**
 * Created on 2023-05-05 14:36
 * @summary:
 * @author: dovellous
 */
pragma solidity ^0.8.19;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";

import "./ERCMKTPFactoryWorker.sol";

import "hardhat/console.sol";

abstract contract ERCMKTPFactoryMarketplace is ERCMKTPFactoryWorker {

    function createNFTMarketItem(
        address tokenContractAddress,
        bytes4 tokenInterfaceId,
        uint256 tokenId,
        uint256 price,
        uint256 auctionHours 
    ) external payable nonReentrant returns (bool, bytes4, uint256, uint256) {
        
        if (msg.value < listingFee) {
            revert MarketplaceErrors.ListingPriceTooLow(listingFee, msg.value);
        }

        if (price == 0) {
            revert MarketplaceErrors.ItemListingPriceTooLow();
        }

        if (tokenInterfaceId == Snippets.ERC721INTERFACE) {
            if (
                IERC721Factory(tokenContractAddress).ownerOf(tokenId) !=
                msg.sender
            ) {
                revert MarketplaceErrors.NotTokenOwner();
            }
        }

        if (tokenInterfaceId == Snippets.ERC1155INTERFACE) {
            if (
                IERC1155Factory(tokenContractAddress).getTokenOwner(tokenId) !=
                msg.sender
            ) {
                revert MarketplaceErrors.NotTokenOwner();
            }
        }

        bool ownershipTransfered = changeTokenOwnership(
            tokenInterfaceId,
            tokenContractAddress,
            msg.sender,
            address(this),
            tokenId
        );

        if (ownershipTransfered) {

            _tokenIndexedIDs++;

            uint256 tokenIndexedID = _tokenIndexedIDs;

            address creator;

            bool supportsRoyalties = ERC165Checker.supportsInterface(
                tokenContractAddress,
                Snippets.ERC2981INTERFACE
            );

            if (supportsRoyalties) {
                (creator, ) = IERC2981(tokenContractAddress).royaltyInfo(
                    tokenId,
                    price
                );
            } else {
                creator = msg.sender;
            }

            if (auctionHours > 0) {
                tokenIndexedID2AuctionDetails[tokenIndexedID] = Structs
                    .AuctionDetails(
                        0, //highestBid
                        address(0), //highestBidder
                        (block.timestamp + (auctionHours * 1 hours)) //timeEnding
                    );

                _tokenIndexedAuctionIDs++;
            }

            /*

            struct NFTMarketItem {
                bytes4 tokenInterfaceId;
                bool sold;
                bool isListed;
                bool isAuction;
                bool supportsRoyalties;
                address tokenContractAddress;
                address payable[3] creatorSellerOwner;
                uint256 price;
                uint256 createdAt;
                uint256 updatedAt;
                uint256 tokenId;
                uint256 tokenIndexedID;
            }

            */

            tokenIndexedID2NFTMarketItem[tokenIndexedID] = Structs
                .NFTMarketItem(
                    tokenInterfaceId,
                    false,
                    true,
                    auctionHours > 0,
                    supportsRoyalties,
                    payable(tokenContractAddress),
                    [
                        payable(creator),
                        payable(msg.sender),
                        payable(address(this))
                    ],
                    price,
                    block.timestamp,
                    0,
                    tokenId,
                    tokenIndexedID
                );

            _listedItems++;

            emit NFTMarketItemCreated(tokenIndexedID);

        }

        return (ownershipTransfered, tokenInterfaceId, _tokenIndexedIDs, tokenId);

    }

    function changeTokenOwnership(
        bytes4 tokenInterfaceId,
        address tokenContractAddress,
        address from,
        address to,
        uint256 tokenId
    ) internal returns (bool) {
        bool _ownershipTransfered;

        if (tokenInterfaceId == Snippets.ERC721INTERFACE) {
            if (tokenContractAddress.code.length > 0) {
                IERC721Factory(tokenContractAddress).transferFrom(
                    from,
                    to,
                    tokenId
                );
                _ownershipTransfered = true;
            }
        }

        if (tokenInterfaceId == Snippets.ERC1155INTERFACE) {
            if (tokenContractAddress.code.length > 0) {
                try
                    IERC1155Factory(tokenContractAddress).safeTransferFrom(
                        from,
                        to,
                        tokenId,
                        1,
                        ""
                    )
                {
                    _ownershipTransfered = true;
                } catch {}
            }
        }

        return _ownershipTransfered;
    }

    function listNFTMarketItem(
        uint256 tokenIndexedID,
        uint256 newPrice
    ) external payable nonReentrant {

        Structs.NFTMarketItem
            memory _marketplaceItem = tokenIndexedID2NFTMarketItem[
                tokenIndexedID
            ];

        if (_marketplaceItem.isListed) {
            revert MarketplaceErrors.ItemAlreadyOnSale(
                _marketplaceItem.tokenIndexedID
            );
        }

        if (_marketplaceItem.tokenInterfaceId == Snippets.ERC721INTERFACE) {
            if (
                IERC721Factory(_marketplaceItem.tokenContractAddress).ownerOf(
                    _marketplaceItem.tokenId
                ) != msg.sender
            ) {
                revert MarketplaceErrors.NotTokenOwner();
            }
        }

        if (_marketplaceItem.tokenInterfaceId == Snippets.ERC1155INTERFACE) {
            if (
                IERC1155Factory(_marketplaceItem.tokenContractAddress)
                    .getTokenOwner(_marketplaceItem.tokenId) != msg.sender
            ) {
                revert MarketplaceErrors.NotTokenOwner();
            }
        }

        bool ownershipTransfered = changeTokenOwnership(
            _marketplaceItem.tokenInterfaceId,
            _marketplaceItem.tokenContractAddress,
            msg.sender,
            address(this),
            _marketplaceItem.tokenId
        );

        if (ownershipTransfered) {
            _marketplaceItem.sold = false;
            _marketplaceItem.isListed = true;

            if (newPrice > 0) {
                _marketplaceItem.price = newPrice;
            }

            tokenIndexedID2NFTMarketItem[tokenIndexedID] = _marketplaceItem;

            _listedItems++;

            emit NFTMarketItemListed(tokenIndexedID);
        }
    }

    function delistNFTMarketItem(
        uint256 tokenIndexedID,
        bool removeFromMarketplace
    ) external {
        Structs.NFTMarketItem
            memory _marketplaceItem = tokenIndexedID2NFTMarketItem[tokenIndexedID];

        if (_marketplaceItem.creatorSellerOwner[1] != msg.sender) {
            revert MarketplaceErrors.NotTokenOwner();
        } else {
            bool ownershipTransfered = changeTokenOwnership(
                _marketplaceItem.tokenInterfaceId,
                _marketplaceItem.tokenContractAddress,
                address(this),
                msg.sender,
                _marketplaceItem.tokenId
            );

            if (ownershipTransfered) {
                if (_marketplaceItem.isAuction) {
                    Structs.AuctionDetails
                        memory _auctionDetails = tokenIndexedID2AuctionDetails[
                            tokenIndexedID
                        ];
                    if (_auctionDetails.highestBid > 0) {
                        payable(_auctionDetails.highestBidder).transfer(
                            _auctionDetails.highestBid
                        );
                    }
                }

                _marketplaceItem.sold = false;
                _marketplaceItem.isListed = false;

                tokenIndexedID2NFTMarketItem[tokenIndexedID] = _marketplaceItem;

                if (removeFromMarketplace) {
                    ownershipTransfered = changeTokenOwnership(
                        _marketplaceItem.tokenInterfaceId,
                        _marketplaceItem.tokenContractAddress,
                        address(this),
                        msg.sender,
                        _marketplaceItem.tokenId
                    );

                    if (ownershipTransfered) {
                        delete tokenIndexedID2NFTMarketItem[tokenIndexedID];
                        delete tokenIndexedID2AuctionDetails[tokenIndexedID];
                    }
                }

                _listedItems--;

                emit NFTMarketItemDelisted(tokenIndexedID);
            }
        }
    }

    function createMarketSale(
        uint256 tokenIndexedID
    ) public payable nonReentrant {
        Structs.NFTMarketItem
            memory _marketplaceItem = tokenIndexedID2NFTMarketItem[
                tokenIndexedID
            ];

        if (_marketplaceItem.isAuction) {
            Structs.AuctionDetails
                memory _auctionDetails = tokenIndexedID2AuctionDetails[
                    tokenIndexedID
                ];

            if (_auctionDetails.timeEnding > block.timestamp) {
                revert MarketplaceErrors.ItemAlreadyOnAuction(
                    _marketplaceItem.tokenIndexedID
                );
            }

            if (_auctionDetails.highestBidder != msg.sender) {
                revert MarketplaceErrors.CallerNotHighestBidder();
            }

            if (_auctionDetails.highestBid > msg.value) {
                revert MarketplaceErrors.ItemPriceTooLow(
                    _auctionDetails.highestBid,
                    msg.value
                );
            }
        } else {
            if (_marketplaceItem.price > msg.value) {
                revert MarketplaceErrors.ItemPriceTooLow(
                    _marketplaceItem.price,
                    msg.value
                );
            }
        }

        if (_marketplaceItem.sold) {
            revert MarketplaceErrors.ItemAlreadySold(
                _marketplaceItem.tokenIndexedID
            );
        }

        executeMarketItemSale(_marketplaceItem);
    }

    function executeMarketItemSale(
        Structs.NFTMarketItem memory _marketplaceItem
    ) internal {
        uint256 _priceTag;

        if (_marketplaceItem.isAuction) {
            Structs.AuctionDetails
                memory _auctionDetails = tokenIndexedID2AuctionDetails[
                    _marketplaceItem.tokenIndexedID
                ];

            _priceTag = _auctionDetails.highestBid;
        } else {
            _priceTag = _marketplaceItem.price;
        }

        bool ownershipTransfered = changeTokenOwnership(
            _marketplaceItem.tokenInterfaceId,
            _marketplaceItem.tokenContractAddress,
            address(this),
            msg.sender,
            _marketplaceItem.tokenId
        );

        if (ownershipTransfered) {
            if (
                _marketplaceItem.creatorSellerOwner[0] ==
                _marketplaceItem.creatorSellerOwner[1]
            ) {
                payable(_marketplaceItem.creatorSellerOwner[0]).transfer(
                    _priceTag
                );
            } else {
                if (
                    ERC165Checker.supportsInterface(
                        _marketplaceItem.tokenContractAddress,
                        Snippets.ERC2981INTERFACE
                    ) && _marketplaceItem.supportsRoyalties
                ) {
                    (, uint256 royaltyAmount) = IERC2981(
                        _marketplaceItem.tokenContractAddress
                    ).royaltyInfo(_marketplaceItem.tokenId, _priceTag);

                    if (royaltyAmount > 0) {
                        payable(_marketplaceItem.creatorSellerOwner[0])
                            .transfer(royaltyAmount);

                        payable(_marketplaceItem.creatorSellerOwner[1])
                            .transfer(_priceTag - royaltyAmount);
                    }
                } else {
                    payable(_marketplaceItem.creatorSellerOwner[1]).transfer(
                        _priceTag
                    );
                }
            }

            uint256 changeToRefund = msg.value - _priceTag;

            if (changeToRefund > 0) {
                payable(msg.sender).transfer(changeToRefund);
            }

            _soldItems++;

            _listedItems--;

            _marketplaceItem.creatorSellerOwner[2] = payable(msg.sender);
            _marketplaceItem.sold = true;
            _marketplaceItem.isListed = false;

            tokenIndexedID2NFTMarketItem[
                _marketplaceItem.tokenIndexedID
            ] = _marketplaceItem;

            emit NFTMarketItemSold(
                _marketplaceItem.tokenIndexedID,
                _priceTag,
                msg.sender
            );
        }
    }
}

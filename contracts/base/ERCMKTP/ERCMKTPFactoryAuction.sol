// SPDX-License-Identifier: MIT
/**
 * Created on 2023-05-05 14:36
 * @summary:
 * @author: dovellous
 */
pragma solidity ^0.8.19;
pragma experimental ABIEncoderV2;

import "./ERCMKTPFactoryWorker.sol";
import "./ERCMKTPFactoryMarketplace.sol";

abstract contract ERCMKTPFactoryAuction is ERCMKTPFactoryWorker, ERCMKTPFactoryMarketplace{

    event NFTMarketItemBid( uint256 indexed tokenIndexedID, uint256 amount, address bidder );

    function bidNFTMarketAuctionItem(
        uint256 tokenIndexedID
    ) external payable nonReentrant {

        Structs.NFTMarketItem memory _marketplaceItem = tokenIndexedID2NFTMarketItem[
            tokenIndexedID
        ];

        Structs.AuctionDetails memory _auctionDetails = tokenIndexedID2AuctionDetails[
            tokenIndexedID
        ];

        uint256 highestBid = _auctionDetails.highestBid;

        unchecked{

            require(
                !_marketplaceItem.sold,
                "BID_ERROR_ITEM_ALREADY_SOLD"
            );

            require(
                _marketplaceItem.isAuction,
                "BID_ERROR_IS_NOT_ON_AUCTION"
            );

            require(
                _auctionDetails.timeEnding > block.timestamp,
                "BID_ERROR_AUCTION_ENDED"
            );

            require(
                msg.value > _marketplaceItem.price,
                "BID_ERROR_BELOW_FLOOR_PRICE"
            );

            require(
                msg.value > _marketplaceItem.price + 4,
                "BID_ERROR_BELOW_THRESHOLD"
            );

            console.log("VALIDATE BID_ERROR_BELOW_HIGHEST", msg.value, highestBid);

            require(
                msg.value > highestBid,
                "BID_ERROR_BELOW_HIGHEST"
            );

        }

        if(_auctionDetails.highestBidder != address(0)){

            payable(_auctionDetails.highestBidder).transfer(highestBid);

        }

        _auctionDetails.highestBidder = msg.sender;
        _auctionDetails.highestBid = msg.value;

        tokenIndexedID2AuctionDetails[ tokenIndexedID ] = _auctionDetails;

        emit NFTMarketItemBid(tokenIndexedID, msg.value, msg.sender);

    }

    function sellNFTMarketAuctionItem(
        uint256 tokenIndexedID
    ) external payable nonReentrant {

        Structs.NFTMarketItem memory _marketplaceItem = tokenIndexedID2NFTMarketItem[tokenIndexedID];

        Structs.AuctionDetails memory _auctionDetails = tokenIndexedID2AuctionDetails[tokenIndexedID];

        unchecked{

            require(
                !_marketplaceItem.sold, 
                "IAS"); // Item already sold

            require(
                _marketplaceItem.isAuction, 
                "INA"); // Item not on auction

            require(
                _auctionDetails.timeEnding < block.timestamp,
                "ANE" // Auction not ended
            );

            require(
                msg.sender == _auctionDetails.highestBidder,
                "SNH" // Seller not highest bidder
            );

            require(
                _marketplaceItem.creatorSellerOwner[1] != address(0), 
                "SAI" // Seller address invalid
            );

        }

        executeMarketItemSale(_marketplaceItem);

    }

    function getAuctionItem(uint256 tokenIndexedID) external view returns (Structs.AuctionDetails memory){
        
        Structs.AuctionDetails memory _auctionDetails = tokenIndexedID2AuctionDetails[
            tokenIndexedID
        ];

        return _auctionDetails;

    }

    /* Returns all of user bids */
    function getAuctionItems()
        external
        view
        returns (Structs.NFTFull[]  memory)
    {

        uint totalAuctionItemCount = _tokenIndexedAuctionIDs;

        Structs.NFTFull[]  memory _NFTFull = new Structs.NFTFull[](totalAuctionItemCount);

        uint currentIndex;

        unchecked{

            for (uint i; i < totalAuctionItemCount; ++i) {
                
                uint currentId = i+1;

                _NFTFull[currentIndex] = Structs.NFTFull(
                        tokenIndexedID2NFTMarketItem[currentId], 
                        tokenIndexedID2AuctionDetails[currentId]
                    );
                ++currentIndex;

            }

        }

        return _NFTFull;

    }

    /* Returns all of user bids */
    function fetchUserBids()
        external
        view
        returns (Structs.NFTFull[]  memory)
    {
        
        uint totalItemCount = _tokenIndexedIDs;

        uint totalAuctionItemCount = _tokenIndexedAuctionIDs;

        uint userAuctionItemCount;

        unchecked {

            for (uint i; i < totalAuctionItemCount; ++i) {

                if (tokenIndexedID2AuctionDetails[i+1].highestBidder == msg.sender) {
                    ++userAuctionItemCount;
                }

            }

        }

        Structs.NFTFull[]  memory _NFTFull = new Structs.NFTFull[](userAuctionItemCount);

        uint currentIndex;

        unchecked{

            for (uint i; i < totalItemCount; ++i) {
                
                uint currentId = i+1;

                if (tokenIdToNFTMarketItem[currentId].creatorSellerOwner[2] == msg.sender) {
                    
                    _NFTFull[currentIndex] = Structs.NFTFull(
                        tokenIndexedID2NFTMarketItem[currentId], 
                        tokenIndexedID2AuctionDetails[currentId]
                    );
                    ++currentIndex;
                }

            }

        }

        return _NFTFull;

    }

}

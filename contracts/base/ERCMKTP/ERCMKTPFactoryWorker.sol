// SPDX-License-Identifier: MIT
/**
 * Created on 2023-05-05 14:36
 * @summary:
 * @author: dovellous
 */
pragma solidity ^0.8.19;
pragma experimental ABIEncoderV2;

import "./ERCMKTPFactoryBase.sol";

abstract contract ERCMKTPFactoryWorker is ERCMKTPFactoryBase {

    /**
     * @dev Retrieves a list of all available tokens.
     * @return Structs.NFTMarketItem[] memory marketplaceItems : an array of NFTMarketItems.
     *
     */
    function _marketplaceItems() internal view returns (Structs.NFTMarketItem[] memory) {

        // Lets use current id `_tokenIndexedIDs.current` 
        // as opposed to the maximum supply `tokenMaximumSupply`
        // When tokens are burnt the maximum supply will decrease
        // Hence using maximum supply as the maximum length of 
        // array checked will lead to underflow, and we will 
        // not be dealing with the actual tokenId on the indices.
        // So we are better off with current token id which is ever incrementally changing.

        Structs.NFTMarketItem[] memory marketplaceItems;

        // Unchecked : @see https://github.com/dovellous/com-enftis/blob/master/gas-saving-tips/unchecked-code-block.md
        unchecked {

            uint256 numberOfCreatedNFTMarketItems = _tokenIndexedIDs;

            // Specify the array size to save gas
            // Fixed Arrays : @see https://github.com/dovellous/com-enftis/blob/master/gas-saving-tips/fixed-arrays.md
            uint256 numberOfActiveNFTMarketItem;

            for (uint256 i; i < numberOfCreatedNFTMarketItems; ++i) {
                // Check if the token exists by checking its id
                // Remember some tokens might have been burnt
                // If the token with this id exists, increment
                // Thge number of expected tokens for array's use
                ++numberOfActiveNFTMarketItem;
            }

            // Create a fixed array set with the actual number of tokens computed above
            marketplaceItems = new Structs.NFTMarketItem[](numberOfActiveNFTMarketItem);

            // Save gas, free up memory; @see below
            delete numberOfActiveNFTMarketItem;

            // Set the current index to zero, increament only if the token is valid
            // Use that index to push the token with the current id to the array
            uint256 currentIndex;

            for (uint256 i; i < numberOfCreatedNFTMarketItems; ++i) {
                // Oncemore, check if the token with the current id exists
                if (true) {
                    //If it exists, push the current token to the array
                    Structs.NFTMarketItem memory marketplaceItem = tokenIndexedID2NFTMarketItem[(i + 1)];

                    marketplaceItems[currentIndex] = marketplaceItem;

                    // Increment the current index for the next valid token
                    // In principle, the max currentIndex mube be equal to (numberOfCreatedNFTMarketItems-1)
                    ++currentIndex;
                }
            }

            // Save gas, free up memory; @see below
            // @see https://github.com/dovellous/com-enftis/blob/master/gas-saving-tips/reset-variables.mddelete currentIndex;
            delete numberOfCreatedNFTMarketItems;
        }

        // Return tokens array
        return marketplaceItems;
    }

    /**
     * @dev Search NFTMarketItems using a set of key value pair
     * @param _itemKey The NFT key to validate the query against.
     * @param _data The data holds the encoded params to use in the query
     * @return Structs.NFTMarketItem[] An array of NFTMarketItems returned from the search query.
     *
     */
    function _search(
        bytes32 _itemKey,
        bytes memory _data
    ) internal view returns (Structs.NFTMarketItem[] memory) {
        // Get the current token id for minted tokens
        // Its safer to use this id as opposed to the maximum supply
        // Because some tokens might have been burned
        // We would rather iterate over, up to the maximum minted tokens
        // Then ignore those that would have been burned by cheking _exists()
        uint256 numberOfCreatedNFTMarketItems = _tokenIndexedIDs;

        // Declare the number of tokens to return in an array
        // We are going to use a fixed array, so we will compute the
        // Number of tokens that we would want to return.
        uint256 numberOfResultsTokens;

        // Declare the variable to hold the results NFT tokens.
        Structs.NFTMarketItem[] memory marketplaceItems;
       
        // Unchecked : @see https://github.com/dovellous/com-enftis/blob/master/gas-saving-tips/unchecked-code-block.md
        unchecked {
            // For each index+1 check if the token exists, ignore those that are invalid !exist().
            for (uint256 i; i < numberOfCreatedNFTMarketItems; ++i) {
                
                //Get the current token from the index+1
                Structs.NFTMarketItem memory _marketplaceItem = tokenIndexedID2NFTMarketItem[(i + 1)];

                // If token id is zero, then it's a invalid token
                if(_marketplaceItem.tokenId == 0){
                    continue;
                }

                // Get the nft token item and the check if there is a match
                bool _match = Snippets.searchNFTMarketItemHasMatch(
                    _itemKey,
                    _data,
                    _marketplaceItem
                );


                // If there is a match increment the 
                // number of result tokens - numberOfResultsTokens.
                if (_match) {
                    ++numberOfResultsTokens;
                }
            }

            // Since we now know the exact number of tokens to return, declare the array variable.
            marketplaceItems = new Structs.NFTMarketItem[](numberOfResultsTokens);

            // Let's make sure that the number of tokens expected is greater than zero.
            if (numberOfResultsTokens > 0) {
                // Declare the current index to assist when pushing an marketplaceItem to the results array.
                uint256 currentIndex;

                // Iterate the number of minted tokens
                // This time we want to check if there is match when a
                // Search is performed against a token attribute.
                for (uint256 i; i < numberOfCreatedNFTMarketItems; ++i) {

                    //Get the current token from the index+1
                    Structs.NFTMarketItem memory _marketplaceItem = tokenIndexedID2NFTMarketItem[(i + 1)];

                    // If token id is zero, then it's a invalid token
                    if(_marketplaceItem.tokenId == 0){
                        continue;
                    }

                    // Get the nft token item and the check if there is a match
                    bool _match = Snippets.searchNFTMarketItemHasMatch(
                        _itemKey,
                        _data,
                        _marketplaceItem
                    );
                    
                    // If we found a match, then add the item to the array,
                    // Only increment the currentIndex when there is a match.
                    if (_match) {
                        // Push the NFT token to query

                        marketplaceItems[currentIndex] = _marketplaceItem;

                        ++currentIndex;
                    }

                    // Save gas, free up memory; @see below
                    delete _marketplaceItem;
                    delete _match;
                }

                // Save gas, free up memory; @see below
                delete currentIndex;
            }
        }
        // Save gas, free up memory; @see below
        // @see https://github.com/dovellous/com-enftis/blob/master/gas-saving-tips/reset-variables.md
        delete numberOfCreatedNFTMarketItems;
        delete numberOfResultsTokens;

        // Return an array of NFT items.
        return marketplaceItems;
        
    }

}

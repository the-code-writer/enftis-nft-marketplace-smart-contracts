// SPDX-License-Identifier: MIT
/**
 * Created on 2023-05-05 14:36
 * @summary:
 * @author: dovellous
 */
pragma solidity ^0.8.19;
pragma experimental ABIEncoderV2;

import "../../libs/Structs.sol";

interface IERCLogging {

    function getERCTokenLogging(address _contract, uint256 _tokenId) external returns(Structs.TokenActivityItem[] memory);

    function setERCTokenLogging(address _contract, uint256 _tokenId, Structs.TokenActivityItem memory _activity) external;

    function logTokenActivity( address _contract, address _from, address _to, uint256 _tokenId, Enums.TokenActivityType _type, uint256 _timestamp) external;

    function getERCMarketplaceLogging(address _contract, uint256 _tokenId) external returns (Structs.NFTMarketItemActivity[] memory);

    function setERCMarketplaceLogging(address _contract, uint256 _tokenId, Structs.NFTMarketItemActivity memory _activity) external;

    function logMarketplaceActivity( address _contract, address _from, address _to, uint256 _tokenId, Enums.NFTMarketItemActivityType _type, uint256 _timestamp) external;

}


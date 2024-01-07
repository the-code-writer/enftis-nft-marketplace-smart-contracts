// SPDX-License-Identifier: MIT

/*

███████╗███╗   ██╗███████╗████████╗██╗███████╗
██╔════╝████╗  ██║██╔════╝╚══██╔══╝██║██╔════╝
█████╗  ██╔██╗ ██║█████╗     ██║   ██║███████╗
██╔══╝  ██║╚██╗██║██╔══╝     ██║   ██║╚════██║
███████╗██║ ╚████║██║        ██║   ██║███████║
╚══════╝╚═╝  ╚═══╝╚═╝        ╚═╝   ╚═╝╚══════╝


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

░░░█▀▄░▄▀▄░█▒█▒██▀░█▒░░█▒░░▄▀▄░█▒█░▄▀▀
▒░▒█▄▀░▀▄▀░▀▄▀░█▄▄▒█▄▄▒█▄▄░▀▄▀░▀▄█▒▄██

*/

/**
 * Created on 2023-05-05 14:36
 * @summary:
 * @author: dovellous
 * @repository: https://github.com/dovellous/com-enftis
 * @website: https://enftis.com
 *
 */

pragma solidity ^0.8.19;
pragma experimental ABIEncoderV2;

import "../../libs/Structs.sol";
import "./IERCLogging.sol";

abstract contract ERCLogging is IERCLogging {

    /// @dev Token Id to Token Activity mapping
    mapping(address => mapping(uint256 => Structs.TokenActivityItem[])) public tokenIdToTokenActivityItem;

    /// @dev Token Id to Marketplace Activity mapping
    mapping(address => mapping(uint256 => Structs.NFTMarketItemActivity[])) public tokenIdToNFTMarketItemActivity;

    constructor(){}

    function getERCTokenLogging(address _contract, uint256 _tokenId) external view returns(Structs.TokenActivityItem[] memory) {

        Structs.TokenActivityItem[] memory _activities = tokenIdToTokenActivityItem[_contract][_tokenId];

        return _activities;

    }

    function setERCTokenLogging(address _contract, uint256 _tokenId, Structs.TokenActivityItem memory _activity) public {

        tokenIdToTokenActivityItem[_contract][_tokenId].push(_activity);

    }

    /**
     * @dev :
     */
    function logTokenActivity(
        address _contract,
        address _from,
        address _to,
        uint256 _tokenId,
        Enums.TokenActivityType _type,
        uint256 _timestamp
    ) external {

        require(msg.sender == _contract, "ERCLogging : logTokenActivity : Invalid caller");

        Structs.TokenActivityItem memory _activity = Structs.TokenActivityItem(
            _type,
            _from,
            _to,
            _timestamp
        );

        setERCTokenLogging(_contract, _tokenId, _activity);

    }

    function getERCMarketplaceLogging(address _contract, uint256 _tokenId) external view returns( Structs.NFTMarketItemActivity[] memory) {

        Structs.NFTMarketItemActivity[] memory _activities = tokenIdToNFTMarketItemActivity[_contract][_tokenId];

        return _activities;

    }

    function setERCMarketplaceLogging(address _contract, uint256 _tokenId, Structs.NFTMarketItemActivity memory _activity) public {

        tokenIdToNFTMarketItemActivity[_contract][_tokenId].push(_activity);

    }

    /**
     * @dev :
     */
    function logMarketplaceActivity(
        address _contract,
        address _from,
        address _to,
        uint256 _tokenId,
        Enums.NFTMarketItemActivityType _type,
        uint256 _timestamp
    ) external {

        require(msg.sender == _contract, "ERCLogging : logMarketplaceActivity : Invalid caller");

        Structs.NFTMarketItemActivity memory _activity = Structs.NFTMarketItemActivity(
            _type,
            _from,
            _to,
            _timestamp
        );

        setERCMarketplaceLogging(_contract, _tokenId, _activity);

    }

}

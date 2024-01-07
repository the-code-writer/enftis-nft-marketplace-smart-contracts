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

import "./base/ERC721/ERC721FactoryGetSet.sol";

contract ERC721Factory is ERC721FactoryGetSet {
    constructor(
        string memory _name,
        string memory _symbol,
        bytes  memory _data
    ) payable ERC721FactoryGetSet(
        _name,
        _symbol,
        _data
    ) {}
}

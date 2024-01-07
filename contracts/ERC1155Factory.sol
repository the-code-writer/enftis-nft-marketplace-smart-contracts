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
tokenTypes  :   ERC1155, ERC165, ERC2968
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

import "./base/ERC1155/ERC1155FactoryGetSet.sol";

contract ERC1155Factory is ERC1155FactoryGetSet {
    constructor(
        string memory _url,
        bytes  memory _data
    ) payable ERC1155FactoryGetSet(
        _url,
        _data
    ) {}
}

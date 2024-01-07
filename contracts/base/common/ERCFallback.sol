// SPDX-License-Identifier: MIT
/**
 * Created on 2023-05-05 14:36
 * @summary:
 * @author: dovellous
 */
pragma solidity ^0.8.19;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../../libs/Snippets.sol";

abstract contract ERCFallback is AccessControl, ReentrancyGuard {

    using Snippets for *;

    // Account treasury to hold ETH
    address payable public contractTreasury =
        payable(0x0BcEBD6Ce292721408eA6a40c9F1FA04C8bEFA9A);

    /**
     * @dev Updates the contract treasury account
     * @param _newContractTreasury Address of the new treasury.
     *
     * Requirements:
     * - Must not be a zero address
     */
    function updateContractTreasury(
        address _newContractTreasury
    )
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        if(_newContractTreasury != address(0)){
            contractTreasury = payable(_newContractTreasury);
        } 
    }

    /**
     * @dev Remember that only owner can call so be careful when use on contracts generated from other contracts.
     * @param _token The token contract address
     * @param _account Number of tokens to be sent
     * @param _standard Number of tokens to be sent
     * @param _amount Number of tokens to be sent
     * @param _tokenId Number of tokens to be sent
     */
    function recoverTokens(
        address _token,
        address _account,
        Enums.TokenStandards _standard,
        uint256 _amount,
        uint256 _tokenId
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        address payable _receiver;

        if (_account != address(0)) {
            _receiver = payable(_account);
        } else {
            _receiver = payable(_msgSender());
        }

        if (_standard == Enums.TokenStandards.ERC20) {
            IERC20(_token).transfer(_receiver, _amount);
        }

        if (_standard == Enums.TokenStandards.ERC721) {
            IERC721(_token).safeTransferFrom(
                address(this),
                _receiver,
                _tokenId
            );
        }

        if (_standard == Enums.TokenStandards.ERC1155) {
            IERC1155(_token).safeTransferFrom(
                address(this),
                _receiver,
                _tokenId,
                _amount,
                "0x0"
            );
        }
    }

    /**
     * @dev :
     */
    function getBalance()
        internal
        view
        onlyRole(DEFAULT_ADMIN_ROLE)
        returns (uint256)
    {
        return address(this).balance;
    }

    /**
     * @dev :
     */
    function withdraw(
        address to,
        uint256 value
    ) external payable onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant {
        require(getBalance() >= value, "INSUFFICIENT_BALANCE");
        if(to == address(0)){
            payable(_msgSender()).transfer(getBalance());
        }else{
            (bool sent, ) = to.call{value: value}("");
            require(sent, "FAILED_TO_WITHDRAW");
        }
    }

    function transferToFallback(address payable _to) public payable {
        _to.transfer(msg.value);
    }

    function callFallback(address payable _to) public payable {
        (bool sent, ) = _to.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }
}

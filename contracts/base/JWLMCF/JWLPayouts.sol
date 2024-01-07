// SPDX-License-Identifier: MIT LICENSE


/*
Follow/Subscribe Youtube, Github, IM, Tiktok
for more amazing content!!
@Net2Dev
███╗░░██╗███████╗████████╗██████╗░██████╗░███████╗██╗░░░██╗
████╗░██║██╔════╝╚══██╔══╝╚════██╗██╔══██╗██╔════╝██║░░░██║
██╔██╗██║█████╗░░░░░██║░░░░░███╔═╝██║░░██║█████╗░░╚██╗░██╔╝
██║╚████║██╔══╝░░░░░██║░░░██╔══╝░░██║░░██║██╔══╝░░░╚████╔╝░
██║░╚███║███████╗░░░██║░░░███████╗██████╔╝███████╗░░╚██╔╝░░
╚═╝░░╚══╝╚══════╝░░░╚═╝░░░╚══════╝╚═════╝░╚══════╝░░░╚═╝░░░
THIS CONTRACT IS AVAILABLE FOR EDUCATIONAL 
PURPOSES ONLY. YOU ARE SOLELY REPONSIBLE 
FOR ITS USE. I AM NOT RESPONSIBLE FOR ANY
OTHER USE. THIS IS TRAINING/EDUCATIONAL
MATERIAL. ONLY USE IT IF YOU AGREE TO THE
TERMS SPECIFIED ABOVE.
*/
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./JWLRewards.sol";

pragma solidity ^0.8.7;

contract JWLPayouts is Ownable, AccessControl {

  using SafeERC20 for *;

  JWLRewards public jwlr;

  bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

  constructor(JWLRewards _jwlr) Ownable(_msgSender()) {
        jwlr = _jwlr;
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _grantRole(MANAGER_ROLE, _msgSender());
      }

  function safeN2drTransfer(address _to, uint256 _amount) external {
    require(hasRole(MANAGER_ROLE, _msgSender()), "Not allowed");
    uint256 jwlrBal = jwlr.balanceOf(address(this));
    if (_amount > jwlrBal){
      jwlr.transfer(_to, jwlrBal);
    }
    else {
      jwlr.transfer(_to, _amount);
    }
  }
}
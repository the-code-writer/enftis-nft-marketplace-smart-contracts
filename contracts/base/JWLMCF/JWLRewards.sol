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
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";


pragma solidity ^0.8.7;

contract JWLRewards is ERC20, ERC20Burnable, Ownable, AccessControl {

  using Math for uint256;
  using SafeERC20 for *;

  mapping(address => uint256) private _balances;

  uint256 private _totalSupply;

  bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

  constructor() ERC20("JWL Rewards", "JWLR") Ownable(_msgSender()) {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _grantRole(MANAGER_ROLE, _msgSender());
      }

  function mint(address to, uint256 amount) external {
    require(hasRole(MANAGER_ROLE, _msgSender()), "Not allowed");
    _totalSupply = _totalSupply + amount;
    _balances[to] = _balances[to] + amount;
    _mint(to, amount);
  }

  function safeN2drTransfer(address _to, uint256 _amount) external {
    require(hasRole(MANAGER_ROLE, _msgSender()), "Not allowed");
    uint256 jwlrBal = balanceOf(address(this));
    if (_amount > jwlrBal){
      transfer(_to, jwlrBal);
    }
    else {
      transfer(_to, _amount);
    }
  }
  
}
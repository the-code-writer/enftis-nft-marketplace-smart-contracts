// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20FlashMint.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/manager/AccessManaged.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "../common/ERCModifiers.sol";

import "hardhat/console.sol";

contract JWLXTKNFactoryBase is
    ERC20,
    ERC20Capped,
    ERC20Burnable,
    ERC20Pausable,
    AccessControl,
    ERC20Permit,
    ERC20Votes,
    ERC20FlashMint,
    ERCModifiers
{

    using Math for uint256;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    bytes32 public constant EXECUTOR_ROLE = keccak256("EXECUTOR_ROLE");

    string public contractURI;

    uint256 public tokenMaximumSupply;

    uint256 public tokenTotalSupply;

    mapping(address => uint256) private _balances;

    event Received(address, uint);

    event Log(string func, uint gas);
    
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply,
        uint256 _maximumSupply,
        address initialAuthority
    )
        ERC20(_name, _symbol)
        ERC20Capped(_maximumSupply)
        ERC20Permit(_name)
    {

        if(initialAuthority == address(0)){
            initialAuthority = _msgSender();
        }

        console.log(_initialSupply);
        console.log(_maximumSupply);
        
        _mint(initialAuthority, _initialSupply);
        
        tokenTotalSupply = _initialSupply;

        tokenMaximumSupply = _maximumSupply;

        AccessManaged(initialAuthority);
        _grantRole(DEFAULT_ADMIN_ROLE, initialAuthority);
        _grantRole(PAUSER_ROLE, initialAuthority);
        _grantRole(MINTER_ROLE, initialAuthority);
        _grantRole(MANAGER_ROLE, initialAuthority);
        
    }

    function assignRole(bytes32 role, address account) public onlyRole(EXECUTOR_ROLE) {
        _grantRole(role, account);
        _revokeRole(EXECUTOR_ROLE, _msgSender());
    }

    function executeFunction(string memory functionName, string memory param1, string memory param2) public onlyRole(EXECUTOR_ROLE) {
        //bytes memory payload = abi.encodeWithSignature(functionName, param1, param2);
        //address(this).functionCall(payload);
        _revokeRole(MANAGER_ROLE, _msgSender());
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function grantMinterRole(address account) external onlyRole(MINTER_ROLE) {
        _grantRole(MINTER_ROLE, account);
    }

    function grantManagerRole(address account) external onlyRole(MANAGER_ROLE) {
        _grantRole(MANAGER_ROLE, account);
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {

        require(hasRole(MINTER_ROLE, _msgSender()), "Not allowed");

        (bool isValidTokenSupply, uint256 newTokenSupply) = Math.tryAdd(tokenTotalSupply, amount);

        require(amount > 0, "INVALID_AMOUNT");

        require(isValidTokenSupply, "TOKEN_SUPPLY_OVERFLOW");

        tokenTotalSupply = newTokenSupply;
                
        _mint(to, amount);

        (,uint256 nextBalances) = Math.tryAdd(_balances[to], amount);

        _balances[to] = nextBalances;

    }

    // The following functions are overrides required by Solidity.

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable, ERC20Votes, ERC20Capped)
    {
        super._update(from, to, value);
    }

    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }

  function safeJWLXTransfer(address _to, uint256 _amount) external {
    require(hasRole(MANAGER_ROLE, _msgSender()), "Not allowed");
    uint256 _balance = balanceOf(address(this));
    console.log(_msgSender());
    console.log(balanceOf(_msgSender()));
    console.log(_balance);
    console.log(address(this));
    console.log(_to);
    console.log(_amount);
    console.log(_amount > _balance);
    if (_amount > _balance){
      transfer(_to, _balance);
    }
    else {
      transfer(_to, _amount);
    }
  }
  
}
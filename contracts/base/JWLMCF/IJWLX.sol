// SPDX-License-Identifier: MIT LICENSE

pragma solidity ^0.8.7;

interface IJWLX {

    function mint(address _to, uint256 _amount) external;

    function balanceOf(address _account) external returns (uint256);

    function safeJWLXTransfer(address _to, uint256 _amount) external returns (uint256);

    function safeTransfer(address _to, uint256 _amount) external returns (uint256);

    function safeTransferFrom(address _from, address _to, uint256 _amount) external returns (uint256);

    function transferFrom(address _from, address _to, uint256 _amount) external returns (uint256);

}

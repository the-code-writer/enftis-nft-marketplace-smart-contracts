// SPDX-License-Identifier: MIT
/**
 * Created on 2023-05-05 14:35
 * @summary:
 * @author: dovellous
 */
pragma solidity ^0.8.20;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/governance/TimelockController.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract JWLTimeLock is TimelockController, Ownable {
    constructor (
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors,
        address admin
    )
        TimelockController
    (
        minDelay,
        proposers,
        executors,
        admin
    )
    Ownable(_msgSender())
    {
        //
    }

    function getTimeLockAdminRole() public pure returns ( bytes32 ) {
        return DEFAULT_ADMIN_ROLE;
    }

}
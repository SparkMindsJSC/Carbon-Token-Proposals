// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

contract Migrations {
    address owner = msg.sender;
    uint public last_completed_migration;

    modifier restricted() {
        require(
            msg.sender == owner, "This function is restricted to the contract's owner"
        );
        _;
    }

    function setCompleted(uint completed) public restricted {
        last_completed_migration = completed;
    }
}
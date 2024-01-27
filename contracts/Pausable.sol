// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// import "@openzeppelin/contracts/access/Ownable.sol";
import "./Owner.sol";

abstract contract Pausable is Owner {
    bool public paused;
    uint public lastPauseTime;

    // Event
    event PauseChange(bool paused);

    constructor() {
        require(owner != address(0), "Owner must be set.");
    }

    modifier notPaused() {
        require(!paused, "This action cannot be perfomed while contract is paused");
        _;
    }

    function setPaused(bool _paused) external onlyOwner {
        if (paused == _paused) {
            return;
        }
        paused = _paused;
        
        if (paused) {
            lastPauseTime = block.timestamp;
        }
        emit PauseChange(paused);
    }
    
}

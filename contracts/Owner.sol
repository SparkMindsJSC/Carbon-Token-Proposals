// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;


abstract contract Owner {

    address public owner;

    // event 
    event OwnerSet(address indexed oldOwner, address indexed newOwner);

    modifier onlyOwner {
        _onlyOwner(); 
        _;
    }
   
    constructor(address _owner)   {
        require(_owner != address(0), "Owner address cannot be 0");
        owner = _owner; 
        emit OwnerSet(address(0), owner);
    }

    function _onlyOwner() private view {
        require(msg.sender == owner, "Owner contract can peform this action");
    }

    function changeOwner(address newOwner) external  onlyOwner {
        owner = newOwner;
        emit OwnerSet(owner, newOwner);
    }


    function getOwner() external view returns (address) {
        return owner;
    }
} s
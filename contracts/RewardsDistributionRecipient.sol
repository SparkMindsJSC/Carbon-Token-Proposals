// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;
import "./Owner.sol";

abstract contract RewardsDistributionRecipient is Owner {
    address public rewardsDistribution;

    modifier onlyRewardsDistribution() {
        require(msg.sender == rewardsDistribution, "Caller is not rewardsDistribution contract");
        _;
    }

    function notifyRewardAmount(uint256 _reward) external virtual  ;

    function setRewardDistribution(address _rewardsDistribution) external onlyOwner {
        rewardsDistribution = _rewardsDistribution;
    }
}

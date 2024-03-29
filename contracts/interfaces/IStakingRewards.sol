// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IStakingRewards {
    
    function balanceOf(address account) external view returns (uint256);
    function earned(address account) external view returns (uint256);
    function getRewardForDuration() external view returns (uint256);
    function lastTimeRewardApplicable() external view returns (uint256);
    function rewardPerToken() external view returns (uint256);
    function getRewardsDistribution() external view returns (address); 
    function getRewardsToken() external view returns (address);
    function totalSupply() external view returns (uint256);

    function exit() external; 
    function getReward() external;
    function stake(uint256 amount) external;
    function withdraw(uint256 amount) external;
}
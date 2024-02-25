// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "./interfaces/IStakingRewards.sol";
import "./RewardsDistributionRecipient.sol";
import "./Pausable.sol";

contract Staking  is IStakingRewards, RewardsDistributionRecipient, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    IERC20 public immutable rewardsToken;
    IERC20 public immutable stakingToken;
    
    uint256 public periodFinish = 0;
    uint256 public rewardRate = 0;
    uint256 public rewardsDuration = 7 days;
    uint256 public rewardPerTokenStored;
    uint256 public lastTimeUpdate;
    uint256 private _totalSupply;

    // Mapping
    mapping(address => uint256) private _balances;
    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;


    // Event 
    event RewardAdded(uint256 reward);
    event Staked(address indexed userStaked, uint256 amountStaked);
    event Withdraw(address indexed userWithdraw, uint256 amountWithdraw);
    event RewardPaid(address indexed userRewardPaid, uint256 reward);
    event RewardsDurationUpdate(uint256 newDuration);
    event Recovered(address token, uint256 amount);

    constructor(
        address _owner,
        address _rewardsDistribution,    
        address _stakingToken,
        address _rewardToken
    )  Owner(_owner) {
        rewardsToken = IERC20(_rewardToken);
        stakingToken = IERC20(_stakingToken);
        rewardsDistribution = _rewardsDistribution;
    }

    // Modifier 
    modifier updateReward(address _account) {
        rewardPerTokenStored = rewardPerToken();
        lastTimeUpdate = lastTimeRewardApplicable();

        if (_account != address(0)) {
            rewards[_account] = earned(_account);
            userRewardPerTokenPaid[_account] = rewardPerTokenStored;
        }
        _;
    }

    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    function getRewardsDistribution() external view returns (address) {
        return rewardsDistribution;
    }

    function getRewardsToken() external view returns (address) {
        return address(rewardsToken);
    }

    function balanceOf(address _account) external view returns (uint256) {
        return _balances[_account];
    } 

    function lastTimeRewardApplicable() public view returns (uint256) {
        return block.timestamp < periodFinish ? block.timestamp : periodFinish;
    }

    function rewardPerToken() public view returns (uint256) {
        if (_totalSupply == 0) {
            return rewardPerTokenStored;
        }

        return (rewardPerTokenStored + ((lastTimeRewardApplicable() - lastTimeUpdate) * rewardRate * 1e18) / _totalSupply);

    }

    function earned(address _account) public view returns (uint256) {
        return ((_balances[_account] * (rewardPerToken() - userRewardPerTokenPaid[_account])) / 1e18) + rewards[_account];

    }

    function getRewardForDuration() external view returns (uint256) {
        return rewardRate * rewardsDuration;
    }
    
    
    function stake(uint256 _amount) external nonReentrant updateReward(msg.sender) {
       require(_amount > 0, "Cannot stake 0");
        _totalSupply = _totalSupply + _amount;

        _balances[msg.sender] = _balances[msg.sender] + _amount;

       stakingToken.safeTransferFrom(msg.sender, address(this), _amount);
       emit Staked(msg.sender, _amount);
    }

    function withdraw(uint256 _amount) public nonReentrant updateReward(msg.sender) {
        require(_amount > 0, "Cannot withdraw 0.");
        _totalSupply = _totalSupply - _amount;

        _balances[msg.sender] = _balances[msg.sender] - (_amount);

        stakingToken.safeTransfer(msg.sender, _amount);
        emit Withdraw(msg.sender, _amount);
    }

    function getReward() public nonReentrant updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            rewardsToken.safeTransfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
    }

    function exit() external {
        withdraw(_balances[msg.sender]);
        getReward();
    }

    function notifyRewardAmount(uint256 _reward) 
             external override  onlyRewardsDistribution updateReward(address(0)) {
        if (block.timestamp >= periodFinish) {
            rewardRate = _reward / (rewardsDuration);

        } else {
            uint256 remaining = periodFinish - (block.timestamp);

            uint256 leftover = remaining * (rewardRate);
            rewardRate = (_reward + leftover)/(rewardsDuration);

        }

        uint balance = rewardsToken.balanceOf(address(this));
        require(rewardRate <= balance/(rewardsDuration), "Provided reward too high");

        lastTimeUpdate = block.timestamp;
        periodFinish = block.timestamp + (rewardsDuration);

        emit RewardAdded(_reward);
    }

    function recoverERC20(address _tokenAddress, uint256 _tokenAmount) external onlyOwner {
        require(_tokenAddress != address(stakingToken), "Cannot withdraw the staking token");
        IERC20(_tokenAddress).safeTransfer(owner, _tokenAmount);
        emit Recovered(_tokenAddress, _tokenAmount);
    }

    function setRewardsDuration(uint256 _rewardDuration) external onlyOwner {
        require(block.timestamp >=  periodFinish, 
                "Previous reward period must be complete before change duration");
        rewardsDuration = _rewardDuration;
        emit RewardsDurationUpdate(rewardsDuration);
    }

}

import { Signer } from "ethers";
import { ethers } from "hardhat";
import { describe, it } from "mocha";
import { Staking, Token } from "../typechain-types";
import { expect } from "chai";

describe("Test smart contract staking", function () {
  let ownerStakingToken: Signer;
  let ownerRewardToken: Signer;
  let ownerStaking: Signer;
  let rewardDistribution: Signer;
  let holder: Signer;
  let receipent: string;
  let tokenContract_staking: Token;
  let tokenContractReward: Token;
  let stakingContract: Staking;
  const initAmountToken = "3000000000000000000000";

  this.beforeEach(async function () {
    [
      ownerStakingToken,
      ownerRewardToken,
      ownerStaking,
      holder,
      rewardDistribution,
    ] = await ethers.getSigners();

    const accounts = await ethers.getSigners();
    receipent = await accounts[9].getAddress();

    tokenContract_staking = await ethers.deployContract("Token", [
      ownerStakingToken.getAddress(),
      initAmountToken,
      "0",
      receipent,
    ]);
    await tokenContract_staking.waitForDeployment();

    tokenContractReward = await ethers.deployContract("Token", [
      ownerRewardToken.getAddress(),
      initAmountToken,
      "0",
      receipent,
    ]);
    await tokenContractReward.waitForDeployment();

    stakingContract = await ethers.deployContract("Staking", [
      ownerStaking.getAddress(),
      rewardDistribution.getAddress(),
      tokenContract_staking.target,
      tokenContractReward,
    ]);

    await stakingContract.waitForDeployment();

    await stakingContract.connect(ownerStaking).setRewardsDuration(1000);

    await tokenContractReward
      .connect(ownerRewardToken)
      .transfer(stakingContract.target, "3000000000000000000000");

    await stakingContract
      .connect(rewardDistribution)
      .notifyRewardAmount("1000000000000000000000");

    await tokenContract_staking
      .connect(ownerStakingToken)
      .transfer(holder.getAddress(), "2000000000000000000000");

    await tokenContract_staking
      .connect(holder)
      .approve(stakingContract.target, "2000000000000000000000");
  });

  it("Should stake and withdraw", async function () {
    await stakeToken(holder, stakingContract);

    const amountStaking = await stakingContract.balanceOf(holder.getAddress());
    expect(amountStaking).to.equal("1000000000000000000000");

    await stakingContract.connect(holder).withdraw("500000000000000000000");
    const amountWithdrawn = await stakingContract.balanceOf(
      holder.getAddress()
    );
    expect(amountWithdrawn).to.equal("500000000000000000000");
  });

  it("Should exit with reward", async function () {
    await stakeToken(holder, stakingContract);

    await ethers.provider.send("evm_increaseTime", [1000]);
    await ethers.provider.send("evm_mine");

    await stakingContract.connect(holder).exit();
    const stakeBalance = await stakingContract.balanceOf(holder.getAddress());

    expect(stakeBalance).to.equal(0);

    const rewardBalance = await tokenContractReward.balanceOf(
      holder.getAddress()
    );

    expect(BigInt(rewardBalance)).to.be.gt(BigInt(0));
  });

  it("Should reward distribution", async function () {
    await stakeToken(holder, stakingContract);
    await ethers.provider.send("evm_increaseTime", [1000]);
    await ethers.provider.send("evm_mine");

    const rewardBalanceBefore = await tokenContractReward.balanceOf(
      holder.getAddress()
    );

    await stakingContract.connect(holder).getReward();
    const rewardBalanceAfter = await tokenContractReward.balanceOf(
      holder.getAddress()
    );
    expect(rewardBalanceAfter).to.be.gt(rewardBalanceBefore);
  });
});

async function stakeToken(holder: Signer, stakingContract: Staking) {
  await stakingContract.connect(holder).stake("1000000000000000000000");
}

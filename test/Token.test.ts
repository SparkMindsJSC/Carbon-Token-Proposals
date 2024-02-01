import { expect } from "chai";
import { Token } from "../typechain-types";
import * as hre from "hardhat";

describe("Token contract", function () {
  let huskyToken: Token;
  let owner: any;

  before(async function () {
    [owner] = await hre.ethers.getSigners();
    console.log("Owner address: ", owner.address);

    huskyToken = await hre.ethers.deployContract("Token", [owner.address]);
    await huskyToken.waitForDeployment();

    console.log("Token deployed successfully to: ", huskyToken.target);
    return huskyToken;
  });

  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const ownerBalance = await huskyToken.balanceOf(owner.address);
    expect(await huskyToken.totalSupply()).to.equal(ownerBalance);
  });

  it("Should have correct name and symbol", async function () {
    const name = await huskyToken.name();
    const symbol = await huskyToken.symbol();

    expect(name).to.equal("Husky Token");
    expect(symbol).to.equal("HKT");
  });
});

import { expect } from "chai";
import { Address, EvidenceStorage, Token } from "../typechain-types";
import * as hre from "hardhat";
import { Signer } from "ethers";
import { hashEvidence, signEvidence } from "../utils/HashCrypto";

const privateKeySubmitter = process.env.PRIVATE_KEY_SUBMITTER || "";

describe("Token & Evidence smart contract", function () {
  let CTPToken: Token;
  let account0Address: string;
  let account1Address: string;
  let account9Address: string;
  let EvidenceStorageContract: EvidenceStorage;
  let owner: Signer;
  let submitter: Signer;

  before(async function () {
    const accounts = await hre.ethers.getSigners();
    owner = accounts[0];
    submitter = accounts[2];
    account0Address = await owner.getAddress();
    account1Address = await accounts[1].getAddress();
    account9Address = await accounts[9].getAddress();

    // Deploy token contract
    CTPToken = await hre.ethers.deployContract("Token", [
      account0Address,
      "50000",
      "200",
      account9Address,
    ]);
    await CTPToken.waitForDeployment();

    // Evidence Storage contract
    EvidenceStorageContract = await hre.ethers.deployContract(
      "EvidenceStorage",
      [account0Address]
    );
    await EvidenceStorageContract.waitForDeployment();
  });

  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const ownerBalance = await CTPToken.balanceOf(account0Address);
    expect(await CTPToken.totalSupply()).to.equal(ownerBalance);
  });

  it("Should have correct name and symbol", async function () {
    const name = await CTPToken.name();
    const symbol = await CTPToken.symbol();

    expect(name).to.equal("Carbon Token Proposals");
    expect(symbol).to.equal("CTP");
  });

  it("Should allow owner to mint tokens", async function () {
    await CTPToken.connect(owner).mint(account9Address, 1000);
    expect(await CTPToken.balanceOf(account9Address)).to.equal(1000);
  });

  it("Should allow owner update set reward token amount.", async function () {
    await CTPToken.connect(owner).setRewardTokenAmount(500);
    expect(await CTPToken.rewardTokenAmount()).to.equal(500);
  });

  it("Shoudl transfer token with correct tax transaction", async function () {
    const originalBalance = await CTPToken.balanceOf(account1Address);
    const transactionAmount = BigInt(100);

    await CTPToken.setTransactionTaxRate(100);
    await CTPToken.connect(owner).transfer(account1Address, transactionAmount);

    const finalBalance = await CTPToken.balanceOf(account1Address);
    const BalanceAfterTransfer = originalBalance + transactionAmount;
    const taxAmount = (BalanceAfterTransfer * BigInt(100)) / BigInt(10000);

    expect(finalBalance).to.equal(BalanceAfterTransfer - taxAmount);
  });

  // Test for evidence storage contract
  it("Should allow a submitter to submit evidendence", async function () {
    const evidenceHash = hashEvidence("Hello duc ne nha may anh em");
    const signature = await signEvidence(evidenceHash, privateKeySubmitter);

    await EvidenceStorageContract.connect(submitter).submitEvidence(
      evidenceHash,
      signature
    );

    const storedEvidence = await EvidenceStorageContract.connect(
      submitter
    ).retrieveEvidence(evidenceHash);

    expect(storedEvidence[0]).to.equal(await submitter.getAddress());
    expect(storedEvidence[1]).exist;
    expect(storedEvidence[2]).to.equal(signature);
  });

  it("Should not allow a submitter to submit same evidence twice", async function () {
    const evidenceHash = hashEvidence("Xin chao mot ngay moi tuyet voi");
    const signature = await signEvidence(evidenceHash, privateKeySubmitter);

    await EvidenceStorageContract.connect(submitter).submitEvidence(
      evidenceHash,
      signature
    );

    await expect(
      EvidenceStorageContract.connect(submitter).submitEvidence(
        evidenceHash,
        signature
      )
    ).to.be.revertedWith("Evidence already submitted.");
  });

  it("Should allow get creation timestamp from an evidence hash", async function () {
    const evidenceHash = hashEvidence("Chu meo may den tu tuong lai");
    const signature = await signEvidence(evidenceHash, privateKeySubmitter);

    await EvidenceStorageContract.connect(submitter).submitEvidence(
      evidenceHash,
      signature
    );

    const createAt = await EvidenceStorageContract.getCreateAtFromHash(
      evidenceHash
    );
    expect(createAt).to.exist;
  });
});

import { expect } from "chai";
import { Signer } from "ethers";
import { beforeEach, describe } from "mocha";
import { EvidenceStorage, EvidenceValidator, Token } from "../typechain-types";
import { ethers } from "hardhat";
import {
  hashEvidence,
  signEvidence,
  verifySignature,
} from "../utils/HashCrypto";

const privateKeySubmitter = process.env.PRIVATE_KEY_SUBMITTER || "";

describe("Evidence validator test smart contract", function () {
  let attacker, pool: Signer;
  let submitter: Signer;
  let owner: Signer;
  let tokenContract: Token;
  let EvidenceStorageContract: EvidenceStorage;
  let EvidenceValidatorContract: EvidenceValidator;

  beforeEach(async function () {
    [owner, submitter, attacker, pool] = await ethers.getSigners();

    // Deploy token contract
    tokenContract = await ethers.deployContract("Token", [
      owner.getAddress(),
      "50000",
      "200",
      pool.getAddress(),
    ]);
    await tokenContract.waitForDeployment();

    // Evidence Storage contract
    EvidenceStorageContract = await ethers.deployContract("EvidenceStorage", [
      owner.getAddress(),
    ]);
    await EvidenceStorageContract.waitForDeployment();

    // Evidence validator contract
    EvidenceValidatorContract = await ethers.deployContract(
      "EvidenceValidator",
      [tokenContract.target, EvidenceStorageContract.target]
    );
    await EvidenceValidatorContract.waitForDeployment();
  });

  it("Should signature valid", async function () {
    const message = "Examples string for test 17/2/2024.";
    const evidenceHash = hashEvidence(message);
    const signature = await signEvidence(message, privateKeySubmitter);

    const addressSigner = await verifySignature(message, signature);

    const validSignature = await EvidenceValidatorContract.connect(
      submitter
    ).isSignatureValid(evidenceHash, signature);
    expect(validSignature).to.be.true;
  });

  it("Should validate evidence and reward submitter", async function () {
    const message = "Message for test 17/2.";
    const evidenceHash = hashEvidence(message);
    const signature = await signEvidence(message, privateKeySubmitter);

    const addressSigner = await verifySignature(message, signature);

    //Set reward token amount
    await tokenContract.connect(owner).setRewardTokenAmount(500);

    await EvidenceStorageContract.connect(submitter).submitEvidence(
      evidenceHash,
      signature
    );

    // Get create at time
    const createAt = await EvidenceValidatorContract.connect(
      submitter
    ).getCreateAtFromEvidenceStorage(evidenceHash);

    await expect(
      EvidenceValidatorContract.connect(submitter).validateEvidence(
        evidenceHash,
        signature
      )
    )
      .to.emit(EvidenceValidatorContract, "EvidenceValidated")
      .withArgs(submitter.getAddress, evidenceHash, true);

    const isEvidenceValidated =
      await EvidenceValidatorContract.validatedEvidence(evidenceHash);
    expect(isEvidenceValidated).to.be.true;

    const balanceSubmitter = await tokenContract.balanceOf(
      await submitter.getAddress()
    );

    expect(balanceSubmitter).to.equal(500);
  });
});

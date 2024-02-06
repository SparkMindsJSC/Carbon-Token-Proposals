import { expect } from "chai";
import { Signer } from "ethers";
import { beforeEach, describe } from "mocha";
import { EvidenceStorage, EvidenceValidator, Token } from "../typechain-types";
import { ethers } from "hardhat";
import { hashEvidence, signEvidence } from "../utils/HashCrypto";

const privateKeySubmitter = process.env.PRIVATE_KEY_SUBMITTER || "";

describe("Evidence validator test smart contract", function () {
  let attacker, pool: Signer;
  let submitter: Signer;
  let owner: Signer;
  let tokenContract: Token;
  let EvidenceStorageContract: EvidenceStorage;
  let EvidenceValidatorContract: EvidenceValidator;
  let testerAddress: string;

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

    console.log("Smart contract successfully deployed");
  });

  it("Should signature valid", async function () {
    const evidenceHash = hashEvidence("Cong ty sparkminds");
    const signature = await signEvidence(evidenceHash, privateKeySubmitter);

    const validSignature = await EvidenceValidatorContract.isSignatureValid(
      evidenceHash,
      signature
    );
    expect(validSignature).to.be.true;
  });

  it("Should validate evidence and reward submitter", async function () {
    const evidenceHash = hashEvidence("Cong ty sparkminds");
    const signature = await signEvidence(evidenceHash, privateKeySubmitter);
    console.log("Signature: ", signature);
    console.log("Evidence hash: ", evidenceHash);
    console.log("Submitter address: ", await submitter.getAddress());
    console.log("Private key: ", privateKeySubmitter);

    //Set reward token amount
    await tokenContract.connect(owner).setRewardTokenAmount(500);

    await EvidenceStorageContract.connect(submitter).submitEvidence(
      evidenceHash,
      signature
    );

    await expect(
      EvidenceValidatorContract.connect(submitter).validateEvidence(
        evidenceHash,
        signature
      )
    )
      .to.emit(EvidenceValidatorContract, "evidenceValidated")
      .withArgs(submitter.getAddress, evidenceHash, true);

    const balanceSubmitter = await tokenContract.balanceOf(
      await submitter.getAddress()
    );
    expect(balanceSubmitter).to.equal(500);

    const isEvidenceValidated =
      await EvidenceValidatorContract.validatedEvidence(evidenceHash);
    expect(isEvidenceValidated).to.be.true;
  });
});

import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers } from "hardhat";

type Signers = {
  owner: HardhatEthersSigner;
  account: HardhatEthersSigner;
};

async function deployTokenContract(signers: Signers) {
  const Token = await ethers.deployContract("Token", [
    signers.owner.address,
    "1000000000000000000000",
    "200",
    signers.account.address,
  ]);
  await Token.waitForDeployment();

  console.log("Deployed smart contract token: " + Token.target);
}

async function deployEvidenceStorage(signers: Signers) {
  // Evidence storage
  const EvidenceStorageContract = await ethers.deployContract(
    "EvidenceStorage",
    [signers.owner.address]
  );
  await EvidenceStorageContract.waitForDeployment();
  console.log(
    "Deployed smart contract evidence storage: " +
      EvidenceStorageContract.target
  );
}

async function deployTimelock(signers: Signers) {
  // Timelock
  const TimeLockContract = await ethers.deployContract("Timelock", [
    120,
    [signers.account.address],
    [signers.owner.address],
  ]);
  await TimeLockContract.waitForDeployment();

  console.log("Deployed smart contract timelock: " + TimeLockContract.target);
}

async function deployGovernor(
  tokenAddress: string,
  timelockAddress: string
): Promise<void> {
  // Governor
  const GovernorContract = await ethers.deployContract("CarbonGovernor", [
    tokenAddress,
    timelockAddress,
  ]);
  await GovernorContract.waitForDeployment();
  console.log("Deployed smart contract governor: " + GovernorContract.target);
}

async function deployEvidenceValidate(
  tokenAddress: string,
  evidenceStorageAddress: string
) {
  // Evidence validator
  const EvidenceValidatorContract = await ethers.deployContract(
    "EvidenceValidator",
    [tokenAddress, evidenceStorageAddress]
  );
  await EvidenceValidatorContract.waitForDeployment();
  console.log(
    "Deployed smart contract evidence validator: " +
      EvidenceValidatorContract.target
  );
}

async function main() {
  const [owner, account] = await ethers.getSigners();
  const signers: Signers = {
    owner: owner,
    account: account,
  };
  // address smart contracts is deployed in sepolia network
  const tokenAddress = "0x3F75E56495a31db40EaE9E29ceF3DaeC18fd7f83";
  const timelockAddress = "0x57e95b2e4Dfa01323a1F15db48d6A90e497c895D";
  const evidenceStorageAddress = "0x57799ACbC4a1Fd531f702682ad5B0b6355d0451A";
  const governorAddress = "0x7b723e8698BE2B35001Abc7CCF3FF33A9521c908";
  const evidenceValidateAddress = "0xC0bd5B5069eF1f6Ef7093776cc8b5c071adFcC65";

  // await deployTokenContract(signers);
  // await deployEvidenceStorage(signers);
  // await deployTimelock(signers);
  // await deployGovernor(tokenAddress, timelockAddress);
  // deployEvidenceValidate(tokenAddress, evidenceStorageAddress);
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});

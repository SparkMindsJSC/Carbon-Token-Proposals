import { ethers } from "hardhat";

async function main() {
  const [owner, account1] = await ethers.getSigners();

  // Token
  const Token = await ethers.deployContract("Token", [
    owner.address,
    "1000000000000000000000",
    "200",
    account1.address,
  ]);
  await Token.waitForDeployment();

  console.log("Deployed smart contract token: " + Token.target);

  // Evidence storage
  const EvidenceStorageContract = await ethers.deployContract(
    "EvidenceStorage",
    [owner]
  );
  await EvidenceStorageContract.waitForDeployment();
  console.log(
    "Deployed smart contract evidence storage: " +
      EvidenceStorageContract.target
  );

  // Timelock
  const TimeLockContract = await ethers.deployContract("Timelock", [
    120,
    [account1.address],
    [owner.address],
  ]);
  await TimeLockContract.waitForDeployment();
  console.log("Deployed smart contract timelock: " + TimeLockContract.target);

  // Governor
  const GovernorContract = await ethers.deployContract("CarbonGovernor", [
    Token.target,
    TimeLockContract.target,
  ]);
  await GovernorContract.waitForDeployment();
  console.log("Deployed smart contract governor: " + GovernorContract.target);

  // Evidence validator
  const EvidenceValidatorContract = await ethers.deployContract(
    "EvidenceValidator",
    [Token.target, EvidenceStorageContract.target]
  );
  await EvidenceValidatorContract.waitForDeployment();
  console.log(
    "Deployed smart contract evidence validator: " +
      EvidenceValidatorContract.target
  );
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});

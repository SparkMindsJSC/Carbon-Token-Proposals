import * as hre from "hardhat";

async function main() {
  const [owner] = await hre.ethers.getSigners();
  console.log("Deploying contract with the account: ", owner.address);
  const tokenContract = await hre.ethers.deployContract("Token", [
    ,
    owner.address,
  ]);
  await tokenContract.waitForDeployment();

  console.log(
    "Smart contract token deployed successfully to: ",
    tokenContract.target
  );
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});

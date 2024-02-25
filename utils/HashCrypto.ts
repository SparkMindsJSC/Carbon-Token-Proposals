import { ethers } from "hardhat";

function hashEvidence(evidence: string): string {
  const hash = ethers.hashMessage(evidence);

  return hash;
}

async function signEvidence(
  message: string,
  privateKey: string
): Promise<string> {
  const wallet = new ethers.Wallet(privateKey);
  const signature = await wallet.signMessage(message);
  return signature;
}

async function verifySignature(message: string, signature: string) {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress;
  } catch (error) {
    console.error("Failed to verify signature:", error);
  }
}

async function hashDescripton(description: string): Promise<string> {
  return ethers.keccak256(ethers.toUtf8Bytes(description));
}

export { hashEvidence, signEvidence, verifySignature, hashDescripton };

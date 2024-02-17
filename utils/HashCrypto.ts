import { ethers } from "hardhat";

export function hashEvidence(evidence: string): string {
  // const dataHash = ethers.keccak256(ethers.toUtf8Bytes(evidence));
  const hash = ethers.hashMessage(evidence);

  return hash;
}

export async function signEvidence(
  evidenceHash: string,
  privateKey: string
): Promise<string> {
  const wallet = new ethers.Wallet(privateKey);
  const signature = await wallet.signMessage(evidenceHash);
  return signature;
}

export async function verifySignature(message: string, signature: string) {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress;
  } catch (error) {
    console.error("Failed to verify signature:", error);
  }
}

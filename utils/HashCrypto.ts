import { ethers } from "hardhat";

export function hashEvidence(evidence: string): string {
  const hash = ethers.keccak256(ethers.toUtf8Bytes(evidence));
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

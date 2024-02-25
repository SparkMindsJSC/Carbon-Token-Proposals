import { ethers } from "hardhat";

export function hashEvidence(evidence: string): string {
  const hash = ethers.hashMessage(evidence);

  return hash;
}

export async function signEvidence(
  message: string,
  privateKey: string
): Promise<string> {
  const wallet = new ethers.Wallet(privateKey);
  const signature = await wallet.signMessage(message);
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

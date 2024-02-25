import { ethers } from "ethers";

export async function changeRewardTokenAmount(
  _newRewardTokenAmount: number
): Promise<string> {
  const abi = ["function setRewardTokenAmount(uint256)"];
  const iface = new ethers.Interface(abi);
  const data = iface.encodeFunctionData("setRewardTokenAmount", [
    _newRewardTokenAmount,
  ]);
  return data;
}

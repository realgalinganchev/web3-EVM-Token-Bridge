import Token_ABI from "../contracts/Token.json";
import type { ERC20 } from "../'./contracts/types'/ERC20";
import useContract from "./useContract";

export default function useTokenContract(tokenAddress?: string) {
  return useContract<ERC20>(tokenAddress, Token_ABI);
}

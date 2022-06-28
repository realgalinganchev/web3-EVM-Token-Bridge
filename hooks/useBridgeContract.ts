import BRIDGE_ABI from "../contracts/Bridge.json";
//import type { ERC20 } from "../'./contracts/types'/Bridge";
import useContract from "./useContract";


export default function useBridgeContract(contractAddress?: string) {
  return useContract<any>(contractAddress, BRIDGE_ABI)
}

import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import useNativeCurrencyBalance from "../hooks/useNativeCurrencyBalance";
import { parseBalance } from "../util";

const NativeCurrencyBalance = () => {
  const { account, chainId } = useWeb3React<Web3Provider>();
  const { data } = useNativeCurrencyBalance(account);

  return (
    <div style={{ fontSize: "23px", margin: "0px", padding: "0px" }}> 
     <span style={{ fontWeight: "500"}}>ETH Balance: Ξ </span><span style={{ fontWeight: "200"}}>{parseBalance(data ?? 0)}</span>
     </div>
  )

};
export default NativeCurrencyBalance;

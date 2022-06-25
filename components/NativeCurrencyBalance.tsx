import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import useNativeCurrencyBalance from "../hooks/useNativeCurrencyBalance";
import { parseBalance } from "../util";

const NativeCurrencyBalance = () => {
  const { account, chainId } = useWeb3React<Web3Provider>();
  const { data } = useNativeCurrencyBalance(account);

  return <p>ETH Balance: Ξ {parseBalance(data ?? 0)}</p>;

};
export default NativeCurrencyBalance;

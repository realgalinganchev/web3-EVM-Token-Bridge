import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import useTokenBalance from "../hooks/useTokenBalance";
import { ITokenBalance } from "../interfaces/ITokenBalance";
import { parseBalance, shortenHex } from "../util";
import NativeCurrencyBalance from "./NativeCurrencyBalance";

const TokenBalance = ({ tokenAddress, symbol }: ITokenBalance) => {
  const { account } = useWeb3React<Web3Provider>();
  const { data } = useTokenBalance(account, tokenAddress);

  return (
    <>
      <p style={{ bottom: "90px", position: "relative", fontSize: "23px", margin: "0px", padding: "0px" }}>
        <span style={{ fontWeight: "500" }}>Connected account: </span><span style={{ fontWeight: "200" }}>{account && `${shortenHex(account, 4)}`}</span>
        <NativeCurrencyBalance />
        <span style={{ fontWeight: "500" }}>Token Balance: </span><span style={{ fontWeight: "200" }}>{symbol + " " + parseBalance(data ?? 0)}</span>
      </p>
    </>

  );
};

export default TokenBalance;

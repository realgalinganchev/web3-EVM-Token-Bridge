import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import useTokenBalance from "../hooks/useTokenBalance";
import { ITokenBalance } from "../interfaces/ITokenBalance";
import { parseBalance } from "../util";

const TokenBalance = ({ tokenAddress, symbol }: ITokenBalance) => {
  const { account } = useWeb3React<Web3Provider>();
  const { data } = useTokenBalance(account, tokenAddress);

  return (
    <p style={{ bottom: "50px", position: "relative", fontSize: "23px" }}>
      {`Balance: ${symbol} `}{parseBalance(data ?? 0)}
    </p>
  );
};

export default TokenBalance;

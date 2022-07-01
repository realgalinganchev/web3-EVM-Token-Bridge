import type { BigNumberish } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";
import { ITransaction } from "./interfaces/ITransaction";
import BRIDGE_ABI from "./contracts/Bridge.json";

export function shortenHex(hex: string, length = 4) {
  return `${hex.substring(0, length + 2)}…${hex.substring(
    hex.length - length
  )}`;
}

const ETHERSCAN_PREFIXES = {
  1: "",
  3: "ropsten.",
  4: "rinkeby.",
  5: "goerli.",
  42: "kovan.",
};

export function formatEtherscanLink(
  type: "Account" | "Transaction",
  data: [number, string]
) {
  switch (type) {
    case "Account": {
      const [chainId, address] = data;
      return `https://${ETHERSCAN_PREFIXES[chainId]}etherscan.io/address/${address}`;
    }
    case "Transaction": {
      const [chainId, hash] = data;
      return `https://${ETHERSCAN_PREFIXES[chainId]}etherscan.io/tx/${hash}`;
    }
  }
}

export const parseBalance = (
  value: BigNumberish,
  decimals = 18,
  decimalsToDisplay = 3
) => parseFloat(formatUnits(value, decimals)).toFixed(decimalsToDisplay);

export function formatStructToITransaction(transactions: any[]) {
  const transactionsProps = BRIDGE_ABI
    .find((abi) => abi.name === "transactions")
    .outputs.map((p: any) => p.name);

  const decodeTransactionsArray = (transactions: any[]) => {
    return transactions.map((transaction) => {
      return Object.fromEntries(
        transaction.map((val: any, idx: number) => {
          return [transactionsProps[idx], val];
        })
      );
    });
  };

  const formatToTransactionsArray = (transactions: any[]): (ITransaction[]) => {
    transactions.forEach(element => {
      element.value = formatUnits(element.value.toString());
      element.timestamp = formatTimestampToDate(element.timestamp);
      element.blockNumber = element.value.toString();
    });
    return transactions;
  }

  return formatToTransactionsArray(decodeTransactionsArray(transactions))
}

export default function formatTimestampToDate(timestamp: number) {
  const pad = (n, s = 2) => (`${new Array(s).fill(0)}${n}`).slice(-s);
  const d = new Date(timestamp * 1000);
  return `${pad(d.getFullYear(), 4)}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

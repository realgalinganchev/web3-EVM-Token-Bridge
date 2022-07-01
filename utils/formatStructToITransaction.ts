import { formatUnits } from "@ethersproject/units";
import { ITransaction } from "../interfaces/ITransaction";
import formatTimestampToDate from "./formatTimestampToDate";
import BRIDGE_ABI from "../contracts/Bridge.json";

export default function formatStructToITransaction(transactions: any[]) {
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
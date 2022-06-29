import React, { useEffect, useState } from 'react'
import axios from "axios";
import { formatUnits } from '@ethersproject/units';

export const TransactionHistory = ({ ...props }) => {
    const loadingTxsHasFinished = (hasFinished: boolean) => {
        props.loadingTxsHasFinished(hasFinished);
    }

    interface Transaction {
        sender: string,
        receiver: string,
        value: number,
        timestamp: string,
        eventName: string,
        txHash: string
    };

    const [transactionHistory, setTransactionHistory] = useState<Transaction[]>([]);
    const [binIdUrls, setBinIdUrls] = useState<string[]>([]);
    const token = "$2b$10$sdKpbNf7n/UgK4PIONrK6.Kwgp6DOZ6WZB103YCgfzEboDOleD/Yu";
    const axiosHeaders = {
        headers: {
            'X-Master-Key': token
        }
    };
    // useEffect(() => {
    //     if (props.txHash.length > 0) {
    //         const getUrl = "https://api.jsonbin.io/v3/c/uncategorized/bins";
    //         axios
    //             .get(getUrl, axiosHeaders)
    //             .then(response =>
    //                 setBinIdUrls(response.data.map((r: { record: any; }) => `https://api.jsonbin.io/v3/b/${r.record}/latest`)));
    //     }
    //     if (binIdUrls.length > 0) {
    //         binIdUrls.forEach(async (currBinId, id) => {
    //             await axios
    //                 .get(currBinId, axiosHeaders)
    //                 .then(response =>
    //                     setTransactionHistory(transactionHistory => [...transactionHistory, response.data.record]))
    //                 .catch(err => err);
    //         })
    //     }
    //     console.log(transactionHistory.sort(function (b, a) {
    //         return a.timestamp.localeCompare(b.timestamp)[0];
    //     }))
    // }, [])

    useEffect(() => {
        const getUrl = "https://api.jsonbin.io/v3/c/uncategorized/bins";
        axios
            .get(getUrl, axiosHeaders)
            .then(response =>
                setBinIdUrls(response.data.map((r: { record: any; }) => `https://api.jsonbin.io/v3/b/${r.record}/latest`)));
    }, [])

    useEffect(() => {
        if (transactionHistory.length > 0 && transactionHistory.length === binIdUrls.length) {
            loadingTxsHasFinished(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transactionHistory.length, binIdUrls.length]);

    useEffect(() => {
        if (binIdUrls.length > 0) {
            binIdUrls.forEach(async (currBinId, id) => {
                await axios
                    .get(currBinId, axiosHeaders)
                    .then(response =>
                        setTransactionHistory(transactionHistory => [...transactionHistory, response.data.record]))
                    .catch(err => err);
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [binIdUrls.length]);

    return (
        <div >
            <div >{transactionHistory && transactionHistory.sort(function (b, a) {
                return a.timestamp.localeCompare(b.timestamp);
            })?.map((transaction, index) => {
                return (
                    <div key={index}>
                        <div>
                            ...{transaction.sender.substring(transaction.receiver.length - 4)} has
                            triggered {transaction.eventName} for {formatUnits(transaction.value)} TKN
                            to ...{transaction.receiver.substring(transaction.receiver.length - 4)} {' '}
                            on {transaction.timestamp}
                        </div>
                        <div>
                            <a
                                href={`https://rinkeby.etherscan.io/tx/${transaction.txHash}`}
                                target='_blank'
                                rel='noreferrer'
                            >
                                View on Etherscan
                            </a>
                        </div>
                    </div>
                )
            })}
            </div>
        </div>
    )
}
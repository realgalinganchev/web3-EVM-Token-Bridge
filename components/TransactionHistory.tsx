import React, { useEffect, useState, useContext, cloneElement } from 'react'
import axios from "axios";



export const TransactionHistory = () => {

    interface Transaction {
        sender: string,
        receiver: string,
        value: number,
        timestamp: string,
        eventName: string,
        txHash: string
    };

    const [transactionHistory, setTransactionHistory] = useState<Transaction[]>([]);
    const [binIds, setBinIds] = useState<string[]>([]);

    useEffect(() => {
        const getUrl = "https://api.jsonbin.io/v3/c/uncategorized/bins"; // request URL
        const token = "$2b$10$sdKpbNf7n/UgK4PIONrK6.Kwgp6DOZ6WZB103YCgfzEboDOleD/Yu"; // access token
        var axiosHeaders = {
            headers: {
                'X-Master-Key': token,
            }
        };
        axios
            .get(getUrl, axiosHeaders)
            .then(response =>
                setBinIds(response.data.map(r => r.record)));
    }, [])


    useEffect(() => {
        if (binIds.length > 0) {
            binIds.forEach(currBinId => {
                const getUrl = `https://api.jsonbin.io/v3/b/${currBinId}/latest`; // request URL
                const token = "$2b$10$sdKpbNf7n/UgK4PIONrK6.Kwgp6DOZ6WZB103YCgfzEboDOleD/Yu"; // access token
                var axiosHeaders = {
                    headers: { 'X-Master-Key': token }
                };
                axios
                    .get(getUrl, axiosHeaders)
                    .then(response =>
                        setTransactionHistory(transactionHistory => [...transactionHistory, response.data.record]));
            });

        }
    }, [])


    return (
        <div >
            <div >{transactionHistory && transactionHistory?.map((transaction, index) => {
                return (
                    <div key={index}>
                        <div>
                            <span>
                                {transaction.sender}
                            </span>
                            has triggered {transaction.eventName}
                            for {transaction.value} TKN{' '}
                            to{' '}
                            <span>
                                {transaction.receiver}
                            </span>
                        </div>{' '}
                        on{' '}<div>
                            {transaction.timestamp}
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
export interface ITransaction {
    sender: string,
    receiver: string,
    eventName: string,
    value: number,
    timestamp: string,
    blockNumber: number
    // txHash: string
};
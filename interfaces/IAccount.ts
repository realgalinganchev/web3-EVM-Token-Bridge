export type IAccount = {
    triedToEagerConnect: boolean;
    sendExternalErrorMessage: (err: string) => void;
};

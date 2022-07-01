const ethers = require("ethers");
//import ethers from "ethers"
const ethPermit = require("eth-permit");
const BridgeABI = require("../contracts/Bridge.json");
const TokenABI = require("../contracts/Token.json");
const { formatUnits } = require("ethers/lib/utils");
const { XMLHttpRequest } = require("xmlhttprequest");

async function main() {
    const infuraAPIKey = "ab0b32b1a6484c3f94a5753a083ddd11";
    const privateKey = "0eda082d0c0271f64c8356581772ae996a299d7568fc3ddb52a869975dfb40c0";


    const addressBridgeRopsten = '0xBaE680c5a202701eAcA5C954aC68c333D570F30C'
    const addressTokenRopsten = '0xF00614ba7033e4AfeA7718c79E50ad8bB26471a9'

    const addressBridgeRinkeby = '0x6Ad41Dc080ACfCa29121026cda4afE955e0Bd60c'
    const addressTokenRinkeby = '0x83300862B21EE7e9396f550b648Ed18fdF39adDB'

    const providerRopsten = new ethers.providers.InfuraProvider("ropsten", infuraAPIKey);
    const walletRopsten = new ethers.Wallet(privateKey, providerRopsten);
    const addressWalletRopsten = await walletRopsten.getAddress();
    const bridgeRopsten = new ethers.Contract(addressBridgeRopsten, BridgeABI, walletRopsten);
    const tokenRopsten = new ethers.Contract(addressTokenRopsten, TokenABI, walletRopsten);

    const providerRinkeby = new ethers.providers.InfuraProvider("rinkeby", infuraAPIKey)
    const walletRinkeby = new ethers.Wallet(privateKey, providerRinkeby);
    const addressWalletRinkeby = await walletRinkeby.getAddress();
    const bridgeRinkeby = new ethers.Contract(addressBridgeRinkeby, BridgeABI, walletRinkeby);
    const tokenRinkeby = new ethers.Contract(addressTokenRinkeby, TokenABI, walletRinkeby);

    bridgeRopsten.on("Lock", async (sender, receiver, value, timestamp, blockNumber) => {
        const checkRinkebyBalanceOfBeforeSync = await bridgeRinkeby.getBalanceOfOwner(sender);
        const sum = checkRinkebyBalanceOfBeforeSync.add(value);
        const syncTxRinkeby = await bridgeRinkeby.setBalanceOfOwnerWithValue(
            sender,
            sum
        );
        await syncTxRinkeby.wait();
        console.log("Listening for Lock and Unlock events...")
        console.log('Bridge Ropsten supply after lock :>> ', formatUnits(await tokenRopsten.balanceOf(addressBridgeRopsten)));
        console.log('Bridge Rinkeby supply after lock :>> ', formatUnits(await tokenRinkeby.balanceOf(addressBridgeRinkeby)));
        console.log('Wallet Ropsten supply after lock :>> ', formatUnits(await tokenRopsten.balanceOf(sender)));
        console.log('Wallet Rinkeby supply after lock :>> ', formatUnits(await tokenRinkeby.balanceOf(sender)));
    })


    bridgeRinkeby.on("Unlock", async (sender, receiver, value, timestamp, blockNumber) => {
        const checkRopstenBalanceOfBeforeSync = await bridgeRopsten.getBalanceOfOwner(receiver);
        const diff = checkRopstenBalanceOfBeforeSync.sub(value);
        const syncTxRopsten = await bridgeRopsten.setBalanceOfOwnerWithValue(
            receiver,
            diff
        );
        await syncTxRopsten.wait();
        console.log("Listening for Lock and Unlock events...")
        console.log('Bridge Ropsten supply after unlock :>> ', formatUnits(await tokenRopsten.balanceOf(addressBridgeRopsten)));
        console.log('Bridge Rinkeby supply after unlock :>> ', formatUnits(await tokenRinkeby.balanceOf(addressBridgeRinkeby)));
        console.log('Wallet Ropsten supply after lock :>> ', formatUnits(await tokenRopsten.balanceOf(receiver)));
        console.log('Wallet Rinkeby supply after lock :>> ', formatUnits(await tokenRinkeby.balanceOf(receiver)));
    })

    bridgeRinkeby.on("Lock", async (sender, receiver, value, timestamp, blockNumber) => {
        const checkRopstenBalanceOfBeforeSync = await bridgeRopsten.getBalanceOfOwner(sender);
        const sum = checkRopstenBalanceOfBeforeSync.add(value);
        const syncTxRopsten = await bridgeRopsten.setBalanceOfOwnerWithValue(
            sender,
            sum
        );
        await syncTxRopsten.wait();
        console.log("Listening for Lock and Unlock events...")
        console.log('Bridge Ropsten supply after lock :>> ', formatUnits(await tokenRopsten.balanceOf(addressBridgeRopsten)));
        console.log('Bridge Rinkeby supply after lock :>> ', formatUnits(await tokenRinkeby.balanceOf(addressBridgeRinkeby)));
        console.log('Wallet Ropsten supply after lock :>> ', formatUnits(await tokenRopsten.balanceOf(sender)));
        console.log('Wallet Rinkeby supply after lock :>> ', formatUnits(await tokenRinkeby.balanceOf(sender)));
    })

    bridgeRopsten.on("Unlock", async (sender, receiver, value, timestamp, blockNumber) => {
        const checkRinkebyBalanceOfBeforeSync = await bridgeRinkeby.getBalanceOfOwner(receiver);
        const diff = checkRinkebyBalanceOfBeforeSync.sub(value);
        const syncTxRinkeby = await bridgeRinkeby.setBalanceOfOwnerWithValue(
            receiver,
            diff
        );
        await syncTxRinkeby.wait();
        console.log("Listening for Lock and Unlock events...")
        console.log('Bridge Ropsten supply after unlock :>> ', formatUnits(await tokenRopsten.balanceOf(addressBridgeRopsten)));
        console.log('Bridge Rinkeby supply after unlock :>> ', formatUnits(await tokenRinkeby.balanceOf(addressBridgeRinkeby)));
        console.log('Wallet Ropsten supply after lock :>> ', formatUnits(await tokenRopsten.balanceOf(receiver)));
        console.log('Wallet Rinkeby supply after lock :>> ', formatUnits(await tokenRinkeby.balanceOf(receiver)));
    })
    console.log("Listening for Lock and Unlock events...")

}
main()
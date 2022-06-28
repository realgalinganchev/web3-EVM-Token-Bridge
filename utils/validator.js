const ethers = require("ethers");
//import ethers from "ethers"
const ethPermit = require("eth-permit");
const BridgeABI = require("../contracts/Bridge.json");
const TokenABI = require("../contracts/Token.json");
const { formatUnits } = require("ethers/lib/utils");

async function main() {
    const infuraAPIKey = "ab0b32b1a6484c3f94a5753a083ddd11";
    const privateKey = "0eda082d0c0271f64c8356581772ae996a299d7568fc3ddb52a869975dfb40c0";

    const addressBridgeRopsten = "0x1f29e1EaF967903A6B1b98424343ce6f89Aa2D7e"
    const addressTokenRopsten = "0xEbA06Dd358756828a04c8c81c50373AeB44b396D"

    const addressBridgeRinkeby = "0xf8Dd39792CF9A209354C6c0E00357bfA304C24fA"
    const addressTokenRinkeby = "0x5987905E0d049EF0411BbACA06a05E916E0F9044"

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

    // const sendValue =  ethers.utils.parseEther("1000");
    // const sendTxRopsten = await tokenRopsten.transfer(addressBridgeRopsten, sendValue);
    // await sendTxRopsten.wait();
    // const sendTxRinkeby = await tokenRinkeby.transfer(addressBridgeRinkeby, sendValue);
    // await sendTxRinkeby.wait();

    console.log('Bridge Ropsten supply before lock :>> ', ethers.utils.formatUnits(await tokenRopsten.balanceOf(addressBridgeRopsten)));
    console.log('Bridge Rinkeby supply before lock :>> ', ethers.utils.formatUnits(await tokenRinkeby.balanceOf(addressBridgeRinkeby)));
    console.log('Wallet Ropsten supply before lock :>> ', ethers.utils.formatUnits(await tokenRopsten.balanceOf(addressWalletRopsten)));
    console.log('Wallet Rinkeby supply before lock :>> ', ethers.utils.formatUnits(await tokenRinkeby.balanceOf(addressWalletRinkeby)));

    bridgeRopsten.on("Lock", async (sender, receiver, value) => {
        const checkRinkebyBalanceOfBeforeSync = await bridgeRinkeby.getBalanceOfOwner(addressWalletRinkeby);
        const sum = checkRinkebyBalanceOfBeforeSync.add(value);
        const syncTxRinkeby = await bridgeRinkeby.setBalanceOfOwnerWithValue(
            addressWalletRinkeby,
            sum
        );
        await syncTxRinkeby.wait();

        const checkRopstenBalanceOfTx = await bridgeRopsten.getBalanceOfOwner(addressWalletRopsten);
        console.log('Ropsten Bridge balanceOf :>> ', formatUnits(checkRopstenBalanceOfTx));
        const checkRinkebyBalanceOfTx = await bridgeRinkeby.getBalanceOfOwner(addressWalletRinkeby);
        console.log('Rinkeby Bridge balanceOf :>> ', formatUnits(checkRinkebyBalanceOfTx));

        console.log('Bridge Ropsten supply after lock :>> ', ethers.utils.formatUnits(await tokenRopsten.balanceOf(addressBridgeRopsten)));
        console.log('Bridge Rinkeby supply after lock :>> ', ethers.utils.formatUnits(await tokenRinkeby.balanceOf(addressBridgeRinkeby)));
        console.log('Wallet Ropsten supply after lock :>> ', ethers.utils.formatUnits(await tokenRopsten.balanceOf(addressWalletRopsten)));
        console.log('Wallet Rinkeby supply after lock :>> ', ethers.utils.formatUnits(await tokenRinkeby.balanceOf(addressWalletRinkeby)));
        console.log("Listening for Lock and Unlock events...")
    })


    bridgeRinkeby.on("Unlock", async (receiver, value) => {
        const checkRopstenBalanceOfBeforeSync = await bridgeRopsten.getBalanceOfOwner(addressWalletRopsten);

        const diff = checkRopstenBalanceOfBeforeSync.sub(value);
        const syncTxRopsten = await bridgeRopsten.setBalanceOfOwnerWithValue(
            addressWalletRopsten,
            diff
        );
        await syncTxRopsten.wait();

        const checkRopstenBalanceOfAfterSync = await bridgeRopsten.getBalanceOfOwner(addressWalletRopsten);
        console.log('Ropsten Bridge balanceOf :>> ', formatUnits(checkRopstenBalanceOfAfterSync));
        const checkRinkebyBalanceOfTx = await bridgeRinkeby.getBalanceOfOwner(addressWalletRinkeby);
        console.log('Rinkeby Bridge balanceOf :>> ', formatUnits(checkRinkebyBalanceOfTx));

        console.log('Bridge Ropsten supply after unlock :>> ', ethers.utils.formatUnits(await tokenRopsten.balanceOf(addressBridgeRopsten)));
        console.log('Bridge Rinkeby supply after unlock :>> ', ethers.utils.formatUnits(await tokenRinkeby.balanceOf(addressBridgeRinkeby)));
        console.log('Wallet Ropsten supply after unlock :>> ', ethers.utils.formatUnits(await tokenRopsten.balanceOf(addressWalletRopsten)));
        console.log('Wallet Rinkeby supply after unlock :>> ', ethers.utils.formatUnits(await tokenRinkeby.balanceOf(addressWalletRinkeby)));
        console.log("Listening for Lock and Unlock events...")
    })

    bridgeRinkeby.on("Lock", async (sender, receiver, value) => {
        const checkRopstenBalanceOfBeforeSync = await bridgeRopsten.getBalanceOfOwner(addressWalletRopsten);
        const sum = checkRopstenBalanceOfBeforeSync.add(value);
        const syncTxRopsten = await bridgeRopsten.setBalanceOfOwnerWithValue(
            addressWalletRopsten,
            sum
        );
        await syncTxRopsten.wait();
    })

    bridgeRopsten.on("Unlock", async (receiver, value) => {
        const checkRinkebyBalanceOfBeforeSync = await bridgeRinkeby.getBalanceOfOwner(addressWalletRinkeby);

        const diff = checkRinkebyBalanceOfBeforeSync.sub(value);
        const syncTxRinkeby = await bridgeRinkeby.setBalanceOfOwnerWithValue(
            addressWalletRinkeby,
            diff
        );
        await syncTxRinkeby.wait();
    })
    console.log("Listening for Lock and Unlock events...")

}
main()
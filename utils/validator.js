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

    const addressBridgeRopsten = "0x088a466bC7167E168115Bf9c846010Ed6751A459"
    const addressTokenRopsten = "0x151278aeFEB17A85376B10fF475D7B4575D9944e"

    const addressBridgeRinkeby = "0x44CAaBE26AEe07324Ccd3e06326b4E6c7cB7b579"
    const addressTokenRinkeby = "0xF7fCa2625cea04f2e550574ff552Efed644e0A2A"


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




    // req.onreadystatechange = () => {
    //     if (req.readyState == 4) {
    //         console.log('req :>> ', req.responseText);
    //     }
    // };

    // req.open("GET", "https://api.jsonbin.io/v3/b/62bc0e37402a5b380240c7da/latest", true);
    // req.setRequestHeader("X-Master-Key", "$2b$10$sdKpbNf7n/UgK4PIONrK6.Kwgp6DOZ6WZB103YCgfzEboDOleD/Yu");
    // req.send();
    function getFullTimestamp(timestamp) {
        const pad = (n, s = 2) => (`${new Array(s).fill(0)}${n}`).slice(-s);
        const d = new Date(timestamp * 1000);
        return `${pad(d.getFullYear(), 4)}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }

    const saveTx = (sender, receiver, value, timestamp, eventName) => {
        // let req = new XMLHttpRequest();
        // req.open("POST", "https://api.jsonbin.io/v3/b", true);
        // req.setRequestHeader("Content-Type", "application/json");
        // req.setRequestHeader("X-Master-Key", "$2b$10$sdKpbNf7n/UgK4PIONrK6.Kwgp6DOZ6WZB103YCgfzEboDOleD/Yu");
        // const body = `{"sender":"${sender}","receiver":"${receiver}","value":"${value.toString()}","timestamp":"${getFullTimestamp(timestamp)}","eventName":"${eventName}","txHash":""}`;
        // req.send(body);

        // //req.open("PUT", "https://api.jsonbin.io/v3/b/<BIN_ID>", true);

        let reqC = new XMLHttpRequest();

        reqC.onreadystatechange = () => {
            if (reqC.readyState === 4) {
                console.log(reqC.responseText);
            }
        };

        reqC.open("GET", "https://api.jsonbin.io/v3/C/uncategorized/bins", true);
        // reqC.setRequestHeader("X-Collection-Name", "Txs");
        reqC.setRequestHeader("X-Master-Key", "$2b$10$sdKpbNf7n/UgK4PIONrK6.Kwgp6DOZ6WZB103YCgfzEboDOleD/Yu");
        reqC.send();
    }
    saveTx();

    // const sendValue =  ethers.utils.parseEther("50000");
    // const sendTxRopsten = await tokenRopsten.transfer(addressBridgeRopsten, sendValue);
    // await sendTxRopsten.wait();
    // const sendTxRinkeby = await tokenRinkeby.transfer(addressBridgeRinkeby, sendValue);
    // await sendTxRinkeby.wait();

    // console.log('Bridge Ropsten supply before lock :>> ', ethers.utils.formatUnits(await tokenRopsten.balanceOf(addressBridgeRopsten)));
    // console.log('Bridge Rinkeby supply before lock :>> ', ethers.utils.formatUnits(await tokenRinkeby.balanceOf(addressBridgeRinkeby)));
    // console.log('Wallet Ropsten supply before lock :>> ', ethers.utils.formatUnits(await tokenRopsten.balanceOf(addressWalletRopsten)));
    // console.log('Wallet Rinkeby supply before lock :>> ', ethers.utils.formatUnits(await tokenRinkeby.balanceOf(addressWalletRinkeby)));

    // bridgeRopsten.on("Lock", async (sender, receiver, value, timestamp) => {
    //     saveTx(sender, receiver, value, timestamp, "Lock");
    //     const checkRinkebyBalanceOfBeforeSync = await bridgeRinkeby.getBalanceOfOwner(addressWalletRinkeby);
    //     const sum = checkRinkebyBalanceOfBeforeSync.add(value);
    //     const syncTxRinkeby = await bridgeRinkeby.setBalanceOfOwnerWithValue(
    //         addressWalletRinkeby,
    //         sum
    //     );
    //     await syncTxRinkeby.wait();
    //     console.log("Listening for Lock and Unlock events...")
    // })


    // bridgeRinkeby.on("Unlock", async (sender, receiver, value, timestamp) => {
    //     saveTx(sender, receiver, value, timestamp, "Unlock");
    //     const checkRopstenBalanceOfBeforeSync = await bridgeRopsten.getBalanceOfOwner(addressWalletRopsten);
    //     const diff = checkRopstenBalanceOfBeforeSync.sub(value);
    //     const syncTxRopsten = await bridgeRopsten.setBalanceOfOwnerWithValue(
    //         addressWalletRopsten,
    //         diff
    //     );
    //     await syncTxRopsten.wait();
    //     console.log("Listening for Lock and Unlock events...")
    // })

    // bridgeRinkeby.on("Lock", async (sender, receiver, value) => {
    //     saveTx(sender, receiver, value, timestamp, "Lock");
    //     const checkRopstenBalanceOfBeforeSync = await bridgeRopsten.getBalanceOfOwner(addressWalletRopsten);
    //     const sum = checkRopstenBalanceOfBeforeSync.add(value);
    //     const syncTxRopsten = await bridgeRopsten.setBalanceOfOwnerWithValue(
    //         addressWalletRopsten,
    //         sum
    //     );
    //     await syncTxRopsten.wait();
    //     console.log("Listening for Lock and Unlock events...")
    // })

    // bridgeRopsten.on("Unlock", async (receiver, value) => {
    //     saveTx(sender, receiver, value, timestamp, "Unlock");
    //     const checkRinkebyBalanceOfBeforeSync = await bridgeRinkeby.getBalanceOfOwner(addressWalletRinkeby);
    //     const diff = checkRinkebyBalanceOfBeforeSync.sub(value);
    //     const syncTxRinkeby = await bridgeRinkeby.setBalanceOfOwnerWithValue(
    //         addressWalletRinkeby,
    //         diff
    //     );
    //     await syncTxRinkeby.wait();
    //     console.log("Listening for Lock and Unlock events...")
    // })
    // console.log("Listening for Lock and Unlock events...")

}
main()
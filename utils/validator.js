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

    function getFullTimestamp(timestamp) {
        const pad = (n, s = 2) => (`${new Array(s).fill(0)}${n}`).slice(-s);
        const d = new Date(timestamp * 1000);
        return `${pad(d.getFullYear(), 4)}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }

    const saveTx = (sender, receiver, value, timestamp, eventName) => {
        let req = new XMLHttpRequest();
        req.open("POST", "https://api.jsonbin.io/v3/b", true);
        req.setRequestHeader("Content-Type", "application/json");
        req.setRequestHeader("X-Master-Key", "$2b$10$sdKpbNf7n/UgK4PIONrK6.Kwgp6DOZ6WZB103YCgfzEboDOleD/Yu");
        const body = `{"sender":"${sender}","receiver":"${receiver}","value":"${value.toString()}","timestamp":"${getFullTimestamp(timestamp)}","eventName":"${eventName}","txHash":""}`;
        req.send(body);
    }
    // const saveTx = async (sender, receiver, value, timestamp, eventName) => {
    //     const postUrl = "https://api.jsonbin.io/v3/b";
    //     const body = `{"sender":"${sender}","receiver":"${receiver}","value":"${value.toString()}","timestamp":"${getFullTimestamp(timestamp)}","eventName":"${eventName}","txHash":""}`;
    //     await axios
    //         .post(postUrl, body, {
    //             headers: {
    //                 'X-Master-Key': "$2b$10$sdKpbNf7n/UgK4PIONrK6.Kwgp6DOZ6WZB103YCgfzEboDOleD/Yu"
    //             }
    //         }).catch(er)
    //         .then(({ data }) => console.log(data));
    // }

    // const sendValue =  ethers.utils.parseEther("50000");
    // const sendTxRopsten = await tokenRopsten.transfer(addressBridgeRopsten, sendValue);
    // await sendTxRopsten.wait();
    // const sendTxRinkeby = await tokenRinkeby.transfer(addressBridgeRinkeby, sendValue);
    // await sendTxRinkeby.wait();

    console.log('Bridge Ropsten supply before lock :>> ', formatUnits(await tokenRopsten.balanceOf(addressBridgeRopsten)));
    console.log('Bridge Rinkeby supply before lock :>> ', formatUnits(await tokenRinkeby.balanceOf(addressBridgeRinkeby)));
    console.log('addressWalletRopsten :>> ', addressWalletRopsten);
    console.log('addressWalletRinkeby :>> ', addressWalletRinkeby);


    bridgeRopsten.on("Lock", async (sender, receiver, value, timestamp) => {
        saveTx(sender, receiver, value, timestamp, "Lock");
        console.log('sender :>> ', sender);
        console.log('receiver :>> ', receiver);
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


    bridgeRinkeby.on("Unlock", async (sender, receiver, value, timestamp) => {
        saveTx(sender, receiver, value, timestamp, "Unlock");
        console.log('sender :>> ', sender);
        console.log('receiver :>> ', receiver);
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

    bridgeRinkeby.on("Lock", async (sender, receiver, value, timestamp) => {
        saveTx(sender, receiver, value, timestamp, "Lock");
        console.log('sender :>> ', sender);
        console.log('receiver :>> ', receiver);
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

    bridgeRopsten.on("Unlock", async (sender, receiver, value, timestamp) => {
        saveTx(sender, receiver, value, timestamp, "Unlock");
        console.log('sender :>> ', sender);
        console.log('receiver :>> ', receiver);
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
const ethers = require('ethers')
const BridgeABI = require('../contracts/Bridge.json')
const TokenABI = require('../contracts/Token.json')
const { formatUnits } = require('ethers/lib/utils')

async function main() {
  const infuraAPIKey = 'ab0b32b1a6484c3f94a5753a083ddd11'
  const privateKey =
    '0eda082d0c0271f64c8356581772ae996a299d7568fc3ddb52a869975dfb40c0'

  const addressBridgeRopsten = '0xf969fF5332A3655110Bab8FBfd65A04ef262Ed53'
  const addressTokenRopsten = '0x446Db686CA29672a965B21069428AAB3568c8531'
  const addressBridgeRinkeby = '0xa0dBba5FB027339879f186Bfc40ec78b75C75038'

  const addressTokenRinkeby = '0xf1cC8dCb10C26a5D43400246b839F3461C9846CC'

  const providerRopsten = new ethers.providers.InfuraProvider(
    'ropsten',
    infuraAPIKey,
  )
  const walletRopsten = new ethers.Wallet(privateKey, providerRopsten)
  const addressWalletRopsten = await walletRopsten.getAddress()
  const bridgeRopsten = new ethers.Contract(
    addressBridgeRopsten,
    BridgeABI,
    walletRopsten,
  )
  const tokenRopsten = new ethers.Contract(
    addressTokenRopsten,
    TokenABI,
    walletRopsten,
  )

  const providerRinkeby = new ethers.providers.InfuraProvider(
    'rinkeby',
    infuraAPIKey,
  )
  const walletRinkeby = new ethers.Wallet(privateKey, providerRinkeby)
  const addressWalletRinkeby = await walletRinkeby.getAddress()
  const bridgeRinkeby = new ethers.Contract(
    addressBridgeRinkeby,
    BridgeABI,
    walletRinkeby,
  )
  const tokenRinkeby = new ethers.Contract(
    addressTokenRinkeby,
    TokenABI,
    walletRinkeby,
  )

  bridgeRopsten.on(
    'Lock',
    async (sender, receiver, value, timestamp, blockNumber) => {
      const checkRinkebyBalanceOfBeforeSync = await bridgeRinkeby.getBalanceOfOwner(
        sender,
      )
      const sum = checkRinkebyBalanceOfBeforeSync.add(value)
      const syncTxRinkeby = await bridgeRinkeby.setBalanceOfOwnerWithValue(
        sender,
        sum,
      )
      await syncTxRinkeby.wait()

      console.log(
        'Bridge Ropsten supply after lock :>> ',
        formatUnits(await tokenRopsten.balanceOf(addressBridgeRopsten)),
      )
      console.log(
        'Bridge Rinkeby supply after lock :>> ',
        formatUnits(await tokenRinkeby.balanceOf(addressBridgeRinkeby)),
      )
      console.log(
        'Wallet Ropsten supply after lock :>> ',
        formatUnits(await tokenRopsten.balanceOf(sender)),
      )
      console.log(
        'Wallet Rinkeby supply after lock :>> ',
        formatUnits(await tokenRinkeby.balanceOf(sender)),
      )
      console.log('Listening for Lock and Unlock events...')
    },
  )

  bridgeRinkeby.on(
    'Unlock',
    async (sender, receiver, value, timestamp, blockNumber) => {
      const checkRopstenBalanceOfBeforeSync = await bridgeRopsten.getBalanceOfOwner(
        receiver,
      )
      const diff = checkRopstenBalanceOfBeforeSync.sub(value)
      const syncTxRopsten = await bridgeRopsten.setBalanceOfOwnerWithValue(
        receiver,
        diff,
      )
      await syncTxRopsten.wait()

      console.log(
        'Bridge Ropsten supply after unlock :>> ',
        formatUnits(await tokenRopsten.balanceOf(addressBridgeRopsten)),
      )
      console.log(
        'Bridge Rinkeby supply after unlock :>> ',
        formatUnits(await tokenRinkeby.balanceOf(addressBridgeRinkeby)),
      )
      console.log(
        'Wallet Ropsten supply after lock :>> ',
        formatUnits(await tokenRopsten.balanceOf(receiver)),
      )
      console.log(
        'Wallet Rinkeby supply after lock :>> ',
        formatUnits(await tokenRinkeby.balanceOf(receiver)),
      )
      console.log('Listening for Lock and Unlock events...')
    },
  )

  bridgeRinkeby.on(
    'Lock',
    async (sender, receiver, value, timestamp, blockNumber) => {
      const checkRopstenBalanceOfBeforeSync = await bridgeRopsten.getBalanceOfOwner(
        sender,
      )
      const sum = checkRopstenBalanceOfBeforeSync.add(value)
      const syncTxRopsten = await bridgeRopsten.setBalanceOfOwnerWithValue(
        sender,
        sum,
      )
      await syncTxRopsten.wait()

      console.log(
        'Bridge Ropsten supply after lock :>> ',
        formatUnits(await tokenRopsten.balanceOf(addressBridgeRopsten)),
      )
      console.log(
        'Bridge Rinkeby supply after lock :>> ',
        formatUnits(await tokenRinkeby.balanceOf(addressBridgeRinkeby)),
      )
      console.log(
        'Wallet Ropsten supply after lock :>> ',
        formatUnits(await tokenRopsten.balanceOf(sender)),
      )
      console.log(
        'Wallet Rinkeby supply after lock :>> ',
        formatUnits(await tokenRinkeby.balanceOf(sender)),
      )
      console.log('Listening for Lock and Unlock events...')
    },
  )

  bridgeRopsten.on(
    'Unlock',
    async (sender, receiver, value, timestamp, blockNumber) => {
      const checkRinkebyBalanceOfBeforeSync = await bridgeRinkeby.getBalanceOfOwner(
        receiver,
      )
      const diff = checkRinkebyBalanceOfBeforeSync.sub(value)
      const syncTxRinkeby = await bridgeRinkeby.setBalanceOfOwnerWithValue(
        receiver,
        diff,
      )
      await syncTxRinkeby.wait()

      console.log(
        'Bridge Ropsten supply after unlock :>> ',
        formatUnits(await tokenRopsten.balanceOf(addressBridgeRopsten)),
      )
      console.log(
        'Bridge Rinkeby supply after unlock :>> ',
        formatUnits(await tokenRinkeby.balanceOf(addressBridgeRinkeby)),
      )
      console.log(
        'Wallet Ropsten supply after lock :>> ',
        formatUnits(await tokenRopsten.balanceOf(receiver)),
      )
      console.log(
        'Wallet Rinkeby supply after lock :>> ',
        formatUnits(await tokenRinkeby.balanceOf(receiver)),
      )
      console.log('Listening for Lock and Unlock events...')
    },
  )
  console.log('Listening for Lock and Unlock events...')
}
main()

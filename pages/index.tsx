import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import Link from "next/link";
import Account from "../components/Account";
import NativeCurrencyBalance from "../components/NativeCurrencyBalance";
import TokenBalance from "../components/TokenBalance";
import Bridge from "../components/Bridge";
import { TOKEN_ADDRESS_ROPSTEN, BRIDGE_ADDRESS_ROPSTEN, TOKEN_ADDRESS_RINKEBY, BRIDGE_ADDRESS_RINKEBY } from "../constants";
import useEagerConnect from "../hooks/useEagerConnect";
import { formatEtherscanLink } from "../util";
import { useState } from "react";
import { TransactionHistory } from "../components/TransactionHistory";
import Loader from "../components/Loader";

function Home() {
  const { account, library, chainId } = useWeb3React();
  const triedToEagerConnect = useEagerConnect();
  const [showTxHistory, setShowTxHistory] = useState<boolean | undefined>(false);
  const [loadingHasFinished, setLoadingHasFinished] = useState<boolean | undefined>(false);
  const [forTx, setForTx] = useState<boolean | undefined>(false);
  const [txHash, setTxHash] = useState<string | undefined>("");
  const isConnected = typeof account === "string" && !!library;
  const currentNetworkEtherscanLink = formatEtherscanLink("Account", [chainId, account]);
  const currentNetwork: string = formatEtherscanLink("Account", [chainId, account]).slice(8, 15);
  const loadingTxsHasFinished = (hasFinished: boolean) => {
    setLoadingHasFinished(hasFinished)
  }

  const passTxHash = (txHash: string) => {
    setTxHash(txHash);
  }

  return (
    <div>
      <Head>
        <title>Ropsten to Rinkeby TKN Bridge</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <nav>
          <Link href="/">
            <a>Bridge</a>
          </Link>
          <Account triedToEagerConnect={triedToEagerConnect} />
        </nav>
      </header>
      <main>
        {isConnected ?
          <h1>Welcome to <a target="_blank" rel="noreferrer" href={`${currentNetworkEtherscanLink}`}>{` ${currentNetwork} `} Bridge Contract</a></h1>
          :
          <h1>Please connect a wallet in order to use this Bridge Contract ...</h1>
        }
        {isConnected && currentNetwork === "ropsten" &&
          (<section>
            <p> Current network : {currentNetwork}</p>
            <NativeCurrencyBalance />
            <TokenBalance tokenAddress={TOKEN_ADDRESS_ROPSTEN} symbol="TKN" />
            <Bridge contractAddress={BRIDGE_ADDRESS_ROPSTEN} passTxHash={passTxHash}/>
          </section>)
        }
        {isConnected && currentNetwork === "rinkeby" && (
          <section>
            <p> Current network : {currentNetwork}</p>
            <NativeCurrencyBalance />
            <TokenBalance tokenAddress={TOKEN_ADDRESS_RINKEBY} symbol="TKN" />
            <Bridge contractAddress={BRIDGE_ADDRESS_RINKEBY} passTxHash={passTxHash}/>
          </section>
        )
        }
        {!showTxHistory ?
          <button onClick={() => { setShowTxHistory(true); setForTx(true) }}>show Tx History</button>
          :
          <>
            {!loadingHasFinished ?
              <Loader forTx={forTx} />
              :
              <button onClick={() => { setShowTxHistory(false); setLoadingHasFinished(false) }}>hide Tx History </button>
            }
          </>
        }
        {showTxHistory && <TransactionHistory loadingTxsHasFinished={loadingTxsHasFinished} txHash={txHash}/>}
      </main>
      <style jsx>{`
        nav {
          display: flex;
          justify-content: space-between;
        }

        main {
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default Home;

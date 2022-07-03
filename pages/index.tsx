import { useWeb3React } from "@web3-react/core";
import Head from "next/head";
import Account from "../components/Account";
import Bridge from "../components/Bridge";
import useEagerConnect from "../hooks/useEagerConnect";
import { formatEtherscanLink } from "../util";
import { BRIDGE_ADDRESS_ROPSTEN, BRIDGE_ADDRESS_RINKEBY } from "../constants";
import { useState } from "react";

function Home() {
  const { account, library, chainId } = useWeb3React();
  const triedToEagerConnect = useEagerConnect();
  const isConnected = typeof account === "string" && !!library;
  const currentNetwork: string = formatEtherscanLink("Account", [chainId, account]).slice(8, 15);
  const [errorMessage, setErrorMessage] = useState<string | undefined>('');

  const sendExternalErrorMessage =  function (err: string) {
    setErrorMessage(err)
  }

  return (
    <div id="root">
      <Head>
        <title>ΞTHER⇔₱ORTΞR</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <nav>
          <span>ΞTHER⇔₱ORTΞR</span>
          <div className="dummy"></div>
          <Account triedToEagerConnect={triedToEagerConnect} sendExternalErrorMessage={sendExternalErrorMessage}/>
        </nav>
      </header>
      <main>
        {isConnected ?
          <>
            {isConnected && currentNetwork === "ropsten" &&
              <Bridge contractAddress={BRIDGE_ADDRESS_ROPSTEN} err={errorMessage} />
            }
            {isConnected && currentNetwork === "rinkeby" &&
              <Bridge contractAddress={BRIDGE_ADDRESS_RINKEBY} err={errorMessage} />
            }
          </>
          :
          <h1>Please connect a wallet in order to use ΞTHER⇔₱ORTΞR</h1>
        }
        {currentNetwork.startsWith("e") &&
          <h1>Product in Beta: Please connect to Rinkeby or Ropsten in order to use ΞTHER⇔₱ORTΞR</h1>
        }
      </main>
      <style jsx>{`

        nav {
          display: flex;
          justify-content: space-between;
          height: 60px;
        }
        
        nav span {
          font-family: "Styrene A Web", Arial, -apple-system, "Segoe UI", Helvetica, sans-serif;
          object-fit: contain;
          color: #FF7E3E;
          font-style: italic;
          margin-left: 3vw;
          text-transform: uppercase;
          line-height: 55px;
          font-size: 20px;
        }

        main {
          text-align: center;
        }

        div#root{
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100vh;
          overflow-y: hidden;
          background: rgb(37,106,184);
          background: radial-gradient(circle, rgba(37,106,184,1) 0%, rgba(25,30,35,1) 0%, rgba(21,30,41,1) 44%, rgba(21,30,41,1) 55%, rgba(23,34,48,1) 65%, rgba(28,47,69,1) 78%, rgba(28,47,69,1) 90%);
        }

        header {
          transition: margin 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms, width 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms;
          background: rgb(37,106,184);
          background: radial-gradient(circle, rgba(37,106,184,1) 0%, rgba(25,30,35,1) 0%, rgba(22,30,39,1) 28%, rgba(21,30,41,1) 46%, rgba(21,30,41,1) 55%, rgba(23,34,48,1) 65%, rgba(28,47,69,1) 78%, rgba(28,47,69,1) 90%);
        }

        .dummy {
          -webkit-box-flex: 1;
          flex-grow: 1;
        }
      `}</style>
    </div>
  );
}

export default Home;

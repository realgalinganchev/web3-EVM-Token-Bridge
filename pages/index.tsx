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
import { useEffect, useState } from "react";

type IBalanceOf = {
  address: string,
  balance: number
};

function Home() {
  const { account, library, chainId } = useWeb3React();

  const triedToEagerConnect = useEagerConnect();

  const isConnected = typeof account === "string" && !!library;
  const currentNetworkEtherscanLink = formatEtherscanLink("Account", [chainId, account]);
  const currentNetwork: string = formatEtherscanLink("Account", [chainId, account]).slice(8, 15);
  const [syncBalancesOf, setSyncBalancesOf] = useState<[IBalanceOf] | undefined>([] as any);


  useEffect(() => {
    console.log(syncBalancesOf);
  })

  const updateSyncBalancesOf = async function (balances: [IBalanceOf]) {
    setSyncBalancesOf(balances);
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
          <h1>
            Welcome to
            <a target="_blank" rel="noreferrer" href={`${currentNetworkEtherscanLink}`}>
              {` ${currentNetwork} `} Bridge Contract
            </a>
          </h1>
          :
          <h1>
            Please connect a wallet in order to use this Bridge Contract ...
          </h1>
        }
        {isConnected && currentNetwork === "ropsten" &&

          (<section>
            <p> Current network : {currentNetwork}</p>
            <NativeCurrencyBalance />
            <TokenBalance tokenAddress={TOKEN_ADDRESS_ROPSTEN} symbol="TKN" />
            <Bridge contractAddress={BRIDGE_ADDRESS_ROPSTEN} syncBalancesOf={syncBalancesOf} updateSyncBalancesOf={updateSyncBalancesOf} />
          </section>)
        }
        {isConnected && currentNetwork === "rinkeby" && (
          <section>
            <p> Current network : {currentNetwork}</p>
            <NativeCurrencyBalance />
            <TokenBalance tokenAddress={TOKEN_ADDRESS_RINKEBY} symbol="TKN" />
            <Bridge contractAddress={BRIDGE_ADDRESS_RINKEBY} syncBalancesOf={syncBalancesOf} updateSyncBalancesOf={updateSyncBalancesOf} />
          </section>
        )
        }
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

import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useRef, useState } from "react";
import { signERC2612Permit } from "eth-permit";
import { formatEtherscanLink } from "../util";
import { parseEther } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import axios from "axios";
import useBridgeContract from "../hooks/useBridgeContract";
import Loader from "./Loader";
import { TOKEN_ADDRESS_RINKEBY, BRIDGE_ADDRESS_ROPSTEN, BRIDGE_ADDRESS_RINKEBY, TOKEN_ADDRESS_ROPSTEN } from "../constants";


type IBridgeContract = {
  contractAddress: string;
  passTxHash: (txHash: string) => void;
};

const Bridge = ({ contractAddress, passTxHash }: IBridgeContract) => {
  const { account, library, chainId } = useWeb3React<Web3Provider>();
  const bridgeContract = useBridgeContract(contractAddress);
  const [isLoading, setIsLoading] = useState<boolean | undefined>(false);
  const [txHash, setTxHash] = useState<string | undefined>("");
  const [txAmount, setTxAmount] = useState<BigNumber | undefined>(BigNumber.from(0));
  const [errorMessage, setErrorMessage] = useState<string | undefined>('');
  const amountRef = useRef<HTMLInputElement | undefined>(null);
  const currentNetwork: string = formatEtherscanLink("Account", [chainId, account]).slice(8, 15);

  const token = "$2b$10$sdKpbNf7n/UgK4PIONrK6.Kwgp6DOZ6WZB103YCgfzEboDOleD/Yu";
  const axiosHeaders = {
    headers: {
      'X-Master-Key': token
    }
  };



  const fetchLatestBinUrl = (txHash: string) => {

    try {
      const fetchData = async () => {
        const getUrlAll = "https://api.jsonbin.io/v3/c/uncategorized/bins";
        // const getUrlSingle = `https://api.jsonbin.io/v3/b/${r.record}/latest`;
        // const updateUrlSingle = `https://api.jsonbin.io/v3/b/${r.record}`;
        let latestBinUrl: string = "";
        // Make first two requests
        // const [firstResponse, secondResponse] = await Promise.all([
        await axios
          .get(getUrlAll, axiosHeaders)
          .then(response =>
            response.data.map((r: { record: any; }) =>
              console.log('latestBinUrl :>> ', `https://api.jsonbin.io/v3/b/${r.record}`)));
        //axios.get(getUrlSingle, axiosHeaders)
        //axios.put(updateUrlSingle, data, axiosHeaders);
        // ]);

        // console.log("firstResponse.data:", firstResponse.data)
        // console.log("secondResponse.data:", secondResponse.data)
        // const thirdResponse = await axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=place_id:' + firstResponse.data.results.place_id + '&destination=place_id:' + secondResponse.data.results.place_id + '&key=' + 'API-KEY-HIDDEN');

      }
      fetchData();
    }
    catch (err) {
      console.log(err)
    }

  }
  // eslint-disable-next-line react-hooks/exhaustive-deps


  //     // Make third request using responses from the first two

  //     // Update state once with all 3 responses
  //     this.setState({
  //       p1Location: firstResponse.data,
  //       p2Location: secondResponse.data,
  //       route: thirdResponse.data,
  //     });

  //     axios
  //       .get(getUrl, axiosHeaders)
  //       .then(response =>
  //         setBinIdUrls(response.data.map((r: { record: any; }) => `https://api.jsonbin.io/v3/b/${r.record}/latest`)));
  //   }
  //   if (binIdUrls.length > 0) {
  //     binIdUrls.forEach(async (currBinId, id) => {
  //       await axios
  //         .get(currBinId, axiosHeaders)
  //         .then(response =>
  //           setTransactionHistory(transactionHistory => [...transactionHistory, response.data.record]))
  //         .catch(err => err);
  //     })
  //   }
  //   console.log(transactionHistory.sort(function (b, a) {
  //     return a.timestamp.localeCompare(b.timestamp)[0];
  //   }))
  // }, [])



  const displayErrorReason = (err: any) => {
    if (err.error) {
      setErrorMessage(err.error.message.slice(20));
      setTimeout(() => {
        setErrorMessage('')
      }, 3000);
    } else if (err.message) {
      setErrorMessage(err.message);
      setTimeout(() => {
        setErrorMessage('')
      }, 3000);
    }
    setIsLoading(false);
  }

  const sendTokensToTargetChain = async function (tokenOriginAddress: string, bridgeOriginAddress: string) {
    const lockValue = parseEther(amountRef?.current?.value);
    if (typeof window.ethereum !== 'undefined') {
      try {
        const permit = await signERC2612Permit(
          window.ethereum,
          tokenOriginAddress,
          account,
          bridgeOriginAddress,
          lockValue.toString()
        );
        const lockTx = await bridgeContract.lock(
          lockValue,
          permit.deadline,
          permit.v,
          permit.r,
          permit.s
        );
        setIsLoading(true);
        setTxHash(lockTx.hash);
        fetchLatestBinUrl(lockTx.hash)
        passTxHash(lockTx.hash)
        setTxAmount(lockValue);
        await lockTx.wait();
        amountRef.current.value = '';
        setIsLoading(false);
      } catch (err) {
        displayErrorReason(err);
      }
    }
  }

  const unlockTokensOnTargetChain = async function () {
    const unlockValue = parseEther(amountRef?.current?.value);

    if (typeof window.ethereum !== 'undefined') {
      try {
        const unlockTx = await bridgeContract.unlock(unlockValue);
        setIsLoading(true);
        setTxHash(unlockTx.hash);
        passTxHash(unlockTx.hash)
        setTxAmount(unlockValue);
        await unlockTx.wait();
        amountRef.current.value = '';
        setIsLoading(false);
      } catch (err) {
        displayErrorReason(err);
      }
    }

  }

  return (
    <div className="form">
      <div>
        {currentNetwork === "ropsten" ?
          <section>
            <div className="bridge-value">
              <span>ropsten-TKN</span>
              <input ref={amountRef} type="text" id="price" placeholder="0.00" />
            </div>
            <div className="flex">
              <button onClick={() => sendTokensToTargetChain(TOKEN_ADDRESS_ROPSTEN, BRIDGE_ADDRESS_ROPSTEN)}>Bridge to rinkeby</button>
              <button onClick={() => unlockTokensOnTargetChain()}>Unlock tokens on ropsten</button>
            </div>

          </section>
          :
          <section>
            <div className="bridge-value">
              <span>rinkeby-TKN</span>
              <input ref={amountRef} type="text" id="price" placeholder="0.00" />
            </div>
            <div className="flex">
              <button onClick={() => sendTokensToTargetChain(TOKEN_ADDRESS_RINKEBY, BRIDGE_ADDRESS_RINKEBY)}>Bridge to ropsten</button>
              <button onClick={() => unlockTokensOnTargetChain()}>Unlock tokens on rinkeby</button>
            </div>
          </section>
        }
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {isLoading && <Loader txHash={txHash} txAmount={txAmount} currentNetwork={currentNetwork} forTx={false} />}
      <style jsx>{`
        .form {
          display: flex;
          flex-direction: column;
        }

        section {
          display: flex;
          flex-direction: column;
        }

        .bridge-value {
          display: inline-flex;
          margin: 0 auto;
        }

        button {
          width: 200px;
          margin: 0 auto;
        }

        .flex{

        }

        .error-message {
          border: 1px solid;
          margin: 10px auto;
          padding: 15px 10px;
          background-repeat: no-repeat;
          background-position: 10px center;
          max-width: 460px;
          color: #D8000C;
	        background-color: #FFBABA;
        }
      `}</style>
    </div >
  );
};

export default Bridge;

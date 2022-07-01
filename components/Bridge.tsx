import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useRef, useState } from "react";
import { signERC2612Permit } from "eth-permit";
import { formatEtherscanLink } from "../util";
import { parseEther } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import useBridgeContract from "../hooks/useBridgeContract";
import Loader from "./Loader";
import { TOKEN_ADDRESS_RINKEBY, BRIDGE_ADDRESS_ROPSTEN, BRIDGE_ADDRESS_RINKEBY, TOKEN_ADDRESS_ROPSTEN } from "../constants";
import getFormattedArrayOfStructs from "../utils/formatStructToITransaction";
import { ITransaction } from "../interfaces/ITransaction";

type IBridgeContract = {
  contractAddress: string;
};



const Bridge = ({ contractAddress }: IBridgeContract) => {
  const { account, library, chainId } = useWeb3React<Web3Provider>();
  const bridgeContract = useBridgeContract(contractAddress);
  const [isLoading, setIsLoading] = useState<boolean | undefined>(false);
  const [txHash, setTxHash] = useState<string | undefined>("");
  const [txAmount, setTxAmount] = useState<BigNumber | undefined>(BigNumber.from(0));
  const [errorMessage, setErrorMessage] = useState<string | undefined>('');
  const amountRef = useRef<HTMLInputElement | undefined>(null);
  const currentNetwork: string = formatEtherscanLink("Account", [chainId, account]).slice(8, 15);
  const [transactionHistory, setTransactionHistory] = useState<ITransaction[]>([]);

  const token = "$2b$10$sdKpbNf7n/UgK4PIONrK6.Kwgp6DOZ6WZB103YCgfzEboDOleD/Yu";
  const axiosHeaders = {
    headers: {
      'X-Master-Key': token
    }
  };



  useEffect(() => {
    async function fetchData() {
      const arrOfStructs = await bridgeContract.getTransactionHistory()
      const formattedArrOfTxs: any[] = getFormattedArrayOfStructs(arrOfStructs);
      setTransactionHistory(formattedArrOfTxs);
    }
    fetchData();
  }, [])

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

      {
        <div >{transactionHistory && transactionHistory.sort(function (b, a) {
            return a.timestamp.localeCompare(b.timestamp);
          })
          .map((transaction: ITransaction, index: number) => {
            return (
              <div key={index}>
                <div>
                  ...{transaction.sender.substring(transaction.receiver.length - 4)} has
                  triggered {transaction.eventName} for {transaction.value} TKN
                  to ...{transaction.receiver.substring(transaction.receiver.length - 4)} {' '}
                  on {transaction.timestamp}
                </div>
                <div>
                  <a
                    href={"https://rinkeby.etherscan.io/tx/${transaction.txHash}"}
                    target='_blank'
                    rel='noreferrer'
                  >
                    View on Etherscan
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      }
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

import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import { useEffect, useRef, useState } from "react";
import useBridgeContract from "../hooks/useBridgeContract";
import Loader from "./Loader";
import { TOKEN_ADDRESS_RINKEBY, BRIDGE_ADDRESS_ROPSTEN, BRIDGE_ADDRESS_RINKEBY, TOKEN_ADDRESS_ROPSTEN } from "../constants";
import { signERC2612Permit } from "eth-permit";
import { formatEtherscanLink } from "../util";
import { formatEther, formatUnits, parseEther } from "ethers/lib/utils";

type IBalanceOf = {
  address: string,
  balance: number
};


type IBridgeContract = {
  contractAddress: string;
  syncBalancesOf: [IBalanceOf];
  updateSyncBalancesOf: ([IBalanceOf]) => void;
};

const Bridge = ({ contractAddress, syncBalancesOf, updateSyncBalancesOf }: IBridgeContract) => {
  const { account, library, chainId } = useWeb3React<Web3Provider>();
  const bridgeContract = useBridgeContract(contractAddress);
  const [isLoading, setIsLoading] = useState<boolean | undefined>(false);
  const [txHash, setTxHash] = useState<string | undefined>("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>('');
  const amountRef = useRef<HTMLInputElement | undefined>(null);

  useEffect(() => {
    console.log(syncBalancesOf);
  })

  const currentNetwork: string = formatEtherscanLink("Account", [chainId, account]).slice(8, 15);

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
  }

  const sendTokensToTargetChain = async function (tokenOriginAddress: string, bridgeOriginAddress: string) {
    let inputValue = parseInt(amountRef?.current?.value);
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
        await lockTx.wait();
        amountRef.current.value = '';

        const syncBalancesOfIndex = syncBalancesOf.findIndex(e => e.address === account);
        if (syncBalancesOfIndex > -1) {
          syncBalancesOf[syncBalancesOfIndex].balance += inputValue;
          updateSyncBalancesOf(syncBalancesOf);;
        } else {
          syncBalancesOf.push({
            address: account,
            balance: inputValue
          });
        }
        setIsLoading(false);
      } catch (err) {
        displayErrorReason(err);
      }
    }
  }


  const unlockTokensOnTargetChain = async function () {
    let inputValue = parseInt(amountRef?.current?.value);
    const unlockValue = parseEther(amountRef?.current?.value);

    if (typeof window.ethereum !== 'undefined') {
      try {
        const syncBalancesOfIndex = syncBalancesOf.findIndex(e => e.address === account);
        const syncValue = parseEther(syncBalancesOf[syncBalancesOfIndex].balance.toString());
        if (syncBalancesOfIndex > -1) {
          const syncTx = await bridgeContract.changeBalanceOfOwnerWithValue(
            account,
            syncValue,
            true
          );
          setIsLoading(true);
          setTxHash(syncTx.hash);
          await syncTx.wait();
          const getBalanceOfOwnerTx = await bridgeContract.getBalanceOfOwner(account);
          console.log('getBalanceOfOwnerTx :>> ', formatUnits(getBalanceOfOwnerTx));
        }
        else {
          syncBalancesOf.push({
            address: account,
            balance: inputValue
          });
        }
        const getBalanceOfOwnerTx = await bridgeContract.getBalanceOfOwner(account);
        console.log("getBalanceOfOwnerTx :>> ", formatUnits(getBalanceOfOwnerTx));
      } catch (err) {
        displayErrorReason(err);
      }
    }
    if (typeof window.ethereum !== 'undefined') {
      try {

        const unlockTx = await bridgeContract.unlock(unlockValue);
        setIsLoading(true);
        setTxHash(unlockTx.hash);
        await unlockTx.wait();
        const syncBalancesOfIndex = syncBalancesOf.findIndex(e => e.address === account);
        if (syncBalancesOfIndex > -1) {
          syncBalancesOf[syncBalancesOfIndex].balance -= inputValue;
          updateSyncBalancesOf(syncBalancesOf);
        }
        amountRef.current.value = '';
        setIsLoading(false);
      } catch (err) {
        displayErrorReason(err);
      }
    }
    console.log('inputValue :>> ', inputValue);
    console.log('unlockValue :>> ', unlockValue.toString());
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
      {isLoading && <Loader txHash={txHash} currentNetwork={currentNetwork} />}
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

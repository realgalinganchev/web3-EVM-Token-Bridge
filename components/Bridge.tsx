import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { ethers, BigNumber } from "ethers";
import { useEffect, useRef, useState } from "react";
import useBridgeContract from "../hooks/useBridgeContract";
import Loader from "./Loader";
import { TOKEN_ADDRESS_RINKEBY, BRIDGE_ADDRESS_ROPSTEN, BRIDGE_ADDRESS_RINKEBY, TOKEN_ADDRESS_ROPSTEN } from "../constants";
import ERC20_ABI from "../contracts/Token.json";
import { signERC2612Permit } from "eth-permit";
import { formatEtherscanLink } from "../util";
type IBridgeContract = {
  contractAddress: string;
};

const Bridge = ({ contractAddress }: IBridgeContract) => {
  const { account, library, chainId } = useWeb3React<Web3Provider>();
  const bridgeContract = useBridgeContract(contractAddress);
  const [isLoading, setIsLoading] = useState<boolean | undefined>(false);
  const [txHash, setTxHash] = useState<string | undefined>("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>('');
  const amountRef = useRef<HTMLInputElement | undefined>(null);

  const currentNetwork: string = formatEtherscanLink("Account", [chainId, account]).slice(8, 15);
  const displayErrorReason = (err: any) => {
    if (err.error) {
      setErrorMessage(err.error.message.slice(20));
      setTimeout(() => {
        setErrorMessage('')
      }, 3000)
    }
  }

  const unlockTokensOnTargetChain = async function (tokenTargetAddress: string, bridgeTargetAddress: string) {
    const unlockValue = ethers.utils.parseEther(amountRef?.current?.value);
    if (typeof window.ethereum !== 'undefined') {
      try {
        const permit = await signERC2612Permit(
          window.ethereum,
          tokenTargetAddress,
          account,
          bridgeTargetAddress,
          unlockValue.toString()
        )
        const lockTx = await bridgeContract.lock(
          unlockValue,
          permit.deadline,
          permit.v,
          permit.r,
          permit.s
        )
        setIsLoading(true);
        setTxHash(lockTx.hash);
        await lockTx.wait();

        const unlockTx = await bridgeContract.unlock(unlockValue.mul(2).toString());
        setIsLoading(true);
        setTxHash(unlockTx.hash);
        await unlockTx.wait();
        amountRef.current.value = '';
        setIsLoading(false);
      } catch (err) {
        displayErrorReason(err)
      }
    }
  }


  const sendTokensToTargetChain = async function (tokenOriginAddress: string, bridgeOriginAddress: string) {
    const lockValue = ethers.utils.parseEther(amountRef?.current?.value);
    if (typeof window.ethereum !== 'undefined') {

      try {
        const permit = await signERC2612Permit(
          window.ethereum,
          tokenOriginAddress,
          account,
          bridgeOriginAddress,
          lockValue.toString()
        )
        const lockTx = await bridgeContract.lock(
          lockValue,
          permit.deadline,
          permit.v,
          permit.r,
          permit.s
        )
        setIsLoading(true);
        setTxHash(lockTx.hash);
        await lockTx.wait();

        const unlockTxRopsten = await bridgeContract.burn(lockValue.mul(3).toString());
        setIsLoading(true);
        setTxHash(unlockTxRopsten.hash);
        await unlockTxRopsten.wait();
        amountRef.current.value = ''
        setIsLoading(false);
      } catch (err) {
        displayErrorReason(err)
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
              <button onClick={() => unlockTokensOnTargetChain(TOKEN_ADDRESS_ROPSTEN, BRIDGE_ADDRESS_ROPSTEN)}>Unlock tokens on ropsten</button>
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
              <button onClick={() => unlockTokensOnTargetChain(TOKEN_ADDRESS_RINKEBY, BRIDGE_ADDRESS_RINKEBY)}>Unlock tokens on rinkeby</button>
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

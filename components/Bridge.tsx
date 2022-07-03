import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useRef, useState } from "react";
import { signERC2612Permit } from "eth-permit";
import { formatEtherscanLink, formatStructToITransaction } from "../util";
import { parseEther } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import useBridgeContract from "../hooks/useBridgeContract";
import Loader from "./Loader";
import { TOKEN_ADDRESS_RINKEBY, BRIDGE_ADDRESS_ROPSTEN, BRIDGE_ADDRESS_RINKEBY, TOKEN_ADDRESS_ROPSTEN } from "../constants";
import { ITransaction } from "../interfaces/ITransaction";
import { IBridgeContract } from "../interfaces/IBridgeContract";
import TokenBalance from "./TokenBalance";
import { makeStyles } from "@mui/styles";
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const useStyles = makeStyles({
  select: {
    borderRadius: "25%",
    height: "50px",
    color: "#FF7E3E",
    width: "168px !important",
    background: "radial-gradient(circle, rgba(37,106,184,1) 0%, rgba(25,30,35,1) 0%, rgba(21,30,41,1) 44%, rgba(21,30,41,1) 55%, rgba(23,34,48,1) 65%, rgba(28,47,69,1) 78%, rgba(28,47,69,1) 90%)",
    "& .MuiSvgIcon-root": {
      color: "#FF7E3E",
    },
  },
});

const myStyles = {
  menuItem: {
    marginBottom: "10px",
    border: "1px solid rgb(37, 106, 184)",
    display: "flex",
    justifyContent: "center",
    borderRadius: "25%",
    height: "56px",
    color: "#FF7E3E",
    background: "radial-gradient(circle, rgba(37,106,184,1) 0%, rgba(25,30,35,1) 0%, rgba(21,30,41,1) 44%, rgba(21,30,41,1) 55%, rgba(23,34,48,1) 65%, rgba(28,47,69,1) 78%, rgba(28,47,69,1) 90%)",
  },
  select: {
    color: "#FF7E3E",
    border: "1px solid rgb(37, 106, 184)",
    borderRadius: "25%",
    height: "58px",
    width: "168px !important",
  },
} as any;

const Bridge = ({ contractAddress, err }: IBridgeContract) => {
  const amountRef = useRef<HTMLInputElement | undefined>(null);
  const [txHash, setTxHash] = useState<string | undefined>("");
  const [isLoading, setIsLoading] = useState<boolean | undefined>(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>('');
  const [targetNetworkData, setTargetNetworkData] = useState<string[]>(["", ""]);
  const [transactionHistory, setTransactionHistory] = useState<ITransaction[]>([]);
  const [txAmount, setTxAmount] = useState<BigNumber | undefined>(BigNumber.from(0));
  const [showTransactionHistory, setShowTransactionHistory] = useState<boolean | undefined>(false);

  const styles = useStyles();
  const bridgeContract = useBridgeContract(contractAddress);
  const { account, library, chainId } = useWeb3React<Web3Provider>();
  const currentNetwork: string = formatEtherscanLink("Account", [chainId, account]).slice(8, 15);


  const loadTxHistory = async function () {
    const arrOfStructs = await bridgeContract.getTransactionHistory()
    const formattedArrOfTxs: any[] = formatStructToITransaction(arrOfStructs, account);
    setTransactionHistory(formattedArrOfTxs);
    setShowTransactionHistory(true);
  }

  useEffect(() => {
    if (err.length > 0) {
      displayErrorReason(err);
    }
  }, [err]);

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
    } else if (typeof err === 'string') {
      setErrorMessage(err);
      setTimeout(() => {
        setErrorMessage('')
        err = "";
      }, 3000);
    }
    setIsLoading(false);
  }

  const sendTokensToTargetChain = async function (targetNetworkData: string[]) {
    // @ts-ignore
    if (amountRef?.current?.value == 0) {
      displayErrorReason("Please enter an amount to bridge!");
    } else {
      if (typeof window.ethereum !== 'undefined') {
        const lockValue = parseEther(amountRef?.current?.value);
        try {
          const permit = await signERC2612Permit(
            window.ethereum,
            targetNetworkData[0],
            account,
            targetNetworkData[1],
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
          setShowTransactionHistory(false)
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
  }

  const unlockTokensOnTargetChain = async function () {
    // @ts-ignore
    if (amountRef?.current?.value == 0) {
      displayErrorReason("Please enter an amount to unlock!");
    } else {
      if (typeof window.ethereum !== 'undefined') {
        const unlockValue = parseEther(amountRef?.current?.value);
        try {
          const unlockTx = await bridgeContract.unlock(unlockValue);
          setIsLoading(true);
          setShowTransactionHistory(false)
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
  }

  const changeTargetNetwork = async (networkName: string) => {
    switch (networkName) {
      case "ropsten":
        setTargetNetworkData([TOKEN_ADDRESS_RINKEBY, BRIDGE_ADDRESS_RINKEBY]);
        break;

      case "rinkeby":
        setTargetNetworkData([TOKEN_ADDRESS_ROPSTEN, BRIDGE_ADDRESS_ROPSTEN]);
        break;

      default:
        break;
    }
  };

  return (
    <div className="form">
      <div className="wrapper">
        <div className="wrapper">
          <TokenBalance tokenAddress={currentNetwork === "ropsten" ? TOKEN_ADDRESS_ROPSTEN : TOKEN_ADDRESS_RINKEBY} symbol={`${currentNetwork}TKN`} />
          <div className="bridge-value">
            <input ref={amountRef} type="text" id="price" placeholder="0.00" />
            {
              targetNetworkData[0].length != 0 ?
                <button className="active height" disabled={false} onClick={() => sendTokensToTargetChain(targetNetworkData)}>
                  Bridge to
                </button>
                :
                <button className="active" disabled={true} onClick={() => sendTokensToTargetChain(targetNetworkData)}>
                  choose target chain
                </button>
            }
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <Select
                  style={myStyles.select}
                  className={styles.select}
                  value={targetNetworkData[0]}
                >
                  <MenuItem value={TOKEN_ADDRESS_RINKEBY} style={myStyles.menuItem} onClick={() => changeTargetNetwork("ropsten")}>Ropsten</MenuItem>
                  <MenuItem value={TOKEN_ADDRESS_ROPSTEN} style={myStyles.menuItem} onClick={() => changeTargetNetwork("rinkeby")}>Rinkeby</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>
          {isLoading ?
            <div className="loader">
              <Loader txHash={txHash} txAmount={txAmount} currentNetwork={currentNetwork} />
            </div> :
            <>
              <div className="flex">
                <button className="action-button" onClick={() => unlockTokensOnTargetChain()}>Unlock tokens on {currentNetwork}</button>
              </div>
              <div className="flex">
                {!showTransactionHistory ?
                  <button className="action-button" onClick={() => loadTxHistory()}>{"Show Tx History"}</button>
                  :
                  <button className="action-button" onClick={() => setShowTransactionHistory(false)}>{"Hide Tx History"}</button>
                }
              </div>
            </>
          }
        </div>
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {
        showTransactionHistory &&
        <div>{transactionHistory &&
          transactionHistory
            .map((transaction: ITransaction, index: number) => {
              return (
                <div key={index}>
                  <div className="transactions-wrapper">
                    ...{transaction.sender.substring(transaction.sender.length - 4)} has{' '}
                    {transaction.eventName}ed {transaction.value} TKN
                    to ...{transaction.receiver.substring(transaction.receiver.length - 4)} {' '}
                    on {transaction.timestamp}
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
          margin: 0;
          position: absolute;
          top: 48%;   
          left: 50%;
          -ms-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
        }

        .bridge-value {
          display: inline-flex;
          margin: 0 auto;
        }

        button {
          width: 150px;
        }
        
        .wrapper{
          border: 3px solid #FF7E3E;
          border-radius: 16px;
          padding: 100px;
          border-radius: 25%;
          height: 625px;
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
          border-radius: 25%;
          height: 80px;
          align-items: center;
          display: flex;
        }

        .loader {
          position: relative;
          top: 4em;
        }

        .transactions-wrapper{
          font-weight: lighter;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default Bridge;

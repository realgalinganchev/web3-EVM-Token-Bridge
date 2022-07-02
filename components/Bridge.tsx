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
  iconStyle: {
    background: "transparent",
    outline: 0,
    border: 0,
    cursor: "pointer",
    verticalAlign: "middle",
    textAlign: "center",
    overflow: "visible",
    margin: 10,
    color: "#FF7E3E",
    lineHeight: "55px"
  },
  select: {
    borderRadius: "25%",
    height: "50px",
    color: "#FF7E3E",
    width: "12em",
    background: "radial-gradient(circle, rgba(37,106,184,1) 0%, rgba(25,30,35,1) 0%, rgba(21,30,41,1) 44%, rgba(21,30,41,1) 55%, rgba(23,34,48,1) 65%, rgba(28,47,69,1) 78%, rgba(28,47,69,1) 90%)",
  }
});

const myStyles = {
  container: {
    marginRight: "1em",
    lineHeight: "55px"
  },
  button: {
    margin: "0 20px",
    display: "inline",
    border: "1px solid rgb(37, 106, 184)",
    justifyContent: "center",
    borderRadius: "25%",
    height: "50px",
    color: "#FF7E3E",
    width: "12em",
    background: "radial-gradient(circle, rgba(37,106,184,1) 0%, rgba(25,30,35,1) 0%, rgba(21,30,41,1) 44%, rgba(21,30,41,1) 55%, rgba(23,34,48,1) 65%, rgba(28,47,69,1) 78%, rgba(28,47,69,1) 90%)",
  },
  dropdown: {
    color: "#FF7E3E",
  },
  menuItem: {
    marginBottom: "10px",
    border: "1px solid rgb(37, 106, 184)",
    display: "flex",
    justifyContent: "center",
    borderRadius: "25%",
    height: "50px",
    color: "#FF7E3E",
    width: "12em",
    background: "radial-gradient(circle, rgba(37,106,184,1) 0%, rgba(25,30,35,1) 0%, rgba(21,30,41,1) 44%, rgba(21,30,41,1) 55%, rgba(23,34,48,1) 65%, rgba(28,47,69,1) 78%, rgba(28,47,69,1) 90%)",
  },
  inputLabel: {
    color: "#FF7E3E",
  },
  select: {
    color: "#FF7E3E",
    border: "1px solid rgb(37, 106, 184)",
    borderRadius: "25%",
    height: "50px",
    marginTop: "5px"
  },
} as any;

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
  const styles = useStyles();

  useEffect(() => {
    if (isLoading) {
      const fetchData = async () => {
        const arrOfStructs = await bridgeContract.getTransactionHistory()
        const formattedArrOfTxs: any[] = formatStructToITransaction(arrOfStructs);
        setTransactionHistory(formattedArrOfTxs);
      }
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

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

  const [targetNetworkData, setTargetNetworkData] = useState<string[]>(["", ""]);
  const changeTargetNetwork = async (networkName: string) => {

    switch (networkName) {
      case "ropsten":
        setTargetNetworkData([TOKEN_ADDRESS_RINKEBY, BRIDGE_ADDRESS_RINKEBY]);
        console.log('targetNetworkData[0] :>> ', targetNetworkData[0]);
        console.log('targetNetworkData[1] :>> ', targetNetworkData[1]);
        break;

      case "rinkeby":
        setTargetNetworkData([TOKEN_ADDRESS_ROPSTEN, BRIDGE_ADDRESS_ROPSTEN]);
        console.log('targetNetworkData[0] :>> ', targetNetworkData[0]);
        console.log('targetNetworkData[1] :>> ', targetNetworkData[1]);
        break;

      default:
        break;
    }
  };

  return (
    <div className="form">

      <div className="wrapper">
        {currentNetwork === "ropsten" ?
          <div className="wrapper">
            <TokenBalance tokenAddress={TOKEN_ADDRESS_ROPSTEN} symbol={`${currentNetwork}TKN`} />
            <div className="bridge-value">
              <input ref={amountRef} type="text" id="price" placeholder="0.00" />
              <button className="active" disabled={targetNetworkData[0].length === 0} onClick={() => sendTokensToTargetChain(targetNetworkData)}>
                {targetNetworkData[0].length === 0 ? "target chain" : "Bridge to"}
              </button>
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
            <div className="flex">
              <button className="unlock" onClick={() => unlockTokensOnTargetChain()}>Unlock tokens on {currentNetwork}</button>
            </div>
          </div>
          :
          <div className="wrapper">
            <TokenBalance tokenAddress={TOKEN_ADDRESS_RINKEBY} symbol={`${currentNetwork}TKN`} />
            <div className="bridge-value">
              <input ref={amountRef} type="text" id="price" placeholder="0.00" />
              <button className="active" disabled={targetNetworkData[0].length === 0} onClick={() => sendTokensToTargetChain(targetNetworkData)}>
                {targetNetworkData[0].length === 0 ? "target chain" : "Bridge to"}
              </button>
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
            <div className="flex">
              <button className="unlock" onClick={() => unlockTokensOnTargetChain()}>Unlock tokens on {currentNetwork}</button>
            </div>
          </div>
        }
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {isLoading && <Loader txHash={txHash} txAmount={txAmount} currentNetwork={currentNetwork} forTx={false} />}
      {
        <div>{transactionHistory &&
          transactionHistory
            .sort(function (b, a) {
              return a.timestamp.localeCompare(b.timestamp);
            })
            .filter(tx => tx.sender === account || tx.receiver === account)
            .map((transaction: ITransaction, index: number) => {
              return (
                <div key={index}>
                  <div>
                    ...{transaction.sender.substring(transaction.receiver.length - 4)} has
                    triggered {transaction.eventName} for {transaction.value} TKN
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
          top: 50%;
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
          border: 1px solid rgb(97, 97, 97);
          border-radius: 16px;
          padding: 100px;
          color: rgb(37, 106, 184);
          border-radius: 25%;
          height: 625px;
        }

        .wrapper p {
          position: relative;
          bottom: 50px;
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
        }

        input {
          color: rgb(255, 255, 255);
          position: relative;
          font-weight: 500;
          outline: none;
          border: none;
          flex: 1 1 auto;
          background-color: #FF7E3E;
          font-size: 28px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 0px;
          appearance: textfield;
          filter: none;
          opacity: 1;
          transition: opacity 0.2s ease-in-out 0s;
          text-align: left;
          border-radius: 5px;
          padding: 10px;
          width: 6em;
          margin-right: 1em;  
          border: 1px solid white;
        }

        .unlock {
          background-color: #FF7E3E;
          height: 55px;
          margin-right: 50px;
          margin-top: 69px;
          border-radius: 15px;
          color: white;
          font-size: 15px;
          font-style: italic;
          text-transform: uppercase;
          font-weight: bold;
          cursor: pointer;
        }
      `}</style>
    </div >
  );
};

export default Bridge;

import { useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { useEffect, useRef, useState } from "react";
import { injected } from "../connectors";
import useENSName from "../hooks/useENSName";
import useMetaMaskOnboarding from "../hooks/useMetaMaskOnboarding";
import { IAccount } from "../interfaces/IAccount";
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { makeStyles } from "@mui/styles";
import UsbOffTwoToneIcon from '@mui/icons-material/UsbOffTwoTone';
import { shortenHex } from "../util";
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
    cursor: "pointer",
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

const Account = ({ triedToEagerConnect }: IAccount) => {
  const styles = useStyles();
  const { active, error, activate, deactivate, chainId, account, setError } =
    useWeb3React();

  const {
    isMetaMaskInstalled,
    isWeb3Available,
    startOnboarding,
    stopOnboarding,
  } = useMetaMaskOnboarding();

  const handleNetworkSwitch = async (networkName: string) => {
    await changeNetwork({ networkName, setError });
  };

  const networkChanged = (chainId) => {
    console.log({ chainId });
  };

  useEffect(() => {
    (window as any).ethereum.on("chainChanged", networkChanged);

    return () => {
      (window as any).ethereum.removeListener("chainChanged", networkChanged);
    };
  }, []);

  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (active || error) {
      setConnecting(false);
      stopOnboarding();
    }
  }, [active, error, stopOnboarding]);

  const ENSName = useENSName(account);

  if (error) {
    return null;
  }

  if (!triedToEagerConnect) {
    return null;
  }

  if (typeof account !== "string") {
    return (

      <div style={myStyles.container}>

        {isWeb3Available ? (
          <>
            <button
              style={myStyles.button}
              disabled={connecting}
              onClick={() => {
                setConnecting(true);
                activate(injected, undefined, true).catch((error) => {
                  // ignore the error if it's a user rejected request
                  if (error instanceof UserRejectedRequestError) {
                    setConnecting(false);
                  } else {
                    setError(error);
                  }
                });
              }}
            >
              <div>
                {
                  isMetaMaskInstalled ? "Connect Accounts" : "Connect to Wallet"
                }
              </div>
            </button>
          </>
        )
          : (
            <button onClick={startOnboarding}>Install Metamask</button>
          )
        }
      </div>
    );
  }

  const networks = {
    ropsten: {
      chainId: `0x${Number(3).toString(16)}`,
    },
    rinkeby: {
      chainId: `0x${Number(4).toString(16)}`,
    },
    mainnet: {
      chainId: `0x${Number(1).toString(16)}`,
    }
  };
  console.log('account :>> ', account);
  const changeNetwork = async ({ networkName, setError }) => {
    try {
      if (!window.ethereum) throw new Error("No crypto wallet found");
      await (window as any).ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            ...networks[networkName]
          }
        ]
      }).then((txHash) => console.log(txHash))
        .catch((error) => console.error);;
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <span id="account">{account && `${shortenHex(account, 4)}`}</span>
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <Select
            style={myStyles.select}
            className={styles.select}
            value={chainId}
          >
            <MenuItem value={1} style={myStyles.menuItem} onClick={() => handleNetworkSwitch("mainnet")}>ETH Mainnet</MenuItem>
            <MenuItem value={3} style={myStyles.menuItem} onClick={() => handleNetworkSwitch("ropsten")}>Ropsten Testnet</MenuItem>
            <MenuItem value={4} style={myStyles.menuItem} onClick={() => handleNetworkSwitch("rinkeby")}>Rinkeby Testnet</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <div style={myStyles.container}>

        <button
          style={myStyles.button}
          onClick={async () => {
            try {
              await deactivate()
            } catch (e) {
              setError(error);
            }
          }}>
          <UsbOffTwoToneIcon className={styles.iconStyle} />
          Disconnect
        </button>
      </div>
    </>
  );
};

export default Account;


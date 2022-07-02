
  export interface Networks {
    [key: number]: string;
  }
  export const walletConnectSupportedNetworks: Networks = {
    // Add your network rpc URL here
    1: "https://ethereumnode.defiterm.io",
    3: "https://ethereumnode.defiterm-dev.net"
  };

  // Network chain ids
  export const supportedMetamaskNetworks = [1, 3, 4, 5, 42];

  export const BRIDGE_ADDRESS_ROPSTEN = "0xf969fF5332A3655110Bab8FBfd65A04ef262Ed53";
  export const TOKEN_ADDRESS_ROPSTEN = "0x446Db686CA29672a965B21069428AAB3568c8531";

  export const BRIDGE_ADDRESS_RINKEBY = "0xa0dBba5FB027339879f186Bfc40ec78b75C75038";
  export const TOKEN_ADDRESS_RINKEBY = "0xf1cC8dCb10C26a5D43400246b839F3461C9846CC";


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

  export const BRIDGE_ADDRESS_ROPSTEN = "0x51eC649ef387F7942388c2F5FA85Eeb3FD9dcC51";
  export const TOKEN_ADDRESS_ROPSTEN = "0x3b50e4A6003738C1FE6c2f4664587c98Aae6ee6a";

  export const BRIDGE_ADDRESS_RINKEBY = "0x0efd52EC6e5F4A365FCb5c51D2285A058bbd3da1";
  export const TOKEN_ADDRESS_RINKEBY = "0x8Edc3E8129139E5B92A6E2c0150f6Cc2466bDA60"

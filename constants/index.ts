
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

  export const BRIDGE_ADDRESS_ROPSTEN = "0x1f29e1EaF967903A6B1b98424343ce6f89Aa2D7e";
  export const TOKEN_ADDRESS_ROPSTEN = "0xEbA06Dd358756828a04c8c81c50373AeB44b396D";

  export const BRIDGE_ADDRESS_RINKEBY = "0xf8Dd39792CF9A209354C6c0E00357bfA304C24fA";
  export const TOKEN_ADDRESS_RINKEBY = "0x5987905E0d049EF0411BbACA06a05E916E0F9044"

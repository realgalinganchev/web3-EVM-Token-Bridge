
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

  export const BRIDGE_ADDRESS_ROPSTEN = "0xba008B3f0329BB2607791e3C62eaddDBEDb6F5Fa";
  export const TOKEN_ADDRESS_ROPSTEN = "0x7B0BCb0f663a2CD58B660EA1499B4893c62d5c31";

  export const BRIDGE_ADDRESS_RINKEBY = "0xDf6838d961589Ff6D1E472a38F5f7f0E9B793e02";
  export const TOKEN_ADDRESS_RINKEBY = "0xF9AcAaE2EaFA76dE064C184F1fb3699dDf3B99eE"


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

  export const BRIDGE_ADDRESS_ROPSTEN = "0x8687102B1719C53C8cFCC01a9234EdbA194FeAd6";
  export const TOKEN_ADDRESS_ROPSTEN = "0x2b6B5875D0867802a78FA054491e7D7A3a048CFC";

  export const BRIDGE_ADDRESS_RINKEBY = "0xeA1d8A3e92180b5AaF61B89c035D7450f21beb0e";
  export const TOKEN_ADDRESS_RINKEBY = "0xBa3EfCC5A92A9B50E440B54aE18a67a2E927E4e3"

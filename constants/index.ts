
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

  export const BRIDGE_ADDRESS_ROPSTEN = "0x088a466bC7167E168115Bf9c846010Ed6751A459";
  export const TOKEN_ADDRESS_ROPSTEN = "0x151278aeFEB17A85376B10fF475D7B4575D9944e";

  export const BRIDGE_ADDRESS_RINKEBY = "0x44CAaBE26AEe07324Ccd3e06326b4E6c7cB7b579";
  export const TOKEN_ADDRESS_RINKEBY = "0xF7fCa2625cea04f2e550574ff552Efed644e0A2A";




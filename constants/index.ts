
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

  export const BRIDGE_ADDRESS_ROPSTEN = "0xBaE680c5a202701eAcA5C954aC68c333D570F30C";
  export const TOKEN_ADDRESS_ROPSTEN = "0xF00614ba7033e4AfeA7718c79E50ad8bB26471a9";

  export const BRIDGE_ADDRESS_RINKEBY = "0x6Ad41Dc080ACfCa29121026cda4afE955e0Bd60c";
  export const TOKEN_ADDRESS_RINKEBY = "0x83300862B21EE7e9396f550b648Ed18fdF39adDB";


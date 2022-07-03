import { formatUnits } from "@ethersproject/units";

export default function Loader({ ...props }) {

    return (
        <>
            <div>
                <div className="spinner">
                    <p>Tx in progress</p>
                </div>
                <div className="txInfo">
                    <p>The amount being transferred is {formatUnits(props.txAmount)} and the transaction hash is {props.txHash}</p>
                    <a
                        rel="noopener noreferrer nofollow"
                        target="_blank"
                        href={`https://${props.currentNetwork}.etherscan.io/tx/` + props.txHash}>
                        Check out the status live on etherscan!
                    </a>
                </div>
            </div>
            <style jsx>{`
            a {
                background-color: #FF7E3E;
                color: white;
                padding: 15px 25px;
                text-decoration: none;
                border-radius: 10px;
            }  

            .spinner {
                margin: auto;
                border: 20px solid #161E28;
                border-radius: 50%;
                border-top: 20px solid #FF7E3E;
                border-bottom: 20px solid #FF7E3E;
                width: 130px;
                height: 130px;
                animation: spinner 4s linear infinite;
              }

              @keyframes spinner {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }

              .txInfo{
                position: relative;
                top: 4em;
              }

              .txInfo p {
                padding: 0;
                margin: 0;
                font-weight: lighter;
              }

              .txInfo a {
                background-color: #FF7E3E;
                border-bottom-left-radius: 15px;
                border-top-left-radius: 15px;
                color: white;
                font-size: 15px;
                font-style: italic;
                text-transform: uppercase;
                font-weight: bold;
                line-height: 43px;
                cursor: pointer;
                opacity: 0.8;
                box-shadow: 0px 4px 0px #999;
                padding: 8px;
              }

              .txInfo a:hover {
                background: #914925;
              }
            `}</style>
        </>
    );
}


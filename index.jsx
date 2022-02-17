import { run } from "uebersicht";

export const className = `
  position: fixed;
  bottom: 0;
  left: 0;
  width: 400px;
  height: 48px;
  box-sizing: border-box;
  margin: 0 0 5px 10px;
  background-color: rgba(255, 255, 255, 0.4);
  -webkit-backdrop-filter: blur(20px);
  color: #efefef;
  font-family: 'Comfortaa','Skyhook Mono', 'Monoxil', Helvetica Neue;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 13px;
  text-align: justify;
  line-height: 1.5;
  

  h1 {
    font-size: 10px;
    margin: 0 0 0 4px;
  }

  .table-container {
    width: 100%
  }

  .title {
    font-size: 10px;
    width: 50px
    text-align: right;
  }

  .ex-value {
    text-align: left;
    font-weight: bold;
    font-color: #fff
  }

  .ex-date {
    font-size: 10px;
    text-align: left;
    font-weight: bold;
    font-color: #c3c3c3
  }

  .vertical-splitter {
    font-size: 25px;
  }

  .logo {
    width: 40px;
    float: left;
  }

  .credits {
    position: fixed;
    font-size: 8px;
    bottom: 3px;
    left:300px;
    font-family: 'Skyhook';
    color: #c3c3c3
  }
  .offline {
    width: "100%";
    text-align: center;
    font-weight: bold;
    font-color: orange;
    margin: 10px 0 0 0;
  }

  em {
    font-weight: 400;
    font-style: normal;
  }
`;

export const command = `exchange-rates --ex=coopenae`;
// the refresh frequency in milliseconds
export const refreshFrequency = 300000;

// render gets called after the shell command has executed. The command's output
// is passed in as a string.
export const render = ({ output, error }) => {
  let exchange = { statusCode: 0 };
  try {
    exchange = JSON.parse(output).find((i) => i.exchangeCode === "0814");
  } catch (ex) {}
  console.log(exchange);
  return (
    <div>
      {exchange.statusCode !== 200 && (
        <div className="offline">
          <img
            className="logo"
            src="/exchange-rates.widget/assets/coopenae-tiny.png"
            onClick={() => {
              run(
                "open -a Google\\ Chrome.app https://www.coopenaevirtual.fi.cr/Coopenae"
              );
            }}
          />
          <span>Offline </span>
        </div>
      )}
      {exchange.statusCode === 200 && (
        <table className="table-container">
          <tr>
            <td>
              <img
                className="logo"
                src="/exchange-rates.widget/assets/coopenae-tiny.png"
                onClick={() => {
                  run(
                    "open -a Google\\ Chrome.app https://www.coopenaevirtual.fi.cr/Coopenae"
                  );
                }}
              />
            </td>
            <td className="title">Sell:</td>
            <td>
              <span className="ex-value">{exchange?.sell}</span>
            </td>
            <td className="vertical-splitter">|</td>
            <td className="title">Buy:</td>
            <td>
              <span className="ex-value">{exchange?.buy}</span>
            </td>
            <td className="title"></td>
            <td>
              <span className="ex-date">
                {new Date(exchange?.date).toLocaleTimeString("en-US", {
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </td>
          </tr>
        </table>
      )}
      <div className="credits"> exchange-rates @2022</div>
    </div>
  );
};

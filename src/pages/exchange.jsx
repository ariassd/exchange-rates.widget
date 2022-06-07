import { run } from "uebersicht";
import { About } from "./about.jsx";
import { Config } from "../config";

const Exchange = ({ data, bank }) => {
  return (
    <div>
      {data?.statusCode !== 200 && (
        <div className="offline">
          <img
            className="logo"
            src={bank.pict}
            onClick={() => {
              run(`${Config.defaultBrowser} ${bank.web}`);
            }}
          />
          <span>Offline</span>
        </div>
      )}
      {data?.statusCode === 200 && (
        <table className="table-container">
          <tbody>
            <tr>
              <td>
                <img
                  className="logo"
                  src={bank.pict}
                  onClick={() => {
                    run(`${Config.defaultBrowser} ${bank.web}`);
                  }}
                />
              </td>
              <td className="title">Sell:</td>
              <td>
                <span className="ex-value">{data?.sell}</span>
              </td>
              <td className="vertical-splitter">|</td>
              <td className="title">Buy:</td>
              <td>
                <span className="ex-value">{data?.buy}</span>
              </td>
              <td className="title"></td>
              <td>
                <span className="ex-date">
                  {new Date(data?.date).toLocaleTimeString("en-US", {
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      )}
      <About />
    </div>
  );
};

export { Exchange };

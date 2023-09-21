import { React } from "uebersicht";
import { run } from "uebersicht";

import { About } from "./about.jsx";
import { Dropdown } from "../components/dropdown.jsx";
import { Config } from "../config";

const Exchange = ({ data, bank, onBankChange }) => {
  const [selectedBank, setSelectedBank] = React.useState("");
  const handleChange = (e) => {
    setSelectedBank(e.value);
    onBankChange(e.value);
  };

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
                {true && (
                  <Dropdown
                    items={Config.banks
                      .filter((i) => Config.show.includes(i.name))
                      .map((i) => ({
                        id: i.name,
                        value: i.name,
                        image: i.pict,
                      }))}
                    onClick={(val) => handleChange(val)}
                  />
                )}
                <img
                  className="logo"
                  src={bank.pict}
                  onClick={() => {
                    run(`${Config.defaultBrowser} ${bank.web}`);
                  }}
                />

                {false && (
                  <select onChange={(e) => handleChange(e)}>
                    {Config.banks.map((i) => {
                      return (
                        <option
                          key={i.name}
                          value={i.name}
                          defaultValue={bank.name}
                        >
                          {i.shortName}
                        </option>
                      );
                    })}
                  </select>
                )}
              </td>
              <td className="title">Buy:</td>
              <td>
                <span className="ex-value">{data?.buy}</span>
              </td>
              <td className="vertical-splitter">|</td>
              <td className="title">Sell:</td>
              <td>
                <span className="ex-value">{data?.sell}</span>
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

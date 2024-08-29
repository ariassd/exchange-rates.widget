import { React } from 'uebersicht';
import { run, css } from 'uebersicht';

import { About } from './about.jsx';
import { Dropdown } from '../components/dropdown.jsx';
import { Config } from '../config';

const refreshButton = css({
  position: 'absolute',
  right: 0,
  // border: '1px solid #fff',
  with: '20px',
  height: '20px',
  borderRadius: '50px',
});

const Exchange = ({ data, bank, onBankChange, onRefresh }) => {
  const [selectedBank, setSelectedBank] = React.useState('');
  const handleChange = (e) => {
    setSelectedBank(e.value);
    onBankChange(e.value);
  };
  const handleRefresh = (e) => {
    onRefresh();
  };

  return (
    <div>
      <div className={refreshButton} onClick={() => handleRefresh()}>
        <img src="/exchange-rates.widget/assets/refresh.png" width="20px"></img>
      </div>
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
                      <option key={i.name} value={i.name} defaultValue={bank.name}>
                        {i.shortName}
                      </option>
                    );
                  })}
                </select>
              )}
            </td>
            <td className="title">Buy:</td>
            <td>
              <span className="ex-value">{data?.buy || '-'}</span>
            </td>
            <td className="vertical-splitter">|</td>
            <td className="title">Sell:</td>
            <td>
              <span className="ex-value">{data?.sell || '-'}</span>
            </td>
            <td className="title"></td>
            <td>
              <span className="ex-date">
                {new Date(data?.date || new Date()).toLocaleTimeString('en-US', {
                  month: 'short',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <About />
    </div>
  );
};

export { Exchange };

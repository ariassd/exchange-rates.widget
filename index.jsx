import { React, css, run } from 'uebersicht';
import * as ubs from 'uebersicht';
import { Exchange } from './src/pages/exchange.jsx';
import { Config } from './src/config';

export const className = `
  position: fixed;
  bottom: 0;
  left: 0;
  width: 400px;
  height: 50px;
  box-sizing: border-box;
  margin: 0 0 1px 10px;
  background-color: rgba(176, 176, 176, 0.7);
  -webkit-backdrop-filter: blur(20px);
  text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
  color: #fff;
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
    width: 35px;
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

const up = css({
  backgroundColor: 'rgba(18, 255, 18, 0.4) !important',
  width: '400px',
  height: '50px;',
  position: 'fixed',
  borderRadius: '13px',
});
const down = css({
  backgroundColor: 'rgba(250, 57, 57, 0.4) !important',
  width: '400px',
  height: '50px;',
  position: 'fixed',
  borderRadius: '13px',
});
const stable = css({});

const loading = css({
  backgroundColor: 'rgba(0, 253, 8 , 0.9) !important',
  width: '0px',
  height: '5px;',
  position: 'fixed',
  bottom: '5px',
  borderRadius: '50px',
});

var Bank = JSON.parse(localStorage.getItem('selected-bank'));
if (!Bank?.name) {
  Bank = Config.banks.find((i) => i.name === Config.show[0]);
}

// the refresh frequency in milliseconds
export const refreshFrequency = 300000; // 30 seconds
const builtInProxy = 'http://127.0.0.1:41417/';

async function getExchange(bank) {
  return new Promise((resolve, reject) => {
    const requestConfig = {
      method: bank.method?.toLowerCase() || 'get',
      headers: { 'Content-Type': 'application/json' },
      body: undefined,
    };
    fetch(`${builtInProxy}${bank.url}`, requestConfig)
      .then((response) => {
        if (bank.isXml === true) {
          response
            .text((response) => response.text())
            .then((str) => new window.DOMParser().parseFromString(str, 'text/xml'))
            .then((data) => {
              const result = {
                statusCode: 200,
                buy: bank.transformation.buyRate(data),
                sell: bank.transformation.sellRate(data),
                date: bank.transformation.date(data),
              };
              resolve({
                type: 'FETCH_SUCCEDED',
                data: result,
              });
            })
            .catch((e) => {
              reject(`Error getting ${bank.name}: ${e}`);
            });
        } else if (bank.isHtml === true) {
          response
            .text((response) => response.text())
            .then((str) => new window.DOMParser().parseFromString(str, 'text/html'))
            .then((data) => {
              const result = {
                statusCode: 200,
                buy: bank.transformation.buyRate(data),
                sell: bank.transformation.sellRate(data),
                date: bank.transformation.date(data),
              };
              resolve({
                type: 'FETCH_SUCCEDED',
                data: result,
              });
            })
            .catch((e) => {
              reject(`Error getting ${bank.name}: ${e}`);
            });
        } else {
          response
            .json()
            .then((data) => {
              const result = {
                statusCode: 200,
                buy: bank.transformation.buyRate(data),
                sell: bank.transformation.sellRate(data),
                date: bank.transformation.date(data),
              };
              resolve({
                type: 'FETCH_SUCCEDED',
                data: result,
              });
            })
            .catch((e) => {
              reject(`Error getting ${bank.name}: ${e}`);
            });
        }
      })
      .catch((error) => {
        const result = {
          statusCode: 500,
          buy: 0,
          sell: 0,
          date: new Date(),
        };
        resolve({ type: 'FETCH_FAILED', error: error, data: result });
      });
  });
}

// this method will compare results to detect if the value is up or down
function computeDifference() {
  const pos0 = JSON.parse(localStorage.getItem('exchanges-0'));
  const pos1 = JSON.parse(localStorage.getItem('exchanges-1'));

  const defaultBank = pos0.find((i) => i.bank == Bank.name);
  let result = {
    movement: 'stable',
    bank: defaultBank.bank,
    dispatchPayload: defaultBank.dispatchPayload,
  };

  if (pos0 && pos1) {
    for (const element of pos0) {
      const before = pos1.find((i) => i.bank === element.bank);

      if (!before.dispatchPayload || !element.dispatchPayload) {
        continue;
      }

      if (before.dispatchPayload.data.sell > element.dispatchPayload.data.sell) {
        result.bank = element.bank;
        result.dispatchPayload = element.dispatchPayload;
        result.movement = 'down';
        result.message = `Sell pricing is down in '${element.bank}'`;
        break;
      }
      if (before.dispatchPayload.data.sell < element.dispatchPayload.data.sell) {
        result.bank = element.bank;
        result.dispatchPayload = element.dispatchPayload;
        result.movement = 'up';
        result.message = `Sell pricing is up in '${element.bank}'`;
        break;
      }
    }
  }
  return result;
}

function refreshWidget() {
  // prettier-ignore
  run(`osascript -e 'tell application id "tracesOf.Uebersicht" to refresh widget id "exchange-rates-widget-index-jsx"'`);
  // Try this later
  // fetch('http://127.0.0.1:41416/refresh-widget?id=exchange-rates-widget-index-jsx')
}

// this should be called command to be executed automatically
export const command = async (dispatch) => {
  const storeData = [];
  console.log('...loading values');
  let position = 0;
  for (const bk of Config.banks) {
    position++;
    dispatch({
      type: 'PROGRESS_BAR',
      progress: Number.parseInt((position / Config.banks.length) * 100),
    });
    try {
      const ex = await getExchange(bk);
      storeData.push({ bank: bk.name, dispatchPayload: ex });
    } catch (e) {
      console.log(bk.name, e);
      storeData.push({ bank: bk.name, dispatchPayload: undefined });
    }
  }

  console.log('...values loaded');
  localStorage.setItem('exchanges-2', localStorage.getItem('exchanges-1'));
  localStorage.setItem('exchanges-1', localStorage.getItem('exchanges-0'));
  localStorage.setItem('exchanges-0', JSON.stringify(storeData));

  const priceMovement = computeDifference();
  const displayed = { ...priceMovement.dispatchPayload, priceMovement };

  dispatch({ type: 'PROGRESS_BAR', progress: 0 });

  dispatch(displayed);
};

export const changeDisplayBank = async () => {
  const priceMovement = computeDifference();
  const displayed = { ...priceMovement.dispatchPayload, priceMovement };
  return displayed;
};

// This is the reducer, the name should be updateState
export const updateState = (event, previousState) => {
  switch (event.type) {
    case 'FETCH_SUCCEDED':
      return { ...previousState, data: event.data, priceMovement: event.priceMovement };
    case 'FETCH_FAILED':
      return { ...previousState, data: event.data };
    case 'PROGRESS_BAR':
      return { ...previousState, progress: event.progress };
    default: {
      return previousState;
    }
  }
};

const Main = (props) => {
  const [state, dispatch] = React.useReducer(updateState, { output: {} });
  const [selectedBank, setSelectedBank] = React.useState(Bank);
  const [data, setData] = React.useState();
  const [progressBar, setProgressBar] = React.useState('0%');
  const [priceMovementClassName, setPriceMovementClassName] = React.useState(stable);

  React.useEffect(() => {
    setProgressBar(`${props.progress}%`);
  }, [props.progress]);

  React.useEffect(() => {
    changeDisplayBank().then((data) => {
      setData(data.data);
      setPriceMovementClassName(stable);
      if (data?.priceMovement?.movement == 'up') {
        setPriceMovementClassName(up);
      }
      if (data?.priceMovement?.movement == 'down') {
        setPriceMovementClassName(down);
      }
    });
  }, [selectedBank]);

  React.useEffect(() => {
    setData(props.data?.data);
  }, [props.data?.data]);

  const onBankChangeHandler = (bank) => {
    Bank = Config.banks.find((i) => i.name === bank);
    localStorage.setItem('selected-bank', JSON.stringify(Bank));
    setSelectedBank(Bank);
  };

  const onRefresh = async () => {
    // window.location.reload(); // <- reload all widgets
    refreshWidget();
  };

  return (
    <div className={priceMovementClassName}>
      <Exchange
        data={data}
        bank={selectedBank}
        onBankChange={onBankChangeHandler}
        onRefresh={onRefresh}
      />
      <div className={loading} style={{ width: progressBar }}></div>
    </div>
  );
};

const render = (payload) => {
  return <Main {...payload} />;
};

export { render };

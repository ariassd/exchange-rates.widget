import { React } from "uebersicht";
import { Exchange } from "./src/pages/exchange.jsx";
import { Config } from "./src/config";
import { css } from 'uebersicht'

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
  backgroundColor: "rgba(18, 255, 18, 0.4) !important",
  width: '400px',
  height: '50px;',
  position: 'fixed',
  borderRadius: '13px'
});
const down = css({
  backgroundColor: "rgba(250, 57, 57, 0.4) !important",
  width: '400px',
  height: '50px;',
  position: 'fixed',
  borderRadius: '13px'
});
const stable = css({});


var Bank = Config.banks.find((i) => i.name === Config.show[0]);

// the refresh frequency in milliseconds
export const refreshFrequency = 300000;
const builtInProxy = "http://127.0.0.1:41417/";

export const command2 = async (dispatch) => {

  const storeData = []
  // const ex = await getExchange(Bank);
  // dispatch(ex);

  // storeData.push({ bank: bk.name, values: ex });
  // console.log(ex)


  // const priceMovement = computeDifference();
  // console.log(priceMovement);

  // return

  localStorage.setItem("exchanges-2", localStorage.getItem('exchanges-1'));
  localStorage.setItem("exchanges-1", localStorage.getItem('exchanges-0'));
  localStorage.setItem("exchanges-0", null);

  let displayed = undefined;

  for (const bk of Config.banks) {
    try {
      // console.log(bk.name)
      const ex = await getExchange(bk);
      // const ex = await getExchange(Bank);
      storeData.push({ bank: bk.name, values: ex.data });
      if (bk.name == Bank.name) {
        displayed = ex;
        
      }
    } catch (e) {
      console.log(bk.name, e);
    }
  }
  localStorage.setItem("exchanges-0", JSON.stringify(storeData));

  const priceMovement = computeDifference();
  displayed = { ...displayed, priceMovement }
  
  //  console.log('displayed', displayed)

  dispatch(displayed);

  // this method will compare results to detect if the value is up or down
  function computeDifference() {
    const pos0 = JSON.parse(localStorage.getItem('exchanges-0'));
    const pos1 = JSON.parse(localStorage.getItem('exchanges-1'));

    let result = {
      movement: "stable",
      bank: ""
    }
  
    if (pos0 && pos1) {
      for (const element of pos0) {
        // console.log(element.bank)
        const before = pos1.find(i => i.bank === element.bank);
        if (before.values.sell > element.values.sell) {
          result = {
            movement: "down",
            message: `Sell pricing is down in '${element.bank}'`,
            bank: element.bank
          }
          break;
        }
        if (before.values.sell < element.values.sell) {
          result = {
            movement: "up",
            message: `Sell pricing is up in '${element.bank}'`,
            bank: element.bank
          }
          break;
        }
      }
    }
    return result;
  }

  async function getExchange(bank) {
    return new Promise((resolve, reject) => {
      const requestConfig = {
        method: bank.method?.toLowerCase() || "get",
        headers: { 'Content-Type': 'application/json' },
        body: undefined
      };
      // console.log(requestConfig)
      fetch(`${builtInProxy}${bank.url}`, requestConfig)
        .then((response) => {
            if (bank.isXml === true) {
              response
                .text((response) => response.text())
                .then((str) =>
                  new window.DOMParser().parseFromString(str, "text/xml")
                )
                .then((data) => {
                  const result = {
                    statusCode: 200,
                    buy: bank.transformation.buyRate(data),
                    sell: bank.transformation.sellRate(data),
                    date: bank.transformation.date(data),
                  };
                  resolve({
                    type: "FETCH_SUCCEDED",
                    data: result,
                  });
                });
            } else if (bank.isHtml === true) {
              response.text((response) => response.text())
                .then((str) =>
                  new window.DOMParser().parseFromString(str, "text/html")
                )
                .then((data) => {
                  const result = {
                    statusCode: 200,
                    buy: bank.transformation.buyRate(data),
                    sell: bank.transformation.sellRate(data),
                    date: bank.transformation.date(data),
                  };
                  resolve({
                    type: "FETCH_SUCCEDED",
                    data: result,
                  });
                });
            } else {
              response.json().then((data) => {
                // console.log('HRE', data)
                const result = {
                  statusCode: 200,
                  buy: bank.transformation.buyRate(data),
                  sell: bank.transformation.sellRate(data),
                  date: bank.transformation.date(data),
                };
                resolve({
                  type: "FETCH_SUCCEDED",
                  data: result,
                });
              }).catch(e => {
                console.log("Error", e);
              });

            }
        }).catch((error) => {
          const result = {
            statusCode: 500,
            buy: 0,
            sell: 0,
            date: new Date(),
          };
          resolve({ type: "FETCH_FAILED", error: error,  data: result })
        });
    })
    
  }


};

export const updateState = (event, previousState) => {
  switch (event.type) {
    case "FETCH_SUCCEDED":
      return { ...previousState, data: event.data, priceMovement: event.priceMovement };
    case "FETCH_FAILED":
      return { ...previousState, data: event.data };
    default: {
      return previousState;
    }
  }
};

const Main = (input) => {
  const [selectedBank, setSelectedBank] = React.useState(Bank);
  const [data, setData] = React.useState();
  const [priceMovementClassName, setPriceMovementClassName] = React.useState(stable);


  // React.useEffect(() => {
  //   setSelectedBank(Bank);
  // }, []);
  React.useEffect(() => {
    command2((data) => {
      setData(data.data);

      setPriceMovementClassName(stable);
      if (data?.priceMovement?.movement == "up"){
        setPriceMovementClassName(up);
      }
      if (data?.priceMovement?.movement == "down") {
        setPriceMovementClassName(down);
      }
    });
  }, [selectedBank]);

  React.useEffect(() => {
    setData(input.data);
  }, [input]);

  const onBankChangeHandler = (bank) => {
    Bank = Config.banks.find((i) => i.name === bank);
    setSelectedBank(Bank);
  };

  return (
    <div className={ priceMovementClassName }>
      <Exchange
        data={data}
        bank={selectedBank}
        onBankChange={onBankChangeHandler}
      />
    </div>
     
  );
};

const render = ({ data }) => {
  return <Main data={data} />;
};

export { render };

import { React } from "uebersicht";
import { Exchange } from "./src/pages/exchange.jsx";
import { Config } from "./src/config";

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

var Bank = Config.banks.find((i) => i.name === Config.show[0]);

// the refresh frequency in milliseconds
export const refreshFrequency = 300000;
const builtInProxy = "http://127.0.0.1:41417/";

export const command = (dispatch) => {
  fetch(`${builtInProxy}${Bank.url}`)
    .then((response) => {
      if (Bank.isXml === true) {
        response
          .text((response) => response.text())
          .then((str) =>
            new window.DOMParser().parseFromString(str, "text/xml")
          )
          .then((data) => {
            const result = {
              statusCode: 200,
              buy: Bank.transformation.buyRate(data),
              sell: Bank.transformation.sellRate(data),
              date: Bank.transformation.date(data),
            };
            dispatch({
              type: "FETCH_SUCCEDED",
              data: result,
            });
          });
      } else {
        response.json().then((data) => {
          const result = {
            statusCode: 200,
            buy: Bank.transformation.buyRate(data),
            sell: Bank.transformation.sellRate(data),
            date: Bank.transformation.date(data),
          };
          dispatch({
            type: "FETCH_SUCCEDED",
            data: result,
          });
        });
      }
    })
    .catch((error) => {
      dispatch({ type: "FETCH_FAILED", error: error });
    });
};

export const updateState = (event, previousState) => {
  switch (event.type) {
    case "FETCH_SUCCEDED":
      return { ...previousState, data: event.data };
    case "FETCH_FAILED":
      return { ...previousState, data: event.data };
    default: {
      return previousState;
    }
  }
};

const Main = (input) => {
  const [selectedBank, setSelectedBank] = React.useState({});
  const [data, setData] = React.useState();

  React.useEffect(() => {
    setSelectedBank(Bank);
  }, []);
  React.useEffect(() => {
    command((data) => {
      setData(data.data);
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
    <Exchange
      data={data}
      bank={selectedBank}
      onBankChange={onBankChangeHandler}
    />
  );
};

const render = ({ data }) => {
  return <Main data={data} />;
};

export { render };

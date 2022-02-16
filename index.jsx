// This is a simple example Widget to get you started with Übersicht.
// For the full documentation please visit:
// https://github.com/felixhageloh/uebersicht

// You can modify this widget as you see fit, or simply delete this file to
// remove it.

// this is the shell command that gets executed every time this widget refreshes
// export const command = "whoami";
// const refreshFrequency = 1000;

// the CSS style for this widget, written using Emotion
// https://emotion.sh/
export const className = `
  position: fixed;
  bottom: 0;
  left: 0;
  width: 500px;
  height: 48px;
  box-sizing: border-box;
  margin: 0 0 5px 10px;
  background-color: rgba(255, 255, 255, 0.4);
  -webkit-backdrop-filter: blur(20px);
  color: #efefef;
  font-family: Helvetica Neue;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 13px;
  text-align: justify;
  line-height: 1.5;
  

  h1 {
    font-size: 20px;
    margin: 0 0 0 4px;
  }

  .table-container {
    width: 100%
  }

  .title {
    width: 50px
  }

  .text-left {
    text-align: left;
  }

  .logo {
    width: 40px;
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
  const exchange = JSON.parse(output).find((i) => i.exchangeCode === "0814");
  console.log(exchange);
  return (
    <div>
      <table className="table-container">
        <tr>
          <td>
            <img
              className="logo"
              src="/exchange-rates.widget/assets/coopenae-tiny.png"
            />
          </td>
          <td className="title">
            <h1>Sell:</h1>
          </td>
          <td>
            <span className="text-left">{exchange?.sell}</span>
          </td>
          <td className="title">
            <h1>Buy:</h1>
          </td>
          <td>{exchange?.buy}</td>
          <td className="title">
            <h1>Date:</h1>
          </td>
          <td>
            {new Date(exchange?.date).toLocaleTimeString("en-US", {
              month: "short",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </td>
        </tr>
      </table>
    </div>
  );
};

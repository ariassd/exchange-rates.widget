import { React } from "uebersicht";
import { css } from "uebersicht";

const dropbtn = css({
  backgroundColor: "transparent",
  color: "white",
  //padding: "16px",
  //fontSize: "16px",
  bottom: "3px",
  left: "-10px",
  position: "absolute",
  border: "none",
  cursor: "pointer",
});

const dropdown = css({
  position: "relative",
  display: "inline-block",
  "&:hover": {
    //backgroundColor: "#fff",
    ".dropdownContent": {
      display: "block",
    },
    ".dropbtn": {
      backgroundColor: "#e6e6e6",
    },
  },
});

const dropdownContent = css({
  display: "none",
  position: "absolute",
  bottom: "-23px",
  left: "15px",
  height: "46px",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  borderRadius: "13px",
  border: "solid 1px #fff",
  minWidth: "320px",
  boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.7)",
  zIndex: 1,
  a: {
    color: "black",
    padding: "2px",
    textDecoration: "none",
    borderRadius: "50%",
    display: "inline-block",
    "&: hover": {
      backgroundColor: "#000",
    },
  },
  "&: hover": {
    dropbtn: {
      backgroundColor: "#3e8e41",
    },
  },
});

const Dropdown = ({ items, onClick }) => {
  const [selectedBank, setSelectedBank] = React.useState({});
  const [dropdownContentVisible, setDropdownContentVisible] =
    React.useState(false);

  const handleClick = (val) => {
    setSelectedBank(val);
    onClick(val);
    handleShowClose();
  };

  const handleShowClose = () => {
    setDropdownContentVisible(!dropdownContentVisible);
  };

  return (
    <div className={dropdown}>
      <button className={dropbtn} onClick={() => handleShowClose()}>
        ❖
      </button>
      <div
        className={dropdownContent}
        style={dropdownContentVisible ? { display: "block" } : {}}
      >
        {items.map((val, ix) => {
          return (
            <a key={ix} onClick={() => handleClick(val)}>
              <img className="logo" src={val.image} />
            </a>
          );
        })}
      </div>
    </div>
  );
};

export { Dropdown };

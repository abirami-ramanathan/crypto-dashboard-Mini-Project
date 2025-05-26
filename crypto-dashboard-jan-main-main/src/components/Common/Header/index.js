import React, { useEffect, useState } from "react";
import Button from "../Button";
import TemporaryDrawer from "./drawer";
import "./styles.css";
import Switch from "@mui/material/Switch";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Header() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      setDark();
    } else {
      setLight();
    }
  }, []);

  const changeMode = () => {
    if (localStorage.getItem("theme") !== "dark") {
      setDark();
    } else {
      setLight();
    }
    setDarkMode(!darkMode);
    toast.success("Theme Changed!");
  };

  const setDark = () => {
    localStorage.setItem("theme", "dark");
    document.documentElement.setAttribute("data-theme", "dark");
  };

  const setLight = () => {
    localStorage.setItem("theme", "light");
    document.documentElement.setAttribute("data-theme", "light");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="header">
      <h1>
        CryptoTracker<span style={{ color: "var(--blue)" }}>.</span>
      </h1>
      <div className="links">
        <Switch checked={darkMode} onClick={() => changeMode()} />
        {window.location.pathname === "/" ? (
          <div className="links">
            <a href="/dashboard">
              <p className="link">Dashboard</p>
            </a>
          </div>
        ) : window.location.pathname === "/dashboard" ? (
          <div className="links">
            <a href="/">
              <p className="link">Home</p>
            </a>
          </div>
        ) : window.location.pathname !== "/dashboard" && window.location.pathname !== "/" ? (
          <div className="links">
            <a href="/">
              <p className="link">Home</p>
            </a>
            <a href="/dashboard">
              <p className="link">Dashboard</p>
            </a>
          </div>
        ) : null}
        {isAuthenticated() ? (
          <>
            <a href="/compare">
              <p className="link">Compare</p>
            </a>
            <a href="/watchlist">
              <p className="link">Watchlist</p>
            </a>
            <a href="/portfolio">
              <p className="link">Portfolio</p>
            </a>
            <a href="/transactions">
              <p className="link">History</p>
            </a>
            <Button text={"Logout"} onClick={logout} outlined={true} />
          </>
        ) : (
          <Button text={"Login"} onClick={handleLoginClick} />
        )}
      </div>
      <div className="drawer-component">
        <TemporaryDrawer />
      </div>
    </div>
  );
}

export default Header;

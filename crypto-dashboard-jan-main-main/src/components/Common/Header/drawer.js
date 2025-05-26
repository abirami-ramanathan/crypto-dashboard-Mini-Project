import React, { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { IconButton } from "@mui/material";
import Switch from "@mui/material/Switch";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function TemporaryDrawer() {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") == "dark" ? true : false
  );
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("theme") == "dark") {
      setDark();
    } else {
      setLight();
    }
  }, []);

  const changeMode = () => {
    if (localStorage.getItem("theme") != "dark") {
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
    setOpen(false);
    navigate("/login");
  };

  const handleLogout = () => {
    setOpen(false);
    logout();
  };

  return (
    <div>
      <IconButton onClick={() => setOpen(true)}>
        <MenuRoundedIcon className="link" />
      </IconButton>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <div className="drawer-div">
          <a href="/">
            <p className="link">Home</p>
          </a>
          {user ? (
            <>
              <a href="/dashboard">
                <p className="link">Dashboard</p>
              </a>
              <a href="/compare">
                <p className="link">Compare</p>
              </a>
              <a href="/watchlist">
                <p className="link">Watchlist</p>
              </a>
              <a href="/portfolio">
                <p className="link">Portfolio</p>
              </a>
              <p className="link" onClick={handleLogout} style={{ cursor: "pointer" }}>
                Logout
              </p>
            </>
          ) : (
            <p className="link" onClick={handleLoginClick} style={{ cursor: "pointer" }}>
              Login
            </p>
          )}
          <Switch checked={darkMode} onClick={() => changeMode()} />
        </div>
      </Drawer>
    </div>
  );
}

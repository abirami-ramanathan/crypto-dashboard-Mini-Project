import { createTheme, ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Coin from "./pages/Coin";
import Compare from "./pages/Compare";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Portfolio from "./pages/Portfolio";
import Watchlist from "./pages/Watchlist";
import TransactionHistory from "./pages/TransactionHistory";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useRef } from "react";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Signup from "./pages/Signup";

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#3a80e9",
      },
    },
  });

  const cursorRef = useRef(null);
  const cursorPointerRef = useRef(null);

  useEffect(() => {
    const cursor = document.getElementById("cursor");
    const cursorPointer = document.getElementById("cursor-pointer");
    
    if (cursor && cursorPointer) {
      cursorRef.current = cursor;
      cursorPointerRef.current = cursorPointer;
      
      const handleMouseMove = (e) => {
        if (cursorRef.current && cursorPointerRef.current) {
          cursorRef.current.style.left = e.clientX + "px";
          cursorRef.current.style.top = e.clientY + "px";
          cursorPointerRef.current.style.left = e.clientX + "px";
          cursorPointerRef.current.style.top = e.clientY + "px";
        }
      };

      const handleMouseDown = () => {
        if (cursorRef.current && cursorPointerRef.current) {
          cursorRef.current.style.height = "0.5rem";
          cursorRef.current.style.width = "0.5rem";
          cursorPointerRef.current.style.height = "3rem";
          cursorPointerRef.current.style.width = "3rem";
        }
      };

      const handleMouseUp = () => {
        if (cursorRef.current && cursorPointerRef.current) {
          cursorRef.current.style.height = "0.3rem";
          cursorRef.current.style.width = "0.3rem";
          cursorPointerRef.current.style.height = "2rem";
          cursorPointerRef.current.style.width = "2rem";
        }
      };

      document.body.addEventListener("mousemove", handleMouseMove);
      document.body.addEventListener("mousedown", handleMouseDown);
      document.body.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.body.removeEventListener("mousemove", handleMouseMove);
        document.body.removeEventListener("mousedown", handleMouseDown);
        document.body.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, []);

  return (
    <div className="App">
      <div className="cursor" id="cursor" />
      <div className="cursor-pointer" id="cursor-pointer" />
      <ToastContainer />
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/coin/:id"
                element={
                  <ProtectedRoute>
                    <Coin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/compare"
                element={
                  <ProtectedRoute>
                    <Compare />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/watchlist"
                element={
                  <ProtectedRoute>
                    <Watchlist />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portfolio"
                element={
                  <ProtectedRoute>
                    <Portfolio />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transactions"
                element={
                  <ProtectedRoute>
                    <TransactionHistory />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;

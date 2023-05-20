import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import LoginLayoutIndex from "./scenes/Layout/LoginIndex";
import LogoutLayoutIndex from "./scenes/Layout/LogoutIndex";
import AppNavbar from "./scenes/global/AppNavbar";

function App() {
  const [theme, colorMode] = useMode();
  const navigate = useNavigate();

  const handleAuthentication = () => {
    navigate("/");
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app" style={{ height: "fit-content" }}>
          <main className="content" style={{ height: "fit-content" }}>
            {sessionStorage.getItem("token") ? (
              <>
              <AppNavbar/>
                <LoginLayoutIndex />
              </>
            ) : (
              <LogoutLayoutIndex />
            )}
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;

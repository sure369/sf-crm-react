import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { CssBaseline, ThemeProvider, useTheme, createTheme } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import LoginLayoutIndex from "./scenes/Layout/LoginIndex";
import LogoutLayoutIndex from "./scenes/Layout/LogoutIndex";
import AppNavbar from "./scenes/global/AppNavbar";

function App() {


  const themes = useTheme();

  const [selectedColor,setSelectedColor]=useState('')

  const handleChange=(e)=>{
console.log("prop passed from child",e);
  }
  
  
  const [theme, colorMode] = useMode();
  const navigate = useNavigate();
  // const [selectedColor, setSelectedColor] = useState();
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
              <AppNavbar fnfromApp={handleChange}/>
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

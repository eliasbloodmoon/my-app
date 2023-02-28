import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "./scenes/homePage/index";
import LoginPage from "./scenes/loginPage/index";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import UnderConstruction from "./scenes/AdministratorPage";
import UnderConstruction2 from "./scenes/EmployeePage";
import UnderConstruction3 from "./scenes/ManagerPage";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/" />}
            />
            <Route
              path="/admin"
              element={isAuth ? <UnderConstruction /> : <Navigate to="/" />}
            />
            <Route
              path="/employee"
              element={isAuth ? <UnderConstruction2 /> : <Navigate to="/" />}
            />
            <Route
              path="/manager"
              element={isAuth ? <UnderConstruction3 /> : <Navigate to="/" />}
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

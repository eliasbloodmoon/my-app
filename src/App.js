import { HashRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "./scenes/homePage/index";
import LoginPage from "./scenes/loginPage/index";

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import AdminLogin from "./scenes/AdministratorPage";
import EmployeeLogin from "./scenes/EmployeePage";
import ManagerLogin from "./scenes/ManagerPage";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));
  return (
    <div className="app"> 
      <HashRouter>
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
              element={isAuth ? <AdminLogin /> : <Navigate to="/" />}
            />
            <Route
              path="/employee"
              element={isAuth ? <EmployeeLogin /> : <Navigate to="/" />}
            />
            <Route
              path="/manager"
              element={isAuth ? <ManagerLogin /> : <Navigate to="/" />}
            />
          </Routes>
        </ThemeProvider>
      </HashRouter>
    </div>
  );
}

export default App;

import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Sidebar, Menu, MenuItem} from "react-pro-sidebar";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { Switch } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';


function createDataEveryone(name, date, shiftIN, FirstMO, FirstMI, SecondMO, SecondMI, shiftOUT) {
  return { name, date, shiftIN, FirstMO, FirstMI, SecondMO, SecondMI, shiftOUT };
}

const rowsEveryoneDay = [
  createDataEveryone('Adam Tester','Feb 24, 2023', 1000, 1200, 1300, 1500, 1600, 1800),
];

export default function BasicTable() {
  const [mode, setMode] = useState(false)
  const theme = createTheme({
    palette:{
      mode: mode ? "dark" : "light"
    }})

  
  return (
    <ThemeProvider theme={theme}>
<div id="app" style={({ height: "100vh" }, { display: "flex" })}>

      <Sidebar backgroundColor="background.default" style={{ height: "100vh",  }}>
        <Menu>
          <MenuItem
            icon={<MenuOutlinedIcon />}
            style={{ textAlign: "center" }}
          >
            {" "}
            <h2>Admin</h2>
          </MenuItem>

          <MenuItem icon={<HomeOutlinedIcon />}>Home</MenuItem>
          <MenuItem icon={<PeopleOutlinedIcon />}>Team</MenuItem>
          <MenuItem icon={<ReceiptOutlinedIcon />}>Profile</MenuItem>
          <MenuItem icon={<HelpOutlineOutlinedIcon />}>Log Out</MenuItem>
        </Menu>
      </Sidebar>
      <main >

      
        <TableContainer component={Paper} sx={{display: 'block', width: 'auto', height: 'vh100'}}>
        <Box
      display="flex"
      justifyContent="flex-end"
      alignItems="flex-end"
      >
        <Switch onClick={()=>setMode(!mode)} ></Switch>
      </Box>
    <Box
          sx={{
            marginBottom: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        ></Box>
      <Table sx={{ minWidth: '100%', minHeight: '100%', float: 'right', }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Employee Name</TableCell>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Shift Time In</TableCell>
            <TableCell align="right">1st Meal Time Out</TableCell>
            <TableCell align="right">1st Meal Time In</TableCell>
            <TableCell align="right">2nd Meal Time Out</TableCell>
            <TableCell align="right">2nd Meal Time In</TableCell>
            <TableCell align="right">Shift Time Out</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rowsEveryoneDay.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.date}</TableCell>
              <TableCell align="right">{row.shiftIN}</TableCell>
              <TableCell align="right">{row.FirstMO}</TableCell>
              <TableCell align="right">{row.FirstMI}</TableCell>
              <TableCell align="right">{row.SecondMO}</TableCell>
              <TableCell align="right">{row.SecondMI}</TableCell>
              <TableCell align="right">{row.shiftOUT}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
    </TableContainer>

      </main>

    </div>
    </ThemeProvider>
  );
}
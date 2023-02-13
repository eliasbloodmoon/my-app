import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CssBaseline from '@mui/material/CssBaseline';
import ArticleIcon from '@mui/icons-material/Article';
import Divider from '@mui/material/Divider';
import { Switch } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import Typography from '@mui/material/Typography';

const drawerWidth = 240;

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
      <CssBaseline />
      
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>


          <Typography variant="h6" noWrap component="div">
            Permanent drawer
          </Typography>
          <Switch onClick={()=>setMode(!mode)} sx={{display: 'flex-end'}}></Switch>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ArticleIcon />
              </ListItemIcon>
              <ListItemText primary="Day View" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ArticleIcon />
              </ListItemIcon>
              <ListItemText primary="Day View" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
        <TableContainer component={Paper} sx={{display: 'block', width: 'auto', height: 'vh100'}}>
        
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
  </ThemeProvider>
  );
}
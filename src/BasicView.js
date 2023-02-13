import * as React from 'react';
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
import BackupTableIcon from '@mui/icons-material/BackupTable';
import BadgeIcon from '@mui/icons-material/Badge';
import LogoutIcon from '@mui/icons-material/Logout';

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
            Admin View
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
                <BackupTableIcon />
              </ListItemIcon>
              <ListItemText primary="Employee View" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <BadgeIcon />
              </ListItemIcon>
              <ListItemText primary="Edit Employees" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
        
  </ThemeProvider>
  );
}
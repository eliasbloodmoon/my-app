import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ddf from './ddf.png';
import { Switch } from '@mui/material';
import TableView from './BasicView';


export default function SignIn() {

  const [showSignIn, setSShow] = useState(true);
  const [showTableView, setTShow] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
    setSShow(!showSignIn);
    setTShow(!showTableView);
  }
  const [mode, setMode] = useState(false)
  const theme = createTheme({
    palette:{
      mode: mode ? "dark" : "light"
    }})
  

  return (
    <ThemeProvider theme={theme}>
      <Box
      display="flex"
      justifyContent="flex-end"
      alignItems="flex-end"
      >
        <Switch onClick={()=>setMode(!mode)} ></Switch>
      </Box>
      {showSignIn && <Container component="main" maxWidth="xs">  
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
        component="img"
        sx={{
          height: 150,
          width: 400,
          maxHeight: { xs: 150, md: 150 },
          maxWidth: { xs: 400, md: 400 },
        }}
        alt="Digital Dream Forge Logo"
        src={ddf}
      />
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container> }
     {showTableView && <TableView />}
     </ThemeProvider>
  );
}
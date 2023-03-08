import { Box, Button, Typography, useTheme, Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import Navbar from "../navbar/index";
import { DataGrid } from '@mui/x-data-grid';
import { v4 as uuidv4 } from 'uuid';

//Columns for the UserList
const columns = [
  { field: "_id", headerName: "ID", flex: 1},
  { field: "firstName", headerName: "First Name", flex: 1 },
  { field: "lastName", headerName: "Last Name", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "occupation", headerName: "Occupation", flex: 1 },
];

//Layout of the UserList
const UserList = ({ users }) => (
  <Box display="flex" flexDirection="column" marginTop={1}>
    <DataGrid
      rows={users}
      columns={columns}
      pageSize={5}
      rowsPerPageOptions={[5, 10, 20]}
      autoHeight
      rowHeight={45}
      rowId="id"
      columnBuffer={2}
    />
  </Box>
);

/*
  The register new user should be added somewhere here.
  This is the main function. Replaced "Underconstruction"
*/
const AdminLogin = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [occupation, setOccupation] = useState("");

  const onAddUser = async (values, onSubmitProps) => {
    // this allows us to send form info with image
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }

    const savedUserResponse = await fetch(
      "http://frontend.digitaldreamforge.chat:5000/auth/register",
      {
        method: "POST",
        body: formData,
      }
    );
  };
  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newUser = {
      firstName,
      lastName,
      email,
      password,
      occupation,
    };
    onAddUser(newUser);
    setOpen(false);
  };

  const handleRegisterSubmit = async (values, onSubmitProps) => {
    await register(values, onSubmitProps);
  };

  const register = async (values, onSubmitProps) => {
    // this allows us to send form info with image
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }

    const savedUserResponse = await fetch(
      "http://frontend.digitaldreamforge.chat:5000/auth/register",
      {
        method: "POST",
        body: formData,
      }
    );
  };

  //This is where the UserList displays from.
  //It makes a GET request to the /users route from the backend
  useEffect(() => {
  fetch("http://frontend.digitaldreamforge.chat:5000/users")
    .then((response) => response.json())
    .then((data) => {
      // add a unique `id` property to each user object
      const usersWithIds = data.map(user => ({ ...user, id: uuidv4() }));
      setUsers(usersWithIds);
    })
    .catch((error) => console.error(error));
}, []);

  return (
    <Box width="100%">
      <Navbar />
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="red">
          Digital Dream Forge
        </Typography>
      </Box>
      <Box width="100%" p="1rem 6%" textAlign="center" alignItems="center">
        <UserList users={users} />
      </Box>
      <Box display="flex" justifyContent="flex-start" marginBottom={1} paddingLeft={12}>
        <Button variant="contained" onClick={handleClickOpen}>Add User</Button>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <form onSubmit={handleRegisterSubmit}>
            <Box display="flex" flexDirection="column" alignItems="center" marginBottom={2}>
              <TextField label="First name" variant="outlined" value={firstName} onChange={(e) => setFirstName(e.target.value)} margin="normal" required />
              <TextField label="Last name" variant="outlined" value={lastName} onChange={(e) => setLastName(e.target.value)} margin="normal" required />
              <TextField label="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" required />
              <TextField label="Password" variant="outlined" type="password" value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" required />
              <TextField label="Occupation" variant="outlined" value={occupation} onChange={(e) => setOccupation(e.target.value)} margin="normal" required />
              <Button variant="contained" type="submit">Submit</Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminLogin;
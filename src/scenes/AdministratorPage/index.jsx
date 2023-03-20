import { Box, Button, Typography, useTheme, Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import Navbar from "../navbar/index";
import { DataGrid } from '@mui/x-data-grid';
import { v4 as uuidv4 } from 'uuid';

//Columns for the ComandList Command Name Time
const columns = [
  { field: "command", headerName: "Command", flex: 1 },
  { field: "name", headerName: "Name", flex: 1 },
  { field: "time", headerName: "Time", flex: 1 },
];

//Layout of the UserList
const UserList = ({ users }) => {
  const [pageSize, setPageSize] = useState(5);

  const handlePageSizeChange = (params) => {
    setPageSize(params.pageSize);
  };

  return(
  <Box display="flex" flexDirection="column" marginTop={1}>
    <DataGrid
      rows={users}
      columns={columns}
      pageSize={pageSize}
      rowsPerPageOptions={[5, 10, 20]}
      autoHeight
      rowHeight={45}
      rowId="id"
      columnBuffer={2}
      onPageSizeChange={handlePageSizeChange}
    />
  </Box>
);
  };
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
  const [role, setRole] = useState("");  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRegisterSubmit = async () => {
    try{
      const savedUserResponse = await fetch (
        "http://frontend.digitaldreamforge.chat:5000/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json",},
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            role,
          }),
        }
      );
      console.log(role);
      const savedUser = await savedUserResponse.json();
      console.log(savedUser);
      if (savedUser) {setOpen(false);}
    } catch (error) {
      console.error(error);
    }
  };

  //This is where the UserList displays from.
  //It makes a GET request to the /users route from the backend
  useEffect(() => {
  fetch("http://frontend.digitaldreamforge.chat:5000/api/database")
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
              <TextField label="Password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" required />
              <select id="role" name="role" size="1" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value= "">Select a role</option>
                <option value= "Admin">Admin</option>
                <option value="Management">Management</option>
                <option value="Employee">Employee</option>
              </select>
              <Button variant="contained" type="submit">Submit</Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminLogin;
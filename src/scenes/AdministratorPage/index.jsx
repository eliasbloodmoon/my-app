import { Box, Button, Typography, useTheme, Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import Navbar from "../navbar/index";
import { DataGrid } from '@mui/x-data-grid';
import { v4 as uuidv4 } from 'uuid';

//Columns for the ComandList Command Name Time
const commandsColumn = [
  { field: "command", headerName: "Command", flex: 1 },
  { field: "name", headerName: "Name", flex: 1 },
  { field: "time", headerName: "Time", flex: 1 },
];

const usersColumn = [
  { field: "firstName", headerName: "First Name", flex: 1 },
  { field: "lastName", headerName: "Last Name", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "password", headerName: "Password", flex: 1 },
  { field: "role", headerName: "Role", flex: 1 },
];

const CommandList = ({ users }) => {
  const [pageSize, setPageSize] = useState(5);

  const handlePageSizeChange = (params) => {
    setPageSize(params.pageSize);
  };

  return(
  <Box display="flex" flexDirection="column" marginTop={1}>
    <DataGrid
      rows={users}
      columns={commandsColumn}
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
      columns={usersColumn}
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
  const [commands, setCommands] = useState([]);
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");  
  const [changeOpen, setChangeOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("users");
  const [opener, setOpener] = useState(false);
  const [setLastUpdate] = useState(null);
  // Add a loading state to indicate that the data is being fetched
  const [loading, setLoading] = useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeOpen = () => {
    setChangeOpen(true);
  };

  const handleChangeClose = () => {
    setChangeOpen(false);
  };

  const handleClickerOpen = () => {
    setOpener(true);
  };

  const handleClickerClose = () => {
    setOpener(false);
  };

  const handleDeleteChange = async () => {
    try{
      const savedUserResponse = await fetch (
        "http://frontend.digitaldreamforge.chat:5000/users/delete",{
          method: "DELETE",
          headers: { "Content-Type": "application/json",},
          body: JSON.stringify({
            email,
          }),
        }
      );
    }
    catch (error) {
      console.error(error);
    }
  };

  const handlePasswordChange = async () => {
    try{
      const savedUserResponse = await fetch (
        "http://frontend.digitaldreamforge.chat:5000/users/update", {
          method: "PUT",
          headers: { "Content-Type": "application/json",},
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );
    }
    catch (error) {
      console.error(error);
    }
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

  const handlePageToggle = () => {
    setCurrentPage(currentPage === "users" ? "commands" : "users");
  };

  //This is where the UserList displays from.
  //It makes a GET request to the /users route from the backend
  
  const fetchUserData = async () => {
    try {
      const [usersResponse, commandsResponse] = await Promise.all([
        fetch('http://frontend.digitaldreamforge.chat:5000/users'),
        fetch('http://frontend.digitaldreamforge.chat:5000/api/database')
      ]);
      const [usersData, commandsData] = await Promise.all([
        usersResponse.json(),
        commandsResponse.json()
      ]);
      const usersWithIds = usersData.map(user => ({ ...user, id: uuidv4() }));
      const commandsWithIds = commandsData.map(command => ({ ...command, id: uuidv4() }));
      setUsers(usersWithIds);
      setCommands(commandsWithIds);
      setLastUpdate(Date.now()); // Update the lastUpdate state variable
    } catch (error) {
      console.error(error);
    }
  };
  
  // Call the fetchUserData function once when the component mounts
  useEffect(() => {
    fetchUserData();
  }, []);
  
  // Call the fetchUserData function every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      fetchUserData();
    }, 10000);
    return () => clearInterval(timer); // Clear the timer when the component unmounts
  }, []);
  
  
  
  // Modify the useEffect hook to set loading to false when the data is fetched
  useEffect(() => {
    if (users.length > 0 && commands.length > 0) {
      setLoading(false);
    }
  }, [users, commands]);
  
  // Render a loading message while the data is being fetched
  if (loading) {
    return <p>Loading...</p>;
  }

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
      
      <Box display="flex" justifyContent="flex-start" marginBottom={1} paddingLeft={12} paddingRight={12} paddingTop={1}>
        <Button variant="contained" onClick={handlePageToggle} style={{width: '100%'}}>
          {currentPage === "users" ? "Switch to Commands" : "Switch to Employees"}
        </Button>
      </Box>

      {currentPage === "users" ? (
        <UserList users={users} />
      ) : (
        <CommandList users={commands} />
      )}
      <Box display="flex" justifyContent="flex-start" marginBottom={1} paddingLeft={12}>
        <Button variant="contained" onClick={handleClickOpen}>Add Employee</Button>
      </Box>
      <Box display="flex" justifyContent="flex-start" marginBottom={1} paddingLeft={12}>
        <Button variant="contained" onClick={handleClickerOpen}>Delete Employee</Button>
      </Box>
      <Box display="flex" justifyContent="flex-start" marginBottom={1} paddingLeft={12}>
        <Button variant="contained" onClick={handleChangeOpen}>Change Password</Button>
      </Box>
      <Dialog open={open} onClose={handleClose} paddingTop={1}>  
        <DialogTitle>Add Employee</DialogTitle>
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
                <option value= "Management">Management</option>
                <option value= "Employee">Employee</option>
              </select>
              <Button variant="contained" type="submit">Submit</Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={changeOpen} onClose={handleChangeClose}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
        <form onSubmit={handlePasswordChange}>
            <Box display="flex" flexDirection="column" alignItems="center" marginBottom={2}>
              <TextField label="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" required />
              <TextField label="New Password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" required />
              <Button variant="contained" type="submit">Submit</Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog> 
      <Dialog open={opener} onClose={handleClickerClose}>
        <DialogTitle>Delete Employee</DialogTitle>
        <DialogContent>
        <form onSubmit={handleDeleteChange}>
          <Box display="flex" flexDirection="column" alignItems="center" marginBottom={2}>
            <TextField label="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" required />
            <Button variant="contained" type="submit">Submit</Button>
          </Box>
        </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminLogin;
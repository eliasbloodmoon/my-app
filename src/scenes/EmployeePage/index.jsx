import { Box, Typography, useTheme, CircularProgress } from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../navbar/index";
import { DataGrid } from '@mui/x-data-grid';
import { useContext } from "react";
import { UserProvider, UserContext } from "../../UserContext";

const getUserData = async (email) => {
  try {
    const usersResponse = await fetch(`http://frontend.digitaldreamforge.chat:5000/users?email=${email}`);
    const users = await usersResponse.json();
    const user = users[0];
    const name = user.first_name + " " + user.last_name;
    const databaseResponse = await fetch(`http://frontend.digitaldreamforge.chat:5000/api/database?name=${name}`);
    const databaseData = await databaseResponse.json();
    console.log(databaseData);
  } catch (error) {
    console.error(error);
  }
};

const EmployeeLogin = () => {
  const theme = useTheme();
  const [users] = useState([]);
  const {email} = useContext(UserContext);
  console.log({email});
  const commandsColumn = [
    {
      field: 'firstName',
      headerName: 'First Name',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'command',
      headerName: 'Command',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      resizable: false,
    },
    {
      field: 'time',
      headerName: 'Time',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      resizable: false,
    },
  ];

  const fetchCommandsData = useCallback(async () => {
    try {
      const commandsResponse = await fetch('http://frontend.digitaldreamforge.chat:5000/api/database');
      const usersResponse = await fetch('http://frontend.digitaldreamforge.chat:5000/users/');
  
      let commandsData = await commandsResponse.json();
      let usersData = await usersResponse.json();
  
      // Group commands by user email
      const groupedCommands = commandsData.reduce((acc, curr) => {
        const userEmail = usersData.find(user => user.firstName + ' ' + user.lastName === curr.name)?.email;
        if (userEmail) {
          acc[userEmail] = acc[userEmail] || [];
          acc[userEmail].push(curr);
        }
        return acc;
      }, {});
  
      let mergedData = [];
      for (let i = 0; i < usersData.length; i++) {
        const user = usersData[i];
        if (groupedCommands[user.email]) {
          mergedData.push(
            ...groupedCommands[user.email].map(command => ({
              ...command,
              ...user,
            }))
          );
        }
      }
  
      if (FormExport.email) {
        mergedData = mergedData.filter(user => user.email === FormExport.email);
      }
  
      const usersWithIds = mergedData.map(user => ({ ...user, id: uuidv4() }));
      setUsers(usersWithIds);
  
      // Set employee email
      const loggedInUser = mergedData.find(user => user.email === employeeEmail);
      if (loggedInUser) {
        setEmployeeEmail(loggedInUser.email);
      } else {
        setEmployeeEmail("");
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, [employeeEmail]);

  useEffect(() => {
    fetchCommandsData();
  }, [fetchCommandsData]);

  const CommandList = ({ users, employeeEmail, isLoading }) => {
    const [pageSize, setPageSize] = useState(5);
  
    const handlePageSizeChange = (params) => {
      setPageSize(params.pageSize);
    };
  
    return (
      <Box display="flex" flexDirection="column" marginTop={1}>
        <Box marginBottom={1}>
          <Typography fontWeight="bold" fontSize="24px">
            Logged in as {FormExport.email}
          </Typography>
        </Box>
          <Box display="flex" justifyContent="center">
          <DataGrid
            rows={users}
            columns={commandsColumn}
            pageSize={pageSize}
            rowsPerPageOptions={[5, 10, 20]}
            autoHeight
            rowHeight={45}
            columnBuffer={2}
            onPageSizeChange={handlePageSizeChange}
          />
          </Box>
          </Box>
    );
  };

  return (
    <UserProvider>
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
        <CommandList users={users} commandsColumn={commandsColumn} />
      </Box>
    </UserProvider>
  );
};

export default EmployeeLogin;

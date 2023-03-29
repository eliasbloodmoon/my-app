import { Box, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import Navbar from "../navbar/index";
import { DataGrid } from '@mui/x-data-grid';
import { userEmail } from "../loginPage/Form";

const API_URL1 = 'http://frontend.digitaldreamforge.chat:5000/users?email=' + userEmail;

fetch(API_URL1)
  .then(response => response.json())
  .then(data => {
    const user = data[0];
    const firstName = user.firstName;
    const lastName = user.lastName;

    const Name = firstName + " " + lastName;

    
  })
  .catch(error => console.error(error));


const EmployeeLogin = () => {
  const theme = useTheme();
  const [users] = useState([]);

  const commandsColumn = [
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

  const CommandList = ({ users }) => {
    const [pageSize, setPageSize] = useState(5);
  
    const handlePageSizeChange = (params) => {
      setPageSize(params.pageSize);
    };
  
    return (
      <Box display="flex" flexDirection="column" marginTop={1}>
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
    );
  };

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
      <CommandList users={users} commandsColumn={commandsColumn} />
    </Box>
  );
};

export default EmployeeLogin;
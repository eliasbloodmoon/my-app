import { Box, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import Navbar from "../navbar/index";
import { DataGrid } from '@mui/x-data-grid';
import { useContext, useCallback, useEffect } from "react";
import { UserProvider, UserContext } from "../../UserContext";
import { v4 as uuidv4 } from 'uuid';
import { getRowIdFromRowModel } from "@mui/x-data-grid/hooks/features/rows/gridRowsUtils";

const EmployeeLogin = () => {
  const theme = useTheme();
  const [employees, setEmployees] = useState([]);
  const [employeesEmail, setEmployeeEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true); // updated
  const { email: employeeEmail } = useContext(UserContext);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) {
      setEmail(savedEmail);
    } else if (employeeEmail) {
      setEmail(employeeEmail);
      localStorage.setItem('email', employeeEmail);
    }
  }, [employeeEmail]);

  useEffect(() => {
    if (employeeEmail && employeeEmail !== email) {
      setEmail(employeeEmail);
      localStorage.setItem('email', employeeEmail);
    }
  }, [employeeEmail, email]);

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
    if (!email) return;
  
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://frontend.digitaldreamforge.chat:5000/api/employee?email=${email}`
      );
      const data = await response.json();
      console.log(data);
  
      // Create a new row for each entry in the rockets array
      const rocketsData = data.rockets.map(rocket => {
        return {
          id: uuidv4(),
          firstName: data.employee.firstName,
          lastName: data.employee.lastName,
          email: data.employee.email,
          command: rocket.command,
          time: rocket.time
        };
      });
  
      // Add the rocket data to the employees array
      setEmployees(prevEmployees => [
        ...prevEmployees,
        ...rocketsData
      ]);
  
      // Set employee email
      const loggedInEmployee = employees.find(
        employee => employee.email === employee.email
      );
      if (loggedInEmployee) {
        setEmployeeEmail(loggedInEmployee.email);
      } else {
        setEmployeeEmail("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  useEffect(() => {
    fetchCommandsData();
  }, [fetchCommandsData, email]);

  const CommandList = ({ employees, employeesEmail, isLoading }) => {
    const [pageSize, setPageSize] = useState(5);
  
    const handlePageSizeChange = (params) => {
      setPageSize(params.pageSize);
    };
  
    return (
        <Box display="flex" flexDirection="column" marginTop={1}>
        <Box marginBottom={1}>
          <Typography fontWeight="bold" fontSize="24px">
            Logged in as {email}
          </Typography>
        </Box>
          <Box display="flex" justifyContent="center">
          <DataGrid
            rows={employees}
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
        <CommandList employees={employees} commandsColumn={commandsColumn} />
      </Box>
    </UserProvider>
  );
};

export default EmployeeLogin;

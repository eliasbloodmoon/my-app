// EmployeePage is the functions and features involving the Employee Page on the Front end. 

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

  // Initialize state variables
  const [employees, setEmployees] = useState([]);
  const [employeesEmail, setEmployeeEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true); // updated
  const { email: employeeEmail } = useContext(UserContext);
  const [email, setEmail] = useState('');

  // Load the employee email from local storage or context
  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    if (savedEmail) {
      setEmail(savedEmail);
    } else if (employeeEmail) {
      setEmail(employeeEmail);
      localStorage.setItem('email', employeeEmail);
    }
  }, [employeeEmail]);

  // Update the email state variable if it changes in context
  useEffect(() => {
    if (employeeEmail && employeeEmail !== email) {
      setEmail(employeeEmail);
      localStorage.setItem('email', employeeEmail);
    }
  }, [employeeEmail, email]);

  // Define columns for the commands table
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
  // Fetch employee commands data from the server
  const fetchCommandsData = useCallback(async () => {
    if (!email) return;
    
    
// Try to fetch data using the employee's email as a query parameter
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
  
      // Set the employee email based on the found employee
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
      // Set isLoading to false after fetching data
      setIsLoading(false);
    }
  }, [email]);
// Fetch data when the component is mounted and email or fetchCommandsData
  useEffect(() => {
    fetchCommandsData();
  }, [fetchCommandsData, email]);
  // Component that renders a list of commands
  const CommandList = ({ employees, employeesEmail, isLoading }) => {
    const [pageSize, setPageSize] = useState(5);
    // Handler for changing the page size of the list
    const handlePageSizeChange = (newPageSize) => {
      setPageSize(newPageSize);
    };
  
    return (
      // Create a container box with column flex direction and top margin
      <Box display="flex" flexDirection="column" marginTop={1}>
        {/* Create a box for displaying user info */}
        <Box marginBottom={1}>
          <Typography fontWeight="bold" fontSize="24px">
            Logged in as {email}
          </Typography>
        </Box>
        {/* Create a box for displaying data grid */}
        <Box display="flex" justifyContent="center">
          <DataGrid
            // Set rows to employees array
            rows={employees}
            // Set columns to commandsColumn array
            columns={commandsColumn}
            // Set page size to pageSize state
            pageSize={pageSize}
            // Set rows per page options to an array of numbers
            rowsPerPageOptions={[5, 10, 20]}
            // Enable auto height
            autoHeight
            // Set row height to 45 pixels
            rowHeight={45}
            // Set row ID to "id"
            rowId="id"
            // Set column buffer to 2
            columnBuffer={2}
            // Handle page size change
            onPageSizeChange={handlePageSizeChange}
            // Set page size to setPageSize function
            setPageSize={setPageSize}
          />
        </Box>
      </Box>
    );
  };

  return (
    <UserProvider>
      <Box width="100%">
        {/* Render the navbar */}
        <Navbar />
        {/* Create a box for the page header */}
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
        {/* Render the CommandList component with employees and commandsColumn props */}
        <CommandList employees={employees} commandsColumn={commandsColumn} />
      </Box>
    </UserProvider>
  );
};

export default EmployeeLogin;

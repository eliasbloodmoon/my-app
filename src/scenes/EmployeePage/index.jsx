import { Box, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import Navbar from "../navbar/index";
import { DataGrid } from '@mui/x-data-grid';
import { useContext, useCallback, useEffect } from "react";
import { UserProvider, UserContext } from "../../UserContext";
import { v4 as uuidv4 } from 'uuid';

// const getUserData = async (email) => {
//   try {
//     const employeesResponse = await fetch(`http://frontend.digitaldreamforge.chat:5000/employees?email=${email}`);
//     const employees = await employeesResponse.json();
//     const employee = employees[0];
//     const name = "\"" + employee.first_name + " " + employee.last_name + "\"";
//     const databaseResponse = await fetch(`http://frontend.digitaldreamforge.chat:5000/api/database?name=${name}`);
//     const databaseData = await databaseResponse.json();
//     console.log(databaseData);
//   } catch (error) {
//     console.error(error);
//   }
// };

const EmployeeLogin = () => {
  const theme = useTheme();
  const [employees, setEmployees] = useState([]);
  const [employeesEmail, setEmployeeEmail] = useState("");
  const [setIsLoading] = useState(true);
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

  // useEffect(() => {
  //   if (email) {
  //     getUserData(email);
  //   }
  // }, [email]);

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
      const commandsResponse = await fetch('http://frontend.digitaldreamforge.chat:5000/api/database');
      const employeesResponse = await fetch('http://frontend.digitaldreamforge.chat:5000/employees/');
  
      let commandsData = await commandsResponse.json();
      let employeesData = await employeesResponse.json();
  
      // Group commands by employee email
      const groupedCommands = commandsData.reduce((acc, curr) => {
        const employeeEmail = employeesData.find(employee => employee.firstName + ' ' + employee.lastName === curr.name)?.email;
        if (employeeEmail) {
          acc[employeeEmail] = acc[employeeEmail] || [];
          acc[employeeEmail].push(curr);
        }
        return acc;
      }, {});
  
      let mergedData = [];
      for (let i = 0; i < employeesData.length; i++) {
        const employee = employeesData[i];
        if (groupedCommands[employee.email]) {
          mergedData.push(
            ...groupedCommands[employee.email].map(command => ({
              ...command,
              ...employee,
            }))
          );
        }
      }
  
      if (email) {
        mergedData = mergedData.filter(employee => employee.email === email);
      }
  
      const employeesWithIds = mergedData.map(employee => ({ ...employee, id: uuidv4() }));
      setEmployees(employeesWithIds);
  
      // Set employee email
      const loggedInEmployee = mergedData.find(employee => employee.email === employeesEmail);
      if (loggedInEmployee) {
        setEmployeeEmail(loggedInEmployee.email);
      } else {
        setEmployeeEmail("");
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, [employeesEmail, email, setIsLoading]);

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

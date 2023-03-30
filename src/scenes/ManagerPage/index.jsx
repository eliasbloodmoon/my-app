import { Box, Button, Typography, useTheme, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import Navbar from "../navbar/index";
import { DataGrid } from '@mui/x-data-grid';
import { v4 as uuidv4 } from 'uuid';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/*
  The register new user should be added somewhere here.
  This is the main function. Replaced "Underconstruction"
*/
const ManagerLogin = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [commands, setCommands] = useState([]);
  const [currentPage, setCurrentPage] = useState("users");
  const [fetchData, setFetchData] = useState(true);
  // Add a loading state to indicate that the data is being fetched
  const [loading, setLoading] = useState(true);
  //Columns for the ComandList Command Name Time
  const commandsColumn = [
    { field: "command", headerName: "Command", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "time", headerName: "Time", flex: 1 },
  ];
  const usersColumn = [
  ];

  const handleToggleFetch = () => {
    setFetchData(!fetchData);
  };

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
  

  const handleExportCsv = () => {
    const rows = currentPage === 'commands' ? users : commands;
  
    // Get the current date and time
    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString();
    const timeString = currentDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  
    // Get the columns for the current page
    const columns = currentPage === 'commands' ? usersColumn : commandsColumn;
  
    // Create the header rows
    const headerRows = [
      ['Digital Dream Forge'],
      ['Time of Data Download:' + dateString + ' ' + timeString]
    ];
  
    // Create the header row for the csv
    const headerRow = columns.map(column => column.headerName);
  
    // Add the header rows to the csv
    const csvContent = headerRows.map(row => row.join(',')).join('\n') + '\n' + headerRow.join(",") + "\n" + rows.map(row => {
      const definedFields = Object.keys(row);
      const filteredColumns = columns.filter(column => definedFields.includes(column.field));
      return filteredColumns.map(column => row[column.field]).join(",");
    }).join("\n");
  
    // Download the csv file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${currentPage}_${dateString}_${timeString}.csv`);
  };

  const handleExportPdf = async () => {
    const rows = currentPage === 'commands' ? users : commands;

    // Get the columns for the current page
    const columns = currentPage === 'commands' ? usersColumn : commandsColumn;

    // Create a new instance of jsPDF
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
      putOnlyUsedFonts: true,
      floatPrecision: 16,
    });

    // Add the header rows
    doc.setFontSize(14);
    doc.text("Digital Dream Forge", 20, 20);
    doc.text("Time of Data Download: " + new Date().toLocaleString(), 20, 30);
    doc.setFontSize(12);

    // Add the column headers
    const header = columns.map((column) => column.headerName);
    const rowsData = rows.map((row) => columns.map((column) => row[column.field]));
    doc.autoTable({
      startY: 40,
      head: [header],
      body: rowsData,
      margin: { top: 20 },
    });

    // Save the PDF file
    const blob = doc.output("blob");
    saveAs(blob, `${currentPage}_${new Date().toLocaleString()}.pdf`);
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
      //setLastUpdate(Date.now()); // Update the lastUpdate state variable
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
    if (fetchData) {
      const timer = setInterval(() => {
        fetchUserData();
      }, 10000);
      return () => clearInterval(timer); // Clear the timer when the component unmounts
    }
  }, [fetchData]);
  
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

      <Grid container>
        <Grid item xs={12} sm={3} md={2}>
          <Box display="flex" flexDirection="column" justifyContent="flex-start" marginBottom={1} paddingLeft={1} paddingRight={1} paddingTop={1}>
            <Button color="info" variant="contained" onClick={handleToggleFetch} style={{ width: '100%', marginBottom: '1rem' }}>
              {fetchData ? "Turn off auto-refresh" : "Turn on auto-refresh"}
            </Button>
            <Button variant="contained" onClick={handleExportCsv} style={{ marginBottom: '1rem' }}>Export All as CSV</Button>
            <Button variant="contained" onClick={handleExportPdf} style={{ marginBottom: '1rem' }}>Export All as PDF</Button>
          </Box>
        </Grid>
        <Grid item xs={12} sm={9} md={10}>
          <Box>
            {currentPage === "commands" ? (
              <UserList users={users} />
            ) : (
              <CommandList users={commands} />
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
export default ManagerLogin;
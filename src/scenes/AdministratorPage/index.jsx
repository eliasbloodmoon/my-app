// Administrator Page is the functions and features involving the Admin Page on the Front end. 

// Import various components and libraries from Material-UI and React
import { Box, Button, Typography, useTheme, Dialog, DialogContent, DialogActions, DialogContentText, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem, Tabs, Tab } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import React, { useEffect, useState } from "react";
import Navbar from "../navbar/index";
import { DataGrid } from '@mui/x-data-grid';
import { v4 as uuidv4 } from 'uuid';
import { saveAs } from 'file-saver';
import { alpha } from "@mui/system";
import { Grid } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Define functional component called AdminLogin
  const AdminLogin = () => {

  // Initialize state variables using useState hook
  const theme = useTheme();
  const [employees, setEmployees] = useState([]);
  const [commands, setCommands] = useState([]);
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");  
  const [changeOpen, setChangeOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("employees");
  const [loading, setLoading] = useState(true);
  const [deleteCommandConfirmOpen, setDeleteCommandConfirmOpen] = useState(false);
  const [deleteEmployeeConfirmOpen, setDeleteEmployeeConfirmOpen] = useState(false);
  const [deleteCommandId, setDeleteCommandId] = useState(null);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState(null);
  const [editCommandOpen, setCommandEditOpen] = useState(false);
  const [editEmployeeOpen, setEmployeeEditOpen] = useState(false);
  const [editCommand, setEditCommand] = useState({ id: "", time: "", firstName: "", lastName: "", command: "" });
  const [editEmployee, setEditEmployee] = useState({ id: "", firstName: "", lastName: "", email: "", password: "", role: ""});
  const [lastDeletedItem, setLastDeletedItem] = useState(null);
  const [fetchData, setFetchData] = useState(true);
  const [passwordWarningOpen, setPasswordWarningOpen] = useState(false);

  // This array defines the columns for a table displaying commands.
  const commandsColumn = [
    { field: "command", headerName: "Command", flex: 1 },  // Column for the command name
    { field: "firstName", headerName: "First Name", flex: 1 }, // Column for the user's first name
    { field: "lastName", headerName: "Last Name", flex: 1 }, // Column for the user's last name
    { field: "time", headerName: "Time", flex: 1 }, // Column for the time and date the command was executed
    {
      field: "edit",
      headerName: "Edit",
      sortable: false,
      filterable: false,
      width: 100,
      disableColumnMenu: true,
      renderCell: (params) => ( // Button to edit a command
        <Button
          variant="outlined"
          color="info"
          onClick={() => handleEditCommand(params.row.id)}
        >
          Edit
        </Button>
        ),
    },
    {
      field: "delete",
      headerName: "Delete",
      sortable: false,
      filterable: false,
      width: 100,
      disableColumnMenu: true,
      renderCell: (params) => ( // Button to delete a command
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleOpenDeleteCommandConfirm(params.row.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  // This array defines the columns for a table displaying employees.
  const employeesColumn = [
    { field: "firstName", headerName: "First Name", flex: 1 }, // Column for the employee's first name
    { field: "lastName", headerName: "Last Name", flex: 1 }, // Column for the employee's last name
    { field: "email", headerName: "Email", flex: 1 }, // Column for the employee's email address
    { field: "password", headerName: "Password", flex: 1 }, // Column for the employee's password
    { field: "role", headerName: "Role", flex: 1 }, // Column for the employee's role
    {
      field: "edit",
      headerName: "Edit",
      sortable: false,
      filterable: false,
      width: 100,
      disableColumnMenu: true,
      renderCell: (params) => ( // Button to edit an employee
        <Button
          variant="outlined"
          color="info"
          onClick={() => handleEditEmployee(params.row.id)}
        >
          Edit
        </Button>
        ),
    },
    {
      field: "delete",
      headerName: "Delete",
      sortable: false,
      filterable: false,
      width: 100,
      disableColumnMenu: true,
      renderCell: (params) => ( // Button to delete an employee
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleOpenDeleteEmployeeConfirm(params.row.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  // This function opens the dialog box for adding a new employee
  const handleClickOpen = () => {
    setOpen(true);
  };

  // This function closes the dialog box for adding a new employee
  const handleClose = () => {
    setOpen(false);
  };
  
  // This function toggles the state of 'fetchData' to trigger a fetch of updated data
  const handleToggleFetch = () => {
    setFetchData(!fetchData);
  };

  // This function sets the employee to be edited and opens the dialog box for editing an employee
  const handleEditEmployee = (id) => {
    // Find the employee object to be edited from the employees array based on its id
    const employeeToEdit = employees.find((employee) => employee.id === id);
    
   // Set the employee to be edited in state 
    if (employeeToEdit) {
      setEditEmployee(employeeToEdit);
      // Open the dialog box for editing an employee
      setEmployeeEditOpen(true);
    }
  };

  // This function sets the command to be edited and opens the dialog box for editing a command
  const handleEditCommand = (id) => {
    // Find the command object to be edited from the commands array based on its id
    const commandToEdit = commands.find((command) => command.id === id);
  
    if (commandToEdit) {
      // Set the command to be edited in state
      setEditCommand(commandToEdit);
      // Open the dialog box for editing a command
      setCommandEditOpen(true);
    }
  };
  // This function closes the password warning dialog box
  const handleClosePasswordWarning = () => {
    setPasswordWarningOpen(false);
  };

  // This function submits the edited employee information and updates it in the database
  const handleEditEmployeeSubmit = async (e) => {
    e.preventDefault();
    // If there is no employee id, return
    if (!editEmployee.id) return;
    // If the employee's password is less than 8 characters, show a warning dialog box and return
    if (editEmployee.password.length < 8) {
      setPasswordWarningOpen(true);
      return;
    }
  
    try {
      // Send PUT request to update the employee record on the server
      await fetch(`http://frontend.digitaldreamforge.chat:5000/employees/${editEmployee._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: editEmployee.firstName,
          lastName: editEmployee.lastName,
          email: editEmployee.email,
          password: editEmployee.password,
          role: editEmployee.role,
        }),
      });
  
      // Update the local state with the edited command
      setEmployees(
        employees.map((employee) => (employee.id === editEmployee.id ? editEmployee : employee))
      );
  
      // Close the edit dialog
      setEmployeeEditOpen(false);
      
      // Refresh the data grid to reflect the changes
      refreshDataGrid();
    } catch (error) {
      console.error(error);
    }
  };
  // Function to handle the submission of editing a command record
  const handleEditCommandSubmit = async (e) => {
    e.preventDefault();

    // If no command ID, return
    if (!editCommand.id) return;
  
    try {
      // Send PUT request to update the command record on the server
      await fetch(`http://frontend.digitaldreamforge.chat:5000/api/database/${editCommand._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          time: editCommand.time,
          firstName: editCommand.firstName,
          lastName: editCommand.lastName,
          command: editCommand.command,
        }),
      });
  
      // Update the local state with the edited command
      setCommands(
        commands.map((command) => (command.id === editCommand.id ? editCommand : command))
      );
  
      // Close the edit dialog
      setCommandEditOpen(false);
      
      // Refresh the data grid to reflect the changes
      refreshDataGrid();
    } catch (error) {
      console.error(error);
    }
  };

  // Handler to set the ID of the command to be deleted and open the delete confirmation dialog
  const handleOpenDeleteCommandConfirm = (id) => {
    setDeleteCommandId(id);
    setDeleteCommandConfirmOpen(true);
  };

  // Handler to set the ID of the employee to be deleted and open the delete confirmation dialog
  const handleOpenDeleteEmployeeConfirm = (id) => {
    setDeleteEmployeeId(id);
    setDeleteEmployeeConfirmOpen(true);
  };
  
  // Handler to delete the selected employee
  const handleDeleteEmployee = async () => {
    if (!deleteEmployeeId) return;
  
    try {
       // Find the employee to delete
      const employeeToDelete = employees.find((employee) => employee.id === deleteEmployeeId);
       // Throw an error if the employee is not found
      if (!employeeToDelete) {
        throw new Error("Command not found");
      }
       // Send a DELETE request to the server to delete the employee
      await fetch(`http://frontend.digitaldreamforge.chat:5000/employees/${employeeToDelete._id}`, {
        method: "DELETE",
      });
  
      // Remove the deleted command from the local state
      setEmployees(employees.filter((employee) => employee.id !== deleteEmployeeId));
      setDeleteEmployeeId(null);
    } catch (error) {
      console.error(error);
    }
    // Close the delete confirmation dialog and refresh the data grid
    setDeleteEmployeeConfirmOpen(false);

    refreshDataGrid();
  };
  // Handler to delete the selected command
  const handleDeleteCommand = async () => {
    if (!deleteCommandId) return;
    
    try {
      // Find the command to delete
      const commandToDelete = commands.find((command) => command.id === deleteCommandId);
      // Throw an error if the command is not found
      if (!commandToDelete) {
        throw new Error("Command not found");
      }
  
      // Save the deleted command so it can be undone
      setLastDeletedItem(commandToDelete);
      // Send a DELETE request to the server to delete the command
      await fetch(`http://frontend.digitaldreamforge.chat:5000/api/database/${commandToDelete._id}`, {
        method: "DELETE",
      });
    
      // Remove the deleted command from the local state
      setCommands(commands.filter((command) => command.id !== deleteCommandId));
      setDeleteCommandId(null);
    } catch (error) {
      console.error(error);
    }
     // Close the delete confirmation dialog and refresh the data grid
    setDeleteCommandConfirmOpen(false);

    refreshDataGrid();
  };
  // Component for the list of commands
  const CommandList = ({ employees }) => {
    // Set the initial page size to 5
    const [pageSize, setPageSize] = useState(5);
    // Handler to change the page size
    const handlePageSizeChange = (newPageSize) => {
      setPageSize(newPageSize);
    };
  
    return(
    <Box display="flex" flexDirection="column" marginTop={1}>
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
        setPageSize={setPageSize}
      />
    </Box>
  );
    };
  
  //Layout of the EmployeeList
  const EmployeeList = ({ employees }) => {
    const [pageSize, setPageSize] = useState(5);
   //Handler for changing the page size of the grid`
    const handlePageSizeChange = (newPageSize) => {
      setPageSize(newPageSize);
    };
  
    return(
    <Box display="flex" flexDirection="column" marginTop={1}>
      <DataGrid
        rows={employees}
        columns={employeesColumn}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 20]}
        autoHeight
        rowHeight={45}
        rowId="id"
        columnBuffer={2}
        onPageSizeChange={handlePageSizeChange}
        setPageSize={setPageSize}
      />
    </Box>
    );
  };
  

  const handleExportCsv = () => {
    const rows = currentPage === 'employees' ? employees : commands;
  
    // Get the current date and time
    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString();
    const timeString = currentDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  
    // Get the columns for the current page
    const columns = currentPage === 'employees' ? employeesColumn : commandsColumn;
  
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
    const rows = currentPage === 'employees' ? employees : commands;

    // Get the columns for the current page
    const columns = currentPage === 'employees' ? employeesColumn : commandsColumn;

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

// Function to undo the last deleted item
const handleUndo = async () => {
  
  try {
    if (!lastDeletedItem) {
      throw new Error("No item to undo");
    }
    // Restore the deleted item to the database
    await fetch(`http://frontend.digitaldreamforge.chat:5000/api/database`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lastDeletedItem),
    });

    // Add the deleted item back to the local state
    setCommands([...commands, lastDeletedItem]);

    // Reset the last deleted item state
    setLastDeletedItem(null);
  } catch (error) {
    console.error(error);
  }
};
  // Function to submit the employee registration form
  const handleRegisterSubmit = async () => {
    try{
      const savedEmployeeResponse = await fetch (
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
      // Parse the response JSON and log the saved employee
      const savedEmployee = await savedEmployeeResponse.json();
      console.log(savedEmployee);
      // Close the registration dialog and refresh the data grid
      if (savedEmployee) {setOpen(false);}
      refreshDataGrid();
    } catch (error) {
      console.error(error);
    }
  };
  // Function to toggle between employee and command pages
  const handlePageToggle = () => {
    setCurrentPage(currentPage === "employees" ? "commands" : "employees");
  };
  // Function to refresh the data grid with new data
  const refreshDataGrid = () => {
    fetchEmployeeData();
  };
  
  // Asynchronously fetch employee and command data from backend API
  const fetchEmployeeData = async () => {
    try {
      // Make API calls for employee and command data
      const [employeesResponse, commandsResponse] = await Promise.all([
        fetch('http://frontend.digitaldreamforge.chat:5000/employees'),
        fetch('http://frontend.digitaldreamforge.chat:5000/api/database')
      ]);
      // Parse employee and command data as JSON
      const [employeesData, commandsData] = await Promise.all([
        employeesResponse.json(),
        commandsResponse.json()
      ]);
      // Add UUIDs to employees and commands data and update state
      const employeesWithIds = employeesData.map(employee => ({ ...employee, id: uuidv4() }));
      const commandsWithIds = commandsData.map(command => ({ ...command, id: uuidv4() }));
      setEmployees(employeesWithIds);
      setCommands(commandsWithIds);
      //setLastUpdate(Date.now()); 
      // Update the lastUpdate state variable
    } catch (error) {
      console.error(error);
    }
  };
  
  // Call the fetchEmployeeData function once when the component mounts
  useEffect(() => {
    fetchEmployeeData();
  }, []);
  
  // Call the fetchEmployeeData function every 10 seconds
  useEffect(() => {
    if (fetchData) {
      const timer = setInterval(() => {
        fetchEmployeeData();
      }, 10000);
      return () => clearInterval(timer); // Clear the timer when the component unmounts
    }
  }, [fetchData]);
  
  
  // Modify the useEffect hook to set loading to false when the data is fetched
  useEffect(() => {
    if (employees.length > 0 && commands.length > 0) {
      setLoading(false);
    }
  }, [employees, commands]);
  
  // Render a loading message while the data is being fetched
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    // top-level Box component that occupies the full width of the screen
  <Box width="100%">

  <Navbar />

  {/* Title displayed in a Box with a red background */}
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

  {/* Snackbar component that displays a warning message if the password entered is less than 8 characters long */}
  <Snackbar
    open={passwordWarningOpen}
    autoHideDuration={5000}
    onClose={handleClosePasswordWarning}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
  >
    <Alert onClose={handleClosePasswordWarning} severity="warning" variant="filled">
      Password must be at least 8 characters long!
    </Alert>
  </Snackbar>

  {/* Grid container with two Grid items */}
  <Grid container>
    {/* left Grid item containing Buttons */}
    <Grid item xs={12} sm={3} md={2}>
      <Box display="flex" flexDirection="column" justifyContent="flex-start" marginBottom={1} paddingLeft={1} paddingRight={1} paddingTop={1}>
        <Button color="info" variant="contained" onClick={handleToggleFetch} style={{ width: "100%", marginBottom: '1rem' }}>
          {/* Toggles auto-refresh on or off depending on fetchData state */}
          {fetchData ? "Turn off auto-refresh" : "Turn on auto-refresh"}
        </Button>

        {/* Add Employee button displayed only when current page is "employees" */}
        {currentPage === "employees" && (
          <Button variant="contained" onClick={handleClickOpen} style={{ marginBottom: '1rem' }}>Add Employee</Button>
        )}

        {/* Undo Time Entry Delete button displayed only when current page is "commands" */}
        {currentPage === "commands" && (
          <Button variant="contained" onClick={handleUndo} style={{ marginBottom: '1rem' }}>Undo Time Entry Delete</Button>
        )}

        <Button variant="contained" onClick={handleExportCsv} style={{ marginBottom: '1rem' }}>Export All as CSV</Button>
        <Button variant="contained" onClick={handleExportPdf} style={{ marginBottom: '1rem' }}>Export All as PDF</Button>
      </Box>
    </Grid>

    {/* right Grid item containing Tabs component and corresponding list component */}
    <Grid item xs={12} sm={9} md={10}>
      <Box paddingRight={12}>
        {/* Tabs component to switch between "employees" and "commands" pages */}
        <Tabs
          // TabIndicatorProps specifies the style for the tab indicator (in this case, a red background)
          TabIndicatorProps={{ style: { background: "red" } }}
          // value specifies which tab is currently selected (either "employees" or "commands")
          value={currentPage}
          // onChange specifies the function to call when the user switches tabs
          onChange={handlePageToggle}
        >
          {/* The first tab is for displaying the employee list */}
          <Tab
            value="employees"
            label="Employees"
            // The sx prop sets custom styles for the tab, depending on the theme and whether it is selected
            sx={{
              color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
              '&.Mui-selected': {
                // If the theme is dark, use a semi-transparent white background; otherwise, use a semi-transparent primary color
                backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.3) : alpha(theme.palette.primary.main, 0.08),
              },
            }}
          />

          {/* The second tab is for displaying the list of commands */}
          <Tab
            value="commands"
            label="Commands"
            // The sx prop sets custom styles for the tab, depending on the theme and whether it is selected
            sx={{
              color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
              '&.Mui-selected': {
                // If the theme is dark, use a semi-transparent white background; otherwise, use a semi-transparent primary color
                backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.3) : alpha(theme.palette.primary.main, 0.08),
              },
            }}
          />
          </Tabs>
  </Box>

  {/* Depending on the currently selected tab, either the EmployeeList or CommandList component is displayed */}
  {currentPage === "employees" ? (
    <EmployeeList employees={employees} />
  ) : (
    <CommandList employees={commands} />
  )}

  {/* Dialog component for confirming employee deletion */}
  <Dialog open={deleteEmployeeConfirmOpen} onClose={() => setDeleteEmployeeConfirmOpen(false)}>
    <DialogTitle>Confirm Delete</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to delete this employee?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      {/* Button to cancel employee deletion */}
      <Button onClick={() => setDeleteEmployeeConfirmOpen(false)} color="info">
        Cancel
      </Button>
      {/* Button to confirm employee deletion */}
      <Button onClick={handleDeleteEmployee} autoFocus color="error">
        Confirm
      </Button>
    </DialogActions>
  </Dialog>

  {/* Dialog component for confirming command deletion */}
  <Dialog open={deleteCommandConfirmOpen} onClose={() => setDeleteCommandConfirmOpen(false)}>
    <DialogTitle>Confirm Delete</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to delete this entry?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      {/* Button to cancel command deletion */}
      <Button onClick={() => setDeleteCommandConfirmOpen(false)} color="info">
        Cancel
      </Button>
      {/* Button to confirm command deletion */}
      <Button onClick={handleDeleteCommand} autoFocus color="error">
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
    <Dialog open={editCommandOpen} onClose={() => setCommandEditOpen(false)}>
    {/* Title of the dialog box */}
    <DialogTitle>Edit Command</DialogTitle>
    <DialogContent>
      {/* Form to submit the edited command */}
      <form onSubmit={handleEditCommandSubmit}>
        {/* Container for the form elements */}
        <Box display="flex" flexDirection="column" alignItems="center" marginBottom={2}>
          {/* Input field for the time */}
          <TextField
            label="Time"
            variant="outlined"
            value={editCommand.time}
            onChange={(e) => setEditCommand({ ...editCommand, time: e.target.value })}
            margin="normal"
            required
          />
          {/* Input field for the first name */}
          <TextField
            label="First Name"
            variant="outlined"
            value={editCommand.firstName}
            onChange={(e) => setEditCommand({ ...editCommand, firstName: e.target.value })}
            margin="normal"
            required
          />
          {/* Input field for the last name */}
          <TextField
            label="Last Name"
            variant="outlined"
            value={editCommand.lastName}
            onChange={(e) => setEditCommand({ ...editCommand, lastName: e.target.value })}
            margin="normal"
            required
          />
          {/* Input field for the command */}
          <TextField
            label="Command"
            variant="outlined"
            value={editCommand.command}
            onChange={(e) => setEditCommand({ ...editCommand, command: e.target.value })}
            margin="normal"
            required
          />
          {/* Button to save the edited command */}
          <Button variant="contained" type="submit">
            Save
          </Button>
        </Box>
      </form>
    </DialogContent>
  </Dialog>

    <Dialog open={editEmployeeOpen} onClose={() => setEmployeeEditOpen(false)}>
    {/* Edit Employee Dialog */}
    <DialogTitle>Edit Employee</DialogTitle>
    <DialogContent>
      <form onSubmit={handleEditEmployeeSubmit}>
        {/* Form for submitting edited employee */}
        <Box display="flex" flexDirection="column" alignItems="center" marginBottom={2}>
          {/* Input fields for employee information */}
          <TextField
            label="First Name"
            variant="outlined"
            value={editCommand.firstName}
            onChange={(e) => setEditEmployee({ ...editEmployee, firstName: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Last Name"
            variant="outlined"
            value={editCommand.lastName}
            onChange={(e) => setEditEmployee({ ...editEmployee, lastName: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Email"
            variant="outlined"
            value={editCommand.email}
            onChange={(e) => setEditEmployee({ ...editEmployee, email: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Password (minimum 8)"
            variant="outlined"
            value={editCommand.password}
            onChange={(e) => setEditEmployee({ ...editEmployee, password: e.target.value })}
            margin="normal"
          />
          <FormControl variant="outlined" margin="normal" required>
            {/* Select dropdown for employee role */}
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              value={editEmployee.role}
              onChange={(e) => setEditEmployee({ ...editEmployee, role: e.target.value })}
              label="Role"
            >
              {/* Options for employee role */}
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Management">Management</MenuItem>
              <MenuItem value="Employee">Employee</MenuItem>
            </Select>
          </FormControl>
          {/* Submit button for saving changes */}
          <Button variant="contained" type="submit">
            Save
          </Button>
        </Box>
      </form>
    </DialogContent>
  </Dialog>
    <Dialog open={open} onClose={handleClose} paddingTop={1}>
    {/* Dialog title */}
    <DialogTitle>Add Employee</DialogTitle>
    <DialogContent>
      {/* Form to add new employee */}
      <form onSubmit={handleRegisterSubmit}>
        {/* Form inputs */}
        <Box display="flex" flexDirection="column" alignItems="center" marginBottom={2}>
          <TextField label="First name" variant="outlined" value={firstName} onChange={(e) => setFirstName(e.target.value)} margin="normal" required />
          <TextField label="Last name" variant="outlined" value={lastName} onChange={(e) => setLastName(e.target.value)} margin="normal" required />
          <TextField label="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} margin="normal" required />
          <TextField label="Password (minimum 8)" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" required />
          <select id="role" name="role" size="1" value={role} onChange={(e) => setRole(e.target.value)}>
            {/* Dropdown menu for selecting employee role */}
            <option value= "">Select a role</option>
            <option value= "Admin">Admin</option>
            <option value= "Management">Management</option>
            <option value= "Employee">Employee</option>
          </select>
          {/* Submit button */}
          <Button variant="contained" type="submit" disabled={password.length < 8}>Submit</Button>
        </Box>
      </form>
    </DialogContent>
  </Dialog>
  </Grid>
  </Grid>
  </Box>
  );
};
export default AdminLogin;
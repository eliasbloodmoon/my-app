import { Box, Button, Typography, useTheme, Dialog, DialogContent, DialogActions, DialogContentText, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem, Tabs, Tab } from "@mui/material";
import React, { useEffect, useState } from "react";
import Navbar from "../navbar/index";
import { DataGrid } from '@mui/x-data-grid';
import { v4 as uuidv4 } from 'uuid';
import { saveAs } from 'file-saver';
import { alpha } from "@mui/system";
import { Grid } from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/*
  The register new employee should be added somewhere here.
  This is the main function. Replaced "Underconstruction"
*/
const AdminLogin = () => {
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
  //const [setLastUpdate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteCommandConfirmOpen, setDeleteCommandConfirmOpen] = useState(false);
  const [deleteEmployeeConfirmOpen, setDeleteEmployeeConfirmOpen] = useState(false);
  const [deleteCommandId, setDeleteCommandId] = useState(null);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState(null);
  const [editCommandOpen, setCommandEditOpen] = useState(false);
  const [editEmployeeOpen, setEmployeeEditOpen] = useState(false);
  const [editCommand, setEditCommand] = useState({ id: "", time: "", name: "", command: "" });
  const [editEmployee, setEditEmployee] = useState({ id: "", firstName: "", lastName: "", email: "", password: "", role: ""});
  const [lastDeletedItem, setLastDeletedItem] = useState(null);
  const [fetchData, setFetchData] = useState(true);

  //Columns for the ComandList Command Name Time
  const commandsColumn = [
    { field: "command", headerName: "Command", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "time", headerName: "Time", flex: 1 },
    {
      field: "edit",
      headerName: "Edit",
      sortable: false,
      filterable: false,
      width: 100,
      disableColumnMenu: true,
      renderCell: (params) => (
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
      renderCell: (params) => (
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

  const employeesColumn = [
    { field: "firstName", headerName: "First Name", flex: 1 },
    { field: "lastName", headerName: "Last Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "password", headerName: "Password", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
    {
      field: "edit",
      headerName: "Edit",
      sortable: false,
      filterable: false,
      width: 100,
      disableColumnMenu: true,
      renderCell: (params) => (
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
      renderCell: (params) => (
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleToggleFetch = () => {
    setFetchData(!fetchData);
  };

  const handleEditEmployee = (id) => {
    const employeeToEdit = employees.find((employee) => employee.id === id);
  
    if (employeeToEdit) {
      setEditEmployee(employeeToEdit);
      setEmployeeEditOpen(true);
    }
  };

  const handleEditCommand = (id) => {
    const commandToEdit = commands.find((command) => command.id === id);
  
    if (commandToEdit) {
      setEditCommand(commandToEdit);
      setCommandEditOpen(true);
    }
  };

  const handleEditEmployeeSubmit = async (e) => {
    e.preventDefault();
  
    if (!editEmployee.id) return;
  
    try {
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
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditCommandSubmit = async (e) => {
    e.preventDefault();
  
    if (!editCommand.id) return;
  
    try {
      await fetch(`http://frontend.digitaldreamforge.chat:5000/api/database/${editCommand._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          time: editCommand.time,
          name: editCommand.name,
          command: editCommand.command,
        }),
      });
  
      // Update the local state with the edited command
      setCommands(
        commands.map((command) => (command.id === editCommand.id ? editCommand : command))
      );
  
      // Close the edit dialog
      setCommandEditOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenDeleteCommandConfirm = (id) => {
    setDeleteCommandId(id);
    setDeleteCommandConfirmOpen(true);
  };

  const handleOpenDeleteEmployeeConfirm = (id) => {
    setDeleteEmployeeId(id);
    setDeleteEmployeeConfirmOpen(true);
  };
  

  const handleDeleteEmployee = async () => {
    if (!deleteEmployeeId) return;
  
    try {
      const employeeToDelete = employees.find((employee) => employee.id === deleteEmployeeId);
  
      if (!employeeToDelete) {
        throw new Error("Command not found");
      }
  
      await fetch(`http://frontend.digitaldreamforge.chat:5000/employees/${employeeToDelete._id}`, {
        method: "DELETE",
      });
  
      // Remove the deleted command from the local state
      setEmployees(employees.filter((employee) => employee.id !== deleteEmployeeId));
      setDeleteEmployeeId(null);
    } catch (error) {
      console.error(error);
    }
  
    setDeleteEmployeeConfirmOpen(false);
  };

  const handleDeleteCommand = async () => {
    if (!deleteCommandId) return;
    
    try {
      const commandToDelete = commands.find((command) => command.id === deleteCommandId);
    
      if (!commandToDelete) {
        throw new Error("Command not found");
      }
  
      // Save the deleted command so it can be undone
      setLastDeletedItem(commandToDelete);
    
      await fetch(`http://frontend.digitaldreamforge.chat:5000/api/database/${commandToDelete._id}`, {
        method: "DELETE",
      });
    
      // Remove the deleted command from the local state
      setCommands(commands.filter((command) => command.id !== deleteCommandId));
      setDeleteCommandId(null);
    } catch (error) {
      console.error(error);
    }
    
    setDeleteCommandConfirmOpen(false);
  };

  const CommandList = ({ employees }) => {
    const [pageSize, setPageSize] = useState(5);
  
    const handlePageSizeChange = (params) => {
      setPageSize(params.pageSize);
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
      />
    </Box>
  );
    };
  
  //Layout of the EmployeeList
  const EmployeeList = ({ employees }) => {
    const [pageSize, setPageSize] = useState(5);
  
    const handlePageSizeChange = (params) => {
      setPageSize(params.pageSize);
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

const handleUndo = async () => {
  
  try {
    if (!lastDeletedItem) {
      throw new Error("No item to undo");
    }

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
      const savedEmployee = await savedEmployeeResponse.json();
      console.log(savedEmployee);
      if (savedEmployee) {setOpen(false);}
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageToggle = () => {
    setCurrentPage(currentPage === "employees" ? "commands" : "employees");
  };

  //This is where the EmployeeList displays from.
  //It makes a GET request to the /employees route from the backend
  
  const fetchEmployeeData = async () => {
    try {
      const [employeesResponse, commandsResponse] = await Promise.all([
        fetch('http://frontend.digitaldreamforge.chat:5000/employees'),
        fetch('http://frontend.digitaldreamforge.chat:5000/api/database')
      ]);
      const [employeesData, commandsData] = await Promise.all([
        employeesResponse.json(),
        commandsResponse.json()
      ]);
      const employeesWithIds = employeesData.map(employee => ({ ...employee, id: uuidv4() }));
      const commandsWithIds = commandsData.map(command => ({ ...command, id: uuidv4() }));
      setEmployees(employeesWithIds);
      setCommands(commandsWithIds);
      //setLastUpdate(Date.now()); // Update the lastUpdate state variable
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
            <Button color="info" variant="contained" onClick={handleToggleFetch} style={{ width: "100%", marginBottom: '1rem' }}>
              {fetchData ? "Turn off auto-refresh" : "Turn on auto-refresh"}
            </Button>
            {currentPage === "employees" && (
              <Button variant="contained" onClick={handleClickOpen} style={{ marginBottom: '1rem' }}>Add Employee</Button>
            )}
            {currentPage === "commands" && (
              <Button variant="contained" onClick={handleUndo} style={{ marginBottom: '1rem' }}>Undo Time Entry Delete</Button>
            )}
            <Button variant="contained" onClick={handleExportCsv} style={{ marginBottom: '1rem' }}>Export All as CSV</Button>
            <Button variant="contained" onClick={handleExportPdf} style={{ marginBottom: '1rem' }}>Export All as PDF</Button>
            
          </Box>
        </Grid>
        <Grid item xs={12} sm={9} md={10}>
          <Box paddingRight={12}>
            <Tabs
              TabIndicatorProps={{ style: { background: "red" } }}
              value={currentPage}
              onChange={handlePageToggle}
            >
          <Tab
            value="employees"
            label="Employees"
            sx={{
              color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
              '&.Mui-selected': {
                backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.3) : alpha(theme.palette.primary.main, 0.08),
              },
            }}
          />
          <Tab
            value="commands"
            label="Commands"
            sx={{
              color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
              '&.Mui-selected': {
                backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.3) : alpha(theme.palette.primary.main, 0.08),
              },
            }}
          />
        </Tabs>
      </Box>

      {currentPage === "employees" ? (
        <EmployeeList employees={employees} />
      ) : (
        <CommandList employees={commands} />
      )}

      <Dialog open={deleteEmployeeConfirmOpen} onClose={() => setDeleteEmployeeConfirmOpen(false)}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this employee?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteEmployeeConfirmOpen(false)} color="info">
          Cancel
        </Button>
        <Button onClick={handleDeleteEmployee} autoFocus color="error">
          Confirm
        </Button>
      </DialogActions>
      </Dialog>

      <Dialog open={deleteCommandConfirmOpen} onClose={() => setDeleteCommandConfirmOpen(false)}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this entry?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteCommandConfirmOpen(false)} color="info">
          Cancel
        </Button>
        <Button onClick={handleDeleteCommand} autoFocus color="error">
          Confirm
        </Button>
      </DialogActions>
      </Dialog>

      <Dialog open={editCommandOpen} onClose={() => setCommandEditOpen(false)}>
        <DialogTitle>Edit Command</DialogTitle>
        <DialogContent>
          <form onSubmit={handleEditCommandSubmit}>
            <Box display="flex" flexDirection="column" alignItems="center" marginBottom={2}>
              <TextField
                label="Time"
                variant="outlined"
                value={editCommand.time}
                onChange={(e) => setEditCommand({ ...editCommand, time: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                label="Name"
                variant="outlined"
                value={editCommand.name}
                onChange={(e) => setEditCommand({ ...editCommand, name: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                label="Command"
                variant="outlined"
                value={editCommand.command}
                onChange={(e) => setEditCommand({ ...editCommand, command: e.target.value })}
                margin="normal"
                required
              />
              <Button variant="contained" type="submit">
                Save
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={editEmployeeOpen} onClose={() => setEmployeeEditOpen(false)}>
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent>
          <form onSubmit={handleEditEmployeeSubmit}>
            <Box display="flex" flexDirection="column" alignItems="center" marginBottom={2}>
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
                label="Password"
                variant="outlined"
                value={editCommand.password}
                onChange={(e) => setEditEmployee({ ...editEmployee, password: e.target.value })}
                margin="normal"
              />
              <FormControl variant="outlined" margin="normal" required>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  value={editEmployee.role}
                  onChange={(e) => setEditEmployee({ ...editEmployee, role: e.target.value })}
                  label="Role"
                >
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Management">Management</MenuItem>
                  <MenuItem value="Employee">Employee</MenuItem>
                </Select>
              </FormControl>
              <Button variant="contained" type="submit">
                Save
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>

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
      </Grid>
    </Grid>
    </Box>
  );
};
export default AdminLogin;
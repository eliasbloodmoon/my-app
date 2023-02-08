import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(name, date, shiftIN, FirstMO, FirstMI, SecondMO, SecondMI, shiftOUT) {
  return { name, date, shiftIN, FirstMO, FirstMI, SecondMO, SecondMI, shiftOUT };
}

const rows = [
  createData('Adam Tester','Feb 24, 2023', 1000, 1200, 1300, 1500, 1600, 1800),
];

export default function BasicTable() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Employee Name</TableCell>
            <TableCell align="right">Date</TableCell>
            <TableCell align="right">Shift Time In</TableCell>
            <TableCell align="right">1st Meal Time Out</TableCell>
            <TableCell align="right">1st Meal Time In</TableCell>
            <TableCell align="right">2nd Meal Time Out</TableCell>
            <TableCell align="right">2nd Meal Time In</TableCell>
            <TableCell align="right">Shift Time Out</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.date}</TableCell>
              <TableCell align="right">{row.shiftIN}</TableCell>
              <TableCell align="right">{row.FirstMO}</TableCell>
              <TableCell align="right">{row.FirstMI}</TableCell>
              <TableCell align="right">{row.SecondMO}</TableCell>
              <TableCell align="right">{row.SecondMI}</TableCell>
              <TableCell align="right">{row.shiftOUT}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
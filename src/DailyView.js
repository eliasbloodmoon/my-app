import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

<TableContainer id="DayView" component={Paper} sx={{display: 'block', width: 'auto', height: 'vh100'}}>
        
    <Box
          sx={{
            marginBottom: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        ></Box>
      <Table sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, minHeight: '100%', float: 'right', }} aria-label="simple table">
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
          {rowsEveryoneDay.map((row) => (
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
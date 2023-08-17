import { useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default function UserManage() {

  const [filter, setFilter] = useState('');
  const handleChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value as string);
  };

  function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
  ) {
    return { name, calories, fat, carbs, protein };
  }

  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];

  function UserTable() {
    return(
      <TableContainer component={Paper}>
      <Table className='table' sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead className='table-head'>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">{row.name}</TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    )
  }

  return(
    <section className="contents">
      <Box className='search-area' sx={{ minWidth: 120 }}>
        <FormControl className='filter' size="small">
          <InputLabel id="demo-simple-select-label">フィルター項目</InputLabel>
          <Select labelId="demo-simple-select-label" id="demo-simple-select" value={filter} label="フィルター項目" onChange={handleChange}>
            {rows.map((row) => (
              <MenuItem key={row.name} value={row.name}>
                {row.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField id="outlined-basic" label="検索" variant="outlined" className='search' size="small" fullWidth/>
      </Box>
      <UserTable/>
    </section>
  )
}
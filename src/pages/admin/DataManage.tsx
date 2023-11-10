import { useState, Fragment, forwardRef } from 'react';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';

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

export default function DataManage() {

  const [filter, setFilter] = useState('');
  const handleChange = (e: SelectChangeEvent) => {
    setFilter(e.target.value as string);
  };

  interface Data {
    calories: number;
    carbs: number;
    dessert: string;
    fat: number;
    id: number;
    protein: number;
  }
  
  interface ColumnData {
    dataKey: keyof Data;
    label: string;
    numeric?: boolean;
    width: number;
  }
  
  type Sample = [string, number, number, number, number];
  
  const sample: Array<Sample> = [
    ['Frozen yoghurt', 159, 6.0, 24, 4.0],
    ['Ice cream sandwich', 237, 9.0, 37, 4.3],
    ['Eclair', 262, 16.0, 24, 6.0],
    ['Cupcake', 305, 3.7, 67, 4.3],
    ['Gingerbread', 356, 16.0, 49, 3.9],
  ];
  
  function createData(
    id: number,
    dessert: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
  ): Data {
    return { id, dessert, calories, fat, carbs, protein };
  }
  
  const columns: Array<ColumnData> = [
    {
      width: 200,
      label: 'Dessert',
      dataKey: 'dessert',
    },
    {
      width: 120,
      label: 'Calories\u00A0(g)',
      dataKey: 'calories',
      numeric: true,
    },
    {
      width: 120,
      label: 'Fat\u00A0(g)',
      dataKey: 'fat',
      numeric: true,
    },
    {
      width: 120,
      label: 'Carbs\u00A0(g)',
      dataKey: 'carbs',
      numeric: true,
    },
    {
      width: 120,
      label: 'Protein\u00A0(g)',
      dataKey: 'protein',
      numeric: true,
    },
  ];
  
  const rows: Array<Data> = Array.from({ length: 200 }, (_, index) => {
    const randomSelection = sample[Math.floor(Math.random() * sample.length)];
    return createData(index, ...randomSelection);
  });
  
  const VirtuosoTableComponents: TableComponents<Data> = {
    Scroller: forwardRef<HTMLDivElement>((props, ref) => (
      <TableContainer component={Paper} {...props} ref={ref} />
    )),
    Table: (props) => (
      <Table className='data-table' {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
    ),
    TableHead,
    TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
    TableBody: forwardRef<HTMLTableSectionElement>((props, ref) => (
      <TableBody {...props} ref={ref} />
    )),
  };
  
  function fixedHeaderContent() {
    return(
      <TableRow>
        {columns.map((column) => (
          <TableCell key={column.dataKey} variant="head" align={column.numeric || false ? 'right' : 'left'} style={{ width: column.width }}>
            {column.label}
          </TableCell>
        ))}
      </TableRow>
    );
  }
  
  function rowContent(_index: number, row: Data) {
    return(
      <Fragment>
        {columns.map((column) => (
          <TableCell key={column.dataKey} align={column.numeric || false ? 'right' : 'left'}>
            {row[column.dataKey]}
          </TableCell>
        ))}
      </Fragment>
    );
  }
  

  function DataTable() {
    return(
      <Paper style={{ height: 'calc((var(--vh, 1vh) * 100) - 168px)', width: '100%' }}>
        <TableVirtuoso className='table' data={rows} components={VirtuosoTableComponents}
          fixedHeaderContent={fixedHeaderContent}
          itemContent={rowContent}
        />
      </Paper>
    )
  }

  return(
    <section className="contents">
      <Box className='search-area' sx={{ minWidth: 120 }}>
        <FormControl className='filter' size="small">
          <InputLabel id="demo-simple-select-label">フィルター項目</InputLabel>
          <Select labelId="demo-simple-select-label" id="demo-simple-select" value={filter} label="フィルター項目" onChange={handleChange}>
            {columns.map((column) => (
              <MenuItem key={column.dataKey} value={column.dataKey}>
                {column.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField id="outlined-basic" label="検索" variant="outlined" className='search' size="small" fullWidth/>
      </Box>
      <DataTable/>
    </section>
  )
}
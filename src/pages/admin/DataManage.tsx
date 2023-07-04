import { Fragment, forwardRef } from 'react';
import { TableVirtuoso, TableComponents } from 'react-virtuoso';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function DataManage() {

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
  
  const sample: readonly Sample[] = [
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
  
  const columns: ColumnData[] = [
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
  
  const rows: Data[] = Array.from({ length: 200 }, (_, index) => {
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
    return (
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
    return (
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
    return (
      <Paper style={{ height: 'calc(100vh - 96px)', width: '100%' }}>
        <TableVirtuoso className='table' data={rows} components={VirtuosoTableComponents}
          fixedHeaderContent={fixedHeaderContent}
          itemContent={rowContent}
        />
      </Paper>
    )
  }

  return(
    <section className="contents">
      <DataTable/>
    </section>
  )
}
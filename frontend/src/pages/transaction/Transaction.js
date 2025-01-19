import {
  Card,
  Container,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Button,
} from '@mui/material';
import { sentenceCase } from 'change-case';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Iconify from '../../components/iconify';
import Label from '../../components/label';
import Scrollbar from '../../components/scrollbar';
import AuthService from '../../services/AuthService';
import HttpService from '../../services/HttpService';
import TransactionListHead from './TransactionListHead';

const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false, firstColumn: true },
  { id: 'fromWallet', label: 'Sender', alignRight: false },
  { id: 'toWallet', label: 'Receiver', alignRight: false },
  { id: 'amount', label: 'Amount', alignRight: true },
  { id: 'description', label: 'Description', alignRight: false },
  { id: 'createdAt', label: 'Time of Transaction', alignRight: false },
  { id: 'type', label: 'Type', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' },
];

export default function Transaction() {
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState([]);
  const [budget, setBudget] = useState(1000); // User's set budget
  const [categories, setCategories] = useState([]); // Categories for transactions
  const [selectedCategory, setSelectedCategory] = useState('');
  const [transactionType, setTransactionType] = useState('all'); // 'in' | 'out' | 'all'
  const [startDate, setStartDate] = useState(null); // Start date for report generation
  const [endDate, setEndDate] = useState(null); // End date for report generation
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    fetchCategories(); // Fetch categories when component mounts
  }, [transactionType, startDate, endDate]);

  const fetchData = () => {
    const userId = AuthService.getCurrentUser()?.id;
    HttpService.getWithAuth(`/transactions/users/${userId}?type=${transactionType}&startDate=${startDate}&endDate=${endDate}`)
      .then((response) => {
        setData(response.data.content);
      })
      .catch((error) => {
        handleError(error);
      });
  };

  const fetchCategories = () => {
    HttpService.getWithAuth('/categories')
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        handleError(error);
      });
  };

  const handleError = (error) => {
    if (error?.response?.status === 401) {
      navigate('/login');
    } else if (error.response?.data?.errors) {
      error.response?.data?.errors.forEach((e) => enqueueSnackbar(e.message, { variant: 'error' }));
    } else if (error.response?.data?.message) {
      enqueueSnackbar(error.response?.data?.message, { variant: 'error' });
    } else {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleTransactionTypeChange = (event) => {
    setTransactionType(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleDateRangeChange = () => {
    fetchData();
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  // Function to print the report
  const printReport = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    const tableHtml = `
      <html>
        <head>
          <title>Transaction Report</title>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              padding: 8px;
              border: 1px solid #ddd;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
          </style>
        </head>
        <body>
          <h2>Transaction Report</h2>
          <table>
            <thead>
              <tr>
                ${TABLE_HEAD.map((head) => `<th>${head.label}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map((row) => `
                <tr>
                  <td>${row.id}</td>
                  <td>${row.fromWallet.user.firstName} ${row.fromWallet.user.lastName}</td>
                  <td>${row.toWallet.user.firstName} ${row.toWallet.user.lastName}</td>
                  <td>${row.amount}</td>
                  <td>${row.description}</td>
                  <td>${row.createdAt}</td>
                  <td>${row.type.name}</td>
                  <td>${sentenceCase(row.status)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    printWindow.document.write(tableHtml);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      <Helmet>
        <title>Transactions | e-Transaction</title>
      </Helmet>
      <Container sx={{ minWidth: '100%' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h4" gutterBottom>
            My Transactions
          </Typography>
        </Stack>

        {/* Budget Section */}
        <Card sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" p={2}>
            <Typography variant="h6">Set Your Budget</Typography>
            <TextField
              label="Budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ width: 120 }}
            />
          </Stack>
        </Card>

        {/* Filters for Transaction Type, Date, and Categories */}
        <Card sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" p={2}>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Transaction Type</InputLabel>
              <Select value={transactionType} onChange={handleTransactionTypeChange} label="Transaction Type">
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="in">In</MenuItem>
                <MenuItem value="out">Out</MenuItem>
              </Select>
            </FormControl>

            <TextField
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              sx={{ width: 150 }}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              sx={{ width: 150 }}
              InputLabelProps={{ shrink: true }}
            />

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Category</InputLabel>
              <Select value={selectedCategory} onChange={handleCategoryChange} label="Category">
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Card>

        {/* Print Report Button */}
        <Card sx={{ mb: 2 }}>
          <Stack direction="row" justifyContent="space-between" p={2}>
            <Button variant="contained" color="primary" onClick={printReport}>
              Print Report
            </Button>
          </Stack>
        </Card>

        {/* Transaction Table */}
        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TransactionListHead headLabel={TABLE_HEAD} />
                <TableBody>
                  {data &&
                    data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id, amount, description, createdAt, fromWallet, toWallet, type, status } = row;
                      const selectedRecord = selected.indexOf(id) !== -1;
                      return (
                        <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedRecord}>
                          <TableCell align="left" sx={{ paddingLeft: 5 }}>{id}</TableCell>
                          <TableCell align="left">{`${fromWallet.user.firstName} ${fromWallet.user.lastName}`}</TableCell>
                          <TableCell align="left">{`${toWallet.user.firstName} ${toWallet.user.lastName}`}</TableCell>
                          <TableCell align="right">{amount}</TableCell>
                          <TableCell align="left">{description}</TableCell>
                          <TableCell align="left">{createdAt}</TableCell>
                          <TableCell align="left">{type.name}</TableCell>
                          <TableCell align="left">
                            <Label color={status === 'SUCCESS' ? 'success' : 'warning'}>{sentenceCase(status)}</Label>
                          </TableCell>
                          <TableCell align="right" width="20">
                            <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data?.length > 0 ? data.length : 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}

import { useEffect, useState } from 'react';
import type {
  FC} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  makeStyles,
  Dialog,
  Grid,
  IconButton,
  SvgIcon,
  Tooltip,
  TablePagination
} from '@material-ui/core';
import {
  Edit as EditIcon,
  Trash as DeleteIcon,
  Search as SearchIcon
} from 'react-feather';

import SearchIcon2 from '@material-ui/icons/Search';
import AddIcon2 from '@material-ui/icons/Add';

import type { Theme } from 'src/theme';
import {getClientes, deleteCliente} from 'src/apis/clienteApi';
import useSettings from 'src/hooks/useSettings';
import ConfirmModal from 'src/components/ConfirmModal';
import { useSnackbar } from 'notistack';

interface TablesProps {
  className?: string;
}

const applyPagination = (clientes: any[], page: number, limit: number): any[] => {
  return clientes.slice(page * limit, page * limit + limit);
};
const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  bulkOperations: {
    position: 'relative'
  },
  bulkActions: {
    paddingLeft: 4,
    paddingRight: 4,
    marginTop: 6,
    position: 'absolute',
    width: '100%',
    zIndex: 2,
    backgroundColor: theme.palette.background.default
  },
  bulkAction: {
    marginLeft: theme.spacing(2)
  },
  queryField: {
    width: 200
  },
  queryFieldMargin: {
    marginLeft: theme.spacing(2),
  },
  categoryField: {
    width: 200,
    flexBasis: 200
  },
  availabilityField: {
    width: 200,
    marginLeft: theme.spacing(2),
    flexBasis: 200
  },
  buttonBox: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  stockField: {
    marginLeft: theme.spacing(2)
  },
  shippableField: {
    marginLeft: theme.spacing(2)
  },
  imageCell: {
    fontSize: 0,
    width: 68,
    flexBasis: 68,
    flexGrow: 0,
    flexShrink: 0
  },
  image: {
    height: 68,
    width: 68
  }
}));
const OCTable: FC<TablesProps> = ({ className, ...rest }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { settings, saveSettings } = useSettings();
  const [values, setValues] = useState({
    direction: settings.direction,
    responsiveFontSizes: settings.responsiveFontSizes,
    theme: settings.theme
  });
  const [clientes, setClientes] = useState<any>([]);
  const [filters, setFilters] = useState({
    business: '',
    ruc: '',
    isCliente: true,
    isProveedor: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteID, setDeleteID] = useState('-1');
  const [editID, setEditID] = useState(-1);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [page, setPage] = useState<number>(0);
  const [limit] = useState<number>(15);
  const paginatedClientes = applyPagination(clientes, page, limit);
  useEffect(() => {
    _getInitialData();
  }, [])
  const _getInitialData = () => {
    handleSearch();
  }
  const handleModalClose = (): void => {
    setIsModalOpen(false);
  };
  const handleSearch =() => {
    getClientes(filters).then(res => {
      setClientes(res);
    }).catch(err => {
      setClientes([]);
    })
  }
  const handleDelete =(id) => {
    setDeleteID(id);
    setIsModalOpen2(true);
  }
  const handleEdit =(id) => {
    setEditID(id);
    setIsModalOpen(true);
  }
  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };
  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box p={3} alignItems="center">
        <Grid container spacing={3}>
          <Grid item lg={6} sm={6} xs={12}>
            <Grid container spacing={3}>
              <Grid item lg={4} sm={6} xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="RUC Prov."
                  placeholder="RUC Prov."
                  variant="outlined"
                  value={filters.business}
                  onChange={(e) => setFilters({...filters, business: e.target.value})}
                />
              </Grid>
              <Grid item lg={4} sm={6} xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Moneda"
                  placeholder="Moneda"
                  variant="outlined"
                  value={filters.ruc}
                  onChange={(e) => setFilters({...filters, ruc: e.target.value})}
                />
              </Grid>
              <Grid item lg={4} sm={6} xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Estado"
                  placeholder="Estado"
                  variant="outlined"
                  value={filters.ruc}
                  onChange={(e) => setFilters({...filters, ruc: e.target.value})}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={2} sm={2} xs={12} ><></></Grid>
          <Grid item lg={4} sm={3} xs={12}>
            <Grid container spacing={3}>
              <Grid item>
                <Button onClick={handleSearch} variant="contained" color="primary" startIcon={<SearchIcon2 />}>{'Buscar'}</Button>
              </Grid>
              <Grid item>
                <Button variant="contained" color="secondary" startIcon={<AddIcon2 />} onClick={() => handleEdit('-1')}>{'Nuevo'}</Button>
              </Grid>
            </Grid>
          </Grid>      
        </Grid>
      </Box>  
      <PerfectScrollbar>
        <Box minWidth={1200}>
          <Table
            stickyHeader >
            <TableHead style={{background: 'red'}}>
              <TableRow>
                <TableCell>
                SERIE
                </TableCell>
                <TableCell>
                CÓDIGO
                </TableCell>
                <TableCell>
                RUC PROVEEDOR
                </TableCell>
                <TableCell>
                PROVEEDOR
                </TableCell>
                <TableCell>
                ESTADO
                </TableCell>
                <TableCell>
                MONEDA
                </TableCell>
                <TableCell>
                MONTO TOTAL
                </TableCell>
                <TableCell align="right">
                  &nbsp;
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedClientes.map((item, index) => {
                return (
                  <TableRow
                   style={{height: 30 }}
                    hover
                    key={item.cli_c_vraz_soc}
                  >
                    <TableCell>
                     {item.cli_c_vdoc_id}
                    </TableCell>
                    <TableCell>
                     {item.cli_c_vrubro}
                    </TableCell>
                    <TableCell>
                     {item.cli_c_bproveedor}
                    </TableCell>
                    <TableCell>
                     {item.cli_c_bcliente}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Editar" aria-label="Editar">
                        <IconButton onClick={() =>handleEdit(index)}>
                          <SvgIcon fontSize="small">
                            <EditIcon />
                          </SvgIcon>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar" aria-label="Eliminar">
                        <IconButton onClick={() =>handleDelete(item.itm_c_iid)}>
                          <SvgIcon fontSize="small">
                            <DeleteIcon />
                          </SvgIcon>
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
                      count={clientes.length}
                      onPageChange={handlePageChange}
                      onRowsPerPageChange={() => { }}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[15]}
          />
        </Box>
      </PerfectScrollbar>
      
    </Card>
  );
};

OCTable.propTypes = {
  className: PropTypes.string,
};

OCTable.defaultProps = {
  
};

export default OCTable;

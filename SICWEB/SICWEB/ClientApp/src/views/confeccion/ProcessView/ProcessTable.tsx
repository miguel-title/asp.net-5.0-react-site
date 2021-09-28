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
  TablePagination,
  FormGroup,
  FormControlLabel,
  Divider,
  FormHelperText,
  Select,
  MenuItem
} from '@material-ui/core';
import * as Yup from 'yup';
import { FieldArray, Formik } from 'formik';
import {
  Edit as EditIcon,
  Trash as DeleteIcon,
  Search as SearchIcon
} from 'react-feather';

import SaveIcon from '@material-ui/icons/Save';
import SearchIcon2 from '@material-ui/icons/Search';
import AddIcon2 from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Cancel';

import type { Theme } from 'src/theme';
import useSettings from 'src/hooks/useSettings';
import ConfirmModal from 'src/components/ConfirmModal';
import { useSnackbar } from 'notistack';

import { deleteStyle, getStyle, getTallas } from 'src/apis/styleApi';
import { useHistory } from 'react-router-dom';
import { getEstiloProcess, getProcess, saveEstiloProcess } from 'src/apis/processApi';
import { getConstantValue } from 'typescript';
interface TablesProps {
  className?: string;
  _estilo?: any;
  onCancel?: () => void;
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

const ProcessTable: FC<TablesProps> = ({ className, _estilo, ...rest }) => {
	const classes = useStyles();
	const { enqueueSnackbar } = useSnackbar();
	const { settings, saveSettings } = useSettings();
	const history = useHistory();
	const [values, setValues] = useState({
		direction: settings.direction,
		responsiveFontSizes: settings.responsiveFontSizes,
		theme: settings.theme
	});
	const [styles, setStyles] = useState<any>([]);
	const [filters, setFilters] = useState({
		code: '',
		name: '',
		color: ''
	});
	const [estilo, setEstilo] = useState(_estilo);
	const [tallas, setTallas] = useState<any>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [deleteID, setDeleteID] = useState('-1');
	const [editID, setEditID] = useState(-1);

  const [allProcess, setAllProcess] = useState(null);
	const [estiloProcess, setEstiloProcess] = useState(null);
	const [isModalOpen2, setIsModalOpen2] = useState(false);
	const [page, setPage] = useState<number>(0);
	const [limit] = useState<number>(15);
	const paginatedStyles = applyPagination(styles, page, limit);
	useEffect(() => {
		_getInitialData();
	}, [])

	const getChecked = (tid, sizes) => {
		for(var i=0; i<sizes.length; i++){
			if(sizes[i].key === tid) return true;
		}
		return false;
	}

	const _getInitialData = () => {
    getEstiloProcess({
      id: _estilo.estilo_c_iid.toString()
    }).then((res: any[]) => {
      setEstiloProcess(res);
    }).catch(err => {
			setEstiloProcess([]);
		});
    getProcess().then((res: any[]) => {
      setAllProcess(res);
		}).catch(err => {
			setAllProcess([]);
		});
		getTallas().then((res: any[]) => {
      var _sizes = [];
      for(var i=0; i<res.length; i++){
        _sizes.push({
          id: i,
          key: res[i].talla_c_vid,
          description: res[i].talla_c_vdescripcion,
          check: getChecked(res[i].talla_c_vid, _estilo.sizeName),
        })
      }
      console.log(_sizes);
      setTallas(_sizes)
		}).catch(err => {
			setTallas([]);
		});
		handleSearch();
	}


  const getInitialValues = () => {
    console.log('_estilo', _estilo);
    
		return {
			id: '-1',
      estilo_c_iid: _estilo.estilo_c_iid,
			estiloProcesses: estiloProcess,
			submit: null
		};
	}  
	const handleModalClose = (): void => {
		setIsModalOpen(false);
	};
	const handleSearch =() => {
		getStyle(filters).then(res => {
			setStyles(res);
		}).catch(err => {
			setStyles([]);
		})
	}

  const addEstiloProcess =() => {

  }

  const handleSave =() => {

  }

  const handleCancel =() => {
  }
  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const sizeString = (sizes) => {
    var res = '';
    for(var i=0; i<sizes.length; i++){
      res+= (i > 0 ? ', ' : '') + sizes[i].key;
    }
    return res;
  }

  const getTotal = (values, type) => {
    console.log('----',values)
    var sum = 0;
    if(type === 0) {
      for(var i=0; i<values.estiloProcesses.length; i++){
        sum += values.estiloProcesses[i].esti_proc_detalle_c_ecosto * 1;
      }
      return Math.round(sum * 100)/100;
    }else{
      for(var i=0; i<values.estiloProcesses.length; i++){
        sum += values.estiloProcesses[i].esti_proc_detalle_c_isegundos * 1;
      }
      return Math.round(sum * 100)/100;
    }
  }

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Box p={3} alignItems="center">
        <Grid container spacing={3}>
          <Grid item lg={12} sm={12} xs={12}>
            <Grid container spacing={3}>
              <Grid item lg={6} sm={6} xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Estilo"
                  placeholder="Estilo"
                  variant="outlined"
                  value={estilo ? estilo.estilo_c_vcodigo + ' ' +estilo.estilo_c_vnombre : ''}
                  // onChange={(e) => setFilters({...filters, code: e.target.value})}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>
              <Grid item lg={6} sm={6} xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Código"
                  placeholder="Código"
                  variant="outlined"
                  value={estilo ? estilo.estilo_c_vcodigo : ''}
                  // onChange={(e) => setFilters({...filters, name: e.target.value})}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>
            </Grid>
          </Grid>   
          <Grid item lg={12} sm={12} xs={12}>
            {
              tallas && tallas.length > 0 &&
              <Formik
                initialValues={{
                  sizes: tallas,
                  submit: null
                }}
                validationSchema={Yup.object().shape({                    
                  sizes: Yup.mixed().notOneOf(['-1'], 'Este campo es requerido.'),                    
                })}
                onSubmit={async (values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                }) => {
                    console.log(values)
                
                    saveSettings({saving: true});
                    window.setTimeout(() => {
                        // saveStyle(values).then(res => {
                        //     saveSettings({saving: false});
                        //     // _getInitialData();
                        //     enqueueSnackbar('Tus datos se han guardado exitosamente.', {
                        //     variant: 'success'
                        //     });
                        //     resetForm();
                        //     setStatus({ success: true });
                        //     setSubmitting(false);
                        //     handleSearch();
                        //     onCancel();
                        // }).catch(err => {
                        //     // _getInitialData();
                        //     enqueueSnackbar('No se pudo guardar.', {
                        //     variant: 'error'
                        //     });
                        //     saveSettings({saving: false});
                        // });
                    }, 1000);
                }}
              >
                {({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    setFieldTouched,
                    setFieldValue,
                    touched,
                    values
                }) => (
                    <form onSubmit={handleSubmit}>
                        <Box p={3}>         
                            <Grid container spacing={3}>
                                <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                    <Grid container spacing={3}>
                                        <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
                                            <Grid container spacing={1} style={{background: '#efefef'}}>
                                                <Grid  item xl={12} xs={12}>
                                                    <label>&nbsp;&nbsp;&nbsp;&nbsp;Talla <span style={{color: 'red'}}>*</span></label>
                                                </Grid> 
                                                <Grid  item xl={12} xs={12}
                                                    style={{maxHeight: 200, overflowY: 'scroll',}}>
                                                    {
                                                        values.sizes && values.sizes.length > 0 ? ( 
                                                            <FormGroup>
                                                                {                                                            
                                                                    values.sizes.map((t, i) =>
                                                                        <FormControlLabel
                                                                            key={i.toString()}
                                                                            control={<Checkbox checked={values.sizes[i].check} onChange={handleChange} name={`sizes[${i}].check`} />}
                                                                            label={t.key}
                                                                        />
                                                                    )
                                                                }
                                                            </FormGroup>
                                                        ):
                                                        <></>
                                                    }   
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                        <Divider />
                        {errors.submit && (
                            <Box mt={3}>
                            <FormHelperText error>
                                {errors.submit}
                            </FormHelperText>
                            </Box>
                        )}
                        {/* <Box
                            p={2}
                            display="flex"
                            alignItems="center"
                        >
                            <Box flexGrow={1} />
                            <Button onClick={onCancel}>
                                {'Cancelar'}
                            </Button>
                            <Button
                            variant="contained"
                            type="submit"
                            disabled={isSubmitting}
                            color="secondary"
                            className={classes.confirmButton}
                            >
                                {'Confirmar'}
                            </Button>
                        </Box> */}
                    </form>
                )}
            </Formik>
            }
          </Grid> 
        </Grid>
      </Box>  
      <PerfectScrollbar>
        {
          estiloProcess &&
          <Box minWidth={1200} style={{paddingBottom: 40,}}>
              <Formik
                initialValues={getInitialValues()}
                validationSchema={Yup.object().shape({      
                  estiloProcesses: Yup.array()
                    .of(
                        Yup.object().shape({
                          proceso_c_vid: Yup.mixed().notOneOf(['-1'], 'Este campo es requerido.'),
                          esti_proc_detalle_c_vdescripcion: Yup.string().max(50, 'Debe tener 50 caracteres como máximo').required('Se requiere una razón social'),
                          esti_proc_detalle_c_ecosto: Yup.number().required('Este campo es requerido').positive('Este campo es requerido'),
                          esti_proc_detalle_c_isegundos: Yup.number().required('Este campo es requerido').positive('Este campo es requerido'),
                        })
                    )
                })}
                onSubmit={async (values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                }) => {
                  console.log(values)
                    
                    saveSettings({saving: true});
                    window.setTimeout(() => {
                      saveEstiloProcess(values).then(res => {
                            saveSettings({saving: false});
                            // _getInitialData();
                            enqueueSnackbar('Tus datos se han guardado exitosamente.', {
                            variant: 'success'
                            });
                            resetForm();
                            setStatus({ success: true });
                            setSubmitting(false);
                            window.location.href = '';
                        }).catch(err => {
                            // _getInitialData();
                            enqueueSnackbar('No se pudo guardar.', {
                              variant: 'error'
                            });
                            saveSettings({saving: false});
                        });
                    }, 1000);
                }}
                >
                {({
                    errors,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    setFieldTouched,
                    setFieldValue,
                    touched,
                    values
                }) => (
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={5}>
                      <Grid item>
                        <Box p={3}>
                          <Button onClick={handleSearch} variant="contained" color="primary" startIcon={<AddIcon2 />}>{'Agregar Proceso'}</Button>
                        </Box>
                      </Grid>
                      <Grid item>
                        <Box p={3}>
                          <Button onClick={()=>{
                            addEstiloProcess();
                            var _temp = values.estiloProcesses;
                            _temp.push({
                              _id: -1,
                              esti_proceso_c_iid: 0,
                              proceso_c_vid: '-1',
                              esti_proc_detalle_c_vdescripcion: '',
                              esti_proc_detalle_c_ecosto: 0,
                              esti_proc_detalle_c_isegundos: 0,
                            });
                            setFieldValue('estiloProcesses', _temp);
                          }} variant="contained" color="primary" startIcon={<AddIcon2 />}>{'Añadir'}</Button>
                        </Box>
                      </Grid>
                      <Grid item>
                        <Box p={3}>
                          <Button 
                            type="submit"
                            disabled={isSubmitting}
                            variant="contained" color="secondary" startIcon={<SaveIcon />}>
                            {'Guardar'}
                          </Button>
                        </Box>
                      </Grid>
                      <Grid item>
                        <Box p={3}>
                          <Button onClick={()=>{
                            history.goBack();

                          }} variant="contained" startIcon={<CancelIcon />}>{'Cancelar'}</Button>
                        </Box>
                      </Grid>
                      
                    </Grid>
                    <Table
                    stickyHeader >
                    <TableHead style={{background: 'red'}}>
                      <TableRow>
                        <TableCell>
                        Código
                        </TableCell>
                        <TableCell>
                        Descripción
                        </TableCell>
                        <TableCell>
                        Costo*
                        </TableCell>
                        <TableCell>
                        Esfuerzo en '
                        </TableCell>
                        {/* <TableCell align="right">
                        &nbsp;
                        </TableCell>
                        <TableCell align="right">
                        &nbsp;
                        </TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        values.estiloProcesses.map((process, index) =>
                          <TableRow
                            style={{height: 30 }}
                            hover
                            // key={item.estilo_c_iid}
                            key={index.toString()}
                          >
                            <TableCell>
                              {/* {process.proceso_c_vid} */}
                              <TextField
                                size="small"
                                style={{
                                  minWidth: 100,
                                }}
                                name={`estiloProcesses[${index}].proceso_c_vid`}
                                error={Boolean(
                                  touched.estiloProcesses && touched.estiloProcesses[index] && touched.estiloProcesses[index].proceso_c_vid &&
                                  errors.estiloProcesses && errors.estiloProcesses[index] && errors.estiloProcesses[index]['proceso_c_vid']
                                )}
                                helperText={
                                    <>{touched.estiloProcesses && touched.estiloProcesses[index] && touched.estiloProcesses[index].proceso_c_vid &&
                                    errors.estiloProcesses && errors.estiloProcesses[index] && errors.estiloProcesses[index]['proceso_c_vid']}</>
                                }
                                SelectProps={{ native: true }}
                                select
                                onBlur={handleBlur}
                                value={values.estiloProcesses[index].proceso_c_vid}
                                onChange={(e) => {
                                  var _temp = values.estiloProcesses;
                                  _temp[index].proceso_c_vid = e.target.value;
                                  setFieldValue('estiloProcesses', _temp);
                                }}
                              >
                                <option selected key="-1" value="-1">{'-- Seleccionar --'}</option>
                                {allProcess && allProcess.length > 0 && allProcess.map((p, index2) => 
                                  <option key={index2.toString()} value={p.proceso_c_vid}>
                                    {p.proceso_c_vdescripcion}
                                  </option>
                                )}
                              </TextField>
                            </TableCell>
                            <TableCell>
                              {/* <input 
                                type="text"
                                value={process.esti_proc_detalle_c_vdescripcion} 
                                onChange={(e) => {
                                  var _temp = values.estiloProcesses;
                                  _temp[index].esti_proc_detalle_c_vdescripcion = e.target.value;
                                  setFieldValue('estiloProcesses', _temp);
                                }}
                                onBlur={handleBlur}
                                style={{
                                  border: 
                                  process.esti_proc_detalle_c_vdescripcion.length <1 ?
                                  '1px solid red' : ''
                                }}
                              /> */}
                              <TextField 
                                name={`estiloProcesses[${index}].esti_proc_detalle_c_vdescripcion`}
                                error={Boolean(
                                  touched.estiloProcesses && touched.estiloProcesses[index] && touched.estiloProcesses[index].esti_proc_detalle_c_vdescripcion &&
                                  errors.estiloProcesses && errors.estiloProcesses[index] && errors.estiloProcesses[index]['esti_proc_detalle_c_vdescripcion']
                                )}
                                fullWidth
                                helperText={
                                    <>{touched.estiloProcesses && touched.estiloProcesses[index] && touched.estiloProcesses[index].esti_proc_detalle_c_vdescripcion &&
                                    errors.estiloProcesses && errors.estiloProcesses[index] && errors.estiloProcesses[index]['esti_proc_detalle_c_vdescripcion']}</>
                                }
                                onBlur={handleBlur}
                                value={values.estiloProcesses[index].esti_proc_detalle_c_vdescripcion}
                                onChange={(e) => {
                                  var _temp = values.estiloProcesses;
                                  _temp[index].esti_proc_detalle_c_vdescripcion = e.target.value;
                                  setFieldValue('estiloProcesses', _temp);
                                }}
                                
                              />                              
                            </TableCell>
                            <TableCell>
                              <TextField 
                              style={{
                                width: 150,
                              }}
                                name={`estiloProcesses[${index}].esti_proc_detalle_c_ecosto`}
                                error={Boolean(
                                  touched.estiloProcesses && touched.estiloProcesses[index] && touched.estiloProcesses[index].esti_proc_detalle_c_ecosto &&
                                  errors.estiloProcesses && errors.estiloProcesses[index] && errors.estiloProcesses[index]['esti_proc_detalle_c_ecosto']
                                )}
                                type="number"
                                fullWidth
                                helperText={
                                    <>{touched.estiloProcesses && touched.estiloProcesses[index] && touched.estiloProcesses[index].esti_proc_detalle_c_ecosto &&
                                    errors.estiloProcesses && errors.estiloProcesses[index] && errors.estiloProcesses[index]['esti_proc_detalle_c_ecosto']}</>
                                }
                                onBlur={handleBlur}
                                value={values.estiloProcesses[index].esti_proc_detalle_c_ecosto}
                                onChange={(e) => {
                                  var _temp = values.estiloProcesses;
                                  _temp[index].esti_proc_detalle_c_ecosto = e.target.value;
                                  setFieldValue('estiloProcesses', _temp);
                                }}
                                
                              />  
                            </TableCell>
                            <TableCell>
                            <TextField 
                              style={{
                                width: 150,
                              }}
                                name={`estiloProcesses[${index}].esti_proc_detalle_c_isegundos`}
                                error={Boolean(
                                  touched.estiloProcesses && touched.estiloProcesses[index] && touched.estiloProcesses[index].esti_proc_detalle_c_isegundos &&
                                  errors.estiloProcesses && errors.estiloProcesses[index] && errors.estiloProcesses[index]['esti_proc_detalle_c_isegundos']
                                )}
                                type="number"
                                fullWidth
                                helperText={
                                    <>{touched.estiloProcesses && touched.estiloProcesses[index] && touched.estiloProcesses[index].esti_proc_detalle_c_isegundos &&
                                    errors.estiloProcesses && errors.estiloProcesses[index] && errors.estiloProcesses[index]['esti_proc_detalle_c_isegundos']}</>
                                }
                                onBlur={handleBlur}
                                value={values.estiloProcesses[index].esti_proc_detalle_c_isegundos}
                                onChange={(e) => {
                                  var _temp = values.estiloProcesses;
                                  _temp[index].esti_proc_detalle_c_isegundos = e.target.value;
                                  setFieldValue('estiloProcesses', _temp);
                                }}
                                
                              />  
                            </TableCell>
                          </TableRow>
                        )
                      }
                      <TableRow
                            style={{height: 30 }}
                            hover
                          >
                            <TableCell>

                            </TableCell>
                            <TableCell>
                            TOTAL
                            </TableCell>
                            <TableCell>
                            {
                              getTotal(values, 0)
                            }
                            </TableCell>
                            <TableCell>
                            {
                              getTotal(values, 1)
                            }
                            </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  {/* <TablePagination
                    component="div"
                        count={styles.length}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={() => { }}
                    page={page}
                    rowsPerPage={limit}
                    rowsPerPageOptions={[15]}
                  /> */}
                </form>
                )}
              </Formik>
          
        </Box>
      
        }
        </PerfectScrollbar>
      
      <ConfirmModal 
        open={isModalOpen2}
        title={'¿Eliminar este artículo?'}
        setOpen={() => setIsModalOpen2(false)}
        onConfirm={() => {  
          saveSettings({saving: true});  
          deleteStyle(deleteID).then(res => {
              saveSettings({saving: false});
              handleSearch();
              enqueueSnackbar('Tus datos se han guardado exitosamente.', {
              variant: 'success'
              });
              
              setIsModalOpen2(false);
              handleSearch();
          }).catch(err => {
              
            setIsModalOpen2(false);
            handleSearch();
              enqueueSnackbar('No se pudo guardar.', {
              variant: 'error'
              });
              saveSettings({saving: false});
          });  
        }}
      />
    </Card>
  );
};

ProcessTable.propTypes = {
  className: PropTypes.string,
};

ProcessTable.defaultProps = {
  
};

export default ProcessTable;

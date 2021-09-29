import { useEffect, useState } from 'react';
import type { FC } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    Divider,
    FormHelperText,
    makeStyles,
    Grid,
    Dialog
} from '@material-ui/core';
import AddIcon2 from '@material-ui/icons/Add';
import type { Theme } from 'src/theme';
import type { Event } from 'src/types/calendar';
import { getParentMenus, saveMenu } from 'src/apis/menuApi';
import { useSnackbar } from 'notistack';
import useSettings from 'src/hooks/useSettings';


interface NewMenuProps {
    editID: number,
    parent_id: number,
    _initialValue?: any,
    menu?: any[],
    parent_menu?: any[],
    nivel?: any[],
    pagina?: any[],
    opciones?: any[],
    estado?: number,
    event?: Event;
    _getInitialData?: () => void;
    onAddComplete?: () => void;
    onCancel?: () => void;
    onDeleteComplete?: () => void;
    onEditComplete?: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    confirmButton: {
        marginLeft: theme.spacing(2)
    }
}));

const NewMenu: FC<NewMenuProps> = ({
    editID,
    parent_id,
    _initialValue,
    menu,
    parent_menu,
    nivel,
    pagina,
    opciones,
    estado,
    event,
    _getInitialData,
    onAddComplete,
    onCancel,
    onDeleteComplete,
    onEditComplete
}) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { saveSettings } = useSettings();
    const [isModalOpen3, setIsModalOpen3] = useState(false);
    const [parentMenus, setParentMenus] = useState<any>([]);

    const [modalState, setModalState] = useState(0);

    const _getParentMenus = () => {
        getParentMenus().then(res => {
            setParentMenus(res);
        })
    }

    const handleModalClose3 = (): void => {
        setIsModalOpen3(false);
    };

    const handleModalOpen3 = (): void => {
        setIsModalOpen3(true);
    };

    const estadoOptions = [{
        value: 1,
        label: "Activo"
    },
    {
        value: 0,
        label: "Inactivo"
    }]

    const getInitialValues = () => {
        if (editID > -1) {
            return _.merge({}, {
                id: -1,
                parent_id: -1,
                menu: '',
                parent_menu: '',
                nivel: '',
                pagina: '',
                opciones: '',
                estado: 1,
                submit: null
            }, {
                id: _initialValue[editID].menu_c_iid,
                parent_id: _initialValue[editID].parent_menu_c_iid,
                menu: _initialValue[editID].menu_c_vnomb,
                parent_menu: _initialValue[editID].parent_menu_c_vnomb,
                nivel: _initialValue[editID].menu_c_ynivel,
                pagina: _initialValue[editID].menu_c_vpag_asp,
                opciones: _initialValue[editID].opciones,
                estado: _initialValue[editID].estado,
                submit: null
            });
        } else {
            return {
                id: -1,
                parent_id: -1,
                menu: '',
                parent_menu: '',
                nivel: '',
                pagina: '',
                opciones: '',
                estado: 1,
                submit: null
            };
        }


    };

    useEffect(() => {
        _getParentMenus();
    }, [])

    return (
        <>
            <Formik
                initialValues={getInitialValues()}
                validationSchema={Yup.object().shape({
                    menu: Yup.string().max(200, 'Debe tener 200 caracteres como máximo').required('Se requiere el menú'),
                    nivel: Yup.number().min(0),
                    pagina: Yup.string().max(200, 'Debe tener 200 caracteres como máximo').required('La página es requerida'),
                    opciones: Yup.string().max(200, 'Debe tener 200 caracteres como máximo'),
                    estado: Yup.number().min(0),
                })}
                onSubmit={async (values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                }) => {
                    saveSettings({ saving: true });
                    window.setTimeout(() => {
                        values["estado"] = Number(values?.estado) === 1 ? true : false;
                        values["nivel"] = values?.nivel === "" ? 0 : values?.nivel;
                        saveMenu(values).then(res => {
                            saveSettings({ saving: false });
                            _getInitialData();
                            enqueueSnackbar('Tus datos se han guardado exitosamente.', {
                                variant: 'success'
                            });
                            resetForm();
                            setStatus({ success: true });
                            setSubmitting(false);
                            onCancel();
                        }).catch(err => {
                            _getInitialData();
                            enqueueSnackbar('No se pudo guardar.', {
                                variant: 'error'
                            });
                            saveSettings({ saving: false });
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
                        <Box p={3}>
                            <Typography
                                align="center"
                                gutterBottom
                                variant="h4"
                                color="textPrimary"
                            >
                                {editID > -1 ? 'Editar Menú' : 'Nuevo Menú'}
                            </Typography>
                        </Box>
                        <Divider />
                        <Box p={3}>
                            <Grid container spacing={3}>
                                <Grid item lg={12} sm={12} xs={12}>
                                    <TextField
                                        size="small"
                                        error={Boolean(touched.menu && errors.menu)}
                                        fullWidth
                                        helperText={touched.menu && errors.menu}
                                        label={<label>Menú <span style={{ color: 'red' }}>*</span></label>}
                                        name="menu"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.menu}
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                    />
                                </Grid>
                                <Grid item lg={12} sm={12} xs={12}>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label={<label>Menú Padre</label>}
                                        name="parent_id"
                                        SelectProps={{ native: true }}
                                        select
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            _getParentMenus();
                                            handleChange(e);
                                        }}
                                        value={values.parent_id}
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                    >
                                        {
                                            <option key="-1" value="-1"></option>
                                        }
                                        {parentMenus.map((parentMenu) => (
                                            <option
                                                selected
                                                key={parentMenu.menu_c_iid}
                                                value={parentMenu.menu_c_iid}
                                            >
                                                {parentMenu.menu_c_vnomb}
                                            </option>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item lg={12} sm={12} xs={12} style={{ display: 'flex' }}>
                                    <TextField
                                        size="small"
                                        error={Boolean(touched.nivel && errors.nivel)}
                                        helperText={touched.nivel && errors.nivel}
                                        label={<label>Nivel</label>}
                                        name="nivel"
                                        fullWidth
                                        variant="outlined"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.nivel}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item lg={12} sm={12} xs={12}>
                                    <TextField
                                        size="small"
                                        error={Boolean(touched.pagina && errors.pagina)}
                                        fullWidth
                                        helperText={touched.pagina && errors.pagina}
                                        label={<label>Página <span style={{ color: 'red' }}>*</span></label>}
                                        name="pagina"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.pagina}
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                    />
                                </Grid>

                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item lg={12} sm={12} xs={12}>
                                    <TextField
                                        size="small"
                                        error={Boolean(touched.opciones && errors.opciones)}
                                        fullWidth
                                        label={<label>Opciones</label>}
                                        name="opciones"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.opciones}
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                    />
                                </Grid>
                                <Grid item lg={12} sm={12} xs={12} >
                                    <TextField
                                        size="small"
                                        fullWidth
                                        SelectProps={{ native: true }}
                                        select
                                        label={<label>Estado</label>}
                                        name="estado"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.estado}
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                    >
                                        {estadoOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </TextField>
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
                        <Box
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
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

NewMenu.propTypes = {
    // @ts-ignore
    event: PropTypes.object,
    onAddComplete: PropTypes.func,
    onCancel: PropTypes.func,
    onDeleteComplete: PropTypes.func,
    onEditComplete: PropTypes.func,
    // @ts-ignore
    range: PropTypes.object
};

export default NewMenu;

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
import NewOPC from './NewProfile';
import type { Theme } from 'src/theme';
import type { Event } from 'src/types/calendar';
import { saveUser, getProfiles } from 'src/apis/userApi';
import { useSnackbar } from 'notistack';
import useSettings from 'src/hooks/useSettings';


interface NewUserProps {
    editID: number,
    _initialValue?: any,
    name?:any[],
    lastname?:any[],
    mlastname?:any[],
    user?:any[],
    password?:any[],
    networkuser:any[],
    profile_id?:number,
    estado?:number,
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


const NewUser: FC<NewUserProps> = ({
    editID,
    _initialValue,
    name,
    lastname,
    mlastname,
    user,
    password,
    networkuser,
    profile_id,
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
    const [profiles, setProfiles] = useState<any>([]);

    const [vdesc, setVdesc] = useState<any>([]);
    const [bestado, setBestado] = useState<any>([]);
    
    const [opcs, setOPCs] = useState<any>([]);

    const [modalState, setModalState] = useState(0);

    const handleModalClose3 = (): void => {
        setIsModalOpen3(false);
            _getProfiles();
    };

    const handleModalOpen3 = (): void => {
        setIsModalOpen3(true);
    };

    const handleModalClose = (): void => {
        setIsModalOpen3(false);
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
                name: '',
                lastname: '',
                mlastname: '',
                user: '',
                password: '',
                networkuser: '',
                profile_id:1,
                estado: 1,
                submit: null
            }, {
                name: _initialValue[editID].name,
                lastname: _initialValue[editID].lastname,
                mlastname: _initialValue[editID].mlastname,
                user: _initialValue[editID].user,
                password: _initialValue[editID].password,
                networkuser: _initialValue[editID].networkuser,
                profile_id:_initialValue[editID].profile_id,
                estado: _initialValue[editID].estado,
                submit: null
            });
        } else {
            return {
                name: '',
                lastname: '',
                mlastname: '',
                user: '',
                password: '',
                networkuser: '',
                profile_id:1,
                estado: 1,
                submit: null
            };
        }


    };

    const _getProfiles = () => {
        getProfiles().then(res => {
            setProfiles(res);
        })
    }

    useEffect(() => {
        _getProfiles();
    }, [])

    return (
        <>
            <Formik
                initialValues={getInitialValues()}
                onSubmit={async (values, {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                }) => {
                    saveSettings({ saving: true });
                    window.setTimeout(() => {
                        values["estado"] = Number(values?.estado) === 1 ? true : false;
                        values['profile_id'] = Number(values?.profile_id);
                        values["method"] = editID;
                        saveUser(values).then(res => {
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
                            console.log(err);
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
                                {editID > -1 ? 'Editar Usuario' : 'Nuevo Usuario'}
                            </Typography>
                        </Box>
                        <Divider />
                        <Box p={3}>
                            <Grid container spacing={3}>
                                <Grid item lg={12} sm={12} xs={12}>
                                    <TextField
                                        size="small"
                                        error={Boolean(touched.name && errors.name)}
                                        fullWidth
                                        helperText={touched.name && errors.name}
                                        label={<label>Nombres <span style={{ color: 'red' }}>*</span></label>}
                                        name="name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.name}
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                    />
                                </Grid>
                                <Grid item lg={12} sm={12} xs={12}>
                                    <TextField
                                        size="small"
                                        error={Boolean(touched.lastname && errors.lastname)}
                                        fullWidth
                                        helperText={touched.lastname && errors.lastname}
                                        label={<label>Apellido Paterno <span style={{ color: 'red' }}>*</span></label>}
                                        name="lastname"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.lastname}
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                    />
                                </Grid>
                                
                                <Grid item lg={12} sm={12} xs={12}>
                                    <TextField
                                        size="small"
                                        error={Boolean(touched.mlastname && errors.mlastname)}
                                        fullWidth
                                        helperText={touched.mlastname && errors.mlastname}
                                        label={<label>Apellido  Materno  <span style={{ color: 'red' }}>*</span></label>}
                                        name="mlastname"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.mlastname}
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                    />
                                </Grid>
                                
                                <Grid item lg={12} sm={12} xs={12}>
                                    <TextField
                                        size="small"
                                        error={Boolean(touched.user && errors.user)}
                                        fullWidth
                                        helperText={touched.user && errors.user}
                                        label={<label>Usuario <span style={{ color: 'red' }}>*</span></label>}
                                        name="user"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        disabled={editID > -1 ? true : false}
                                        value={values.user}
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                    />
                                </Grid>
                                
                                <Grid item lg={12} sm={12} xs={12}>
                                    <TextField
                                        size="small"
                                        error={Boolean(touched.password && errors.password)}
                                        fullWidth
                                        helperText={touched.password && errors.password}
                                        label={<label>Password <span style={{ color: 'red' }}>*</span></label>}
                                        name="password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.password}
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
                                        label={<label>Usuario de red</label>}
                                        name="networkuser"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        disabled={true}
                                        value={values.networkuser}
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item lg={12} sm={12} xs={12} style={{display: 'flex'}}>
                                    <TextField
                                        size="small"
                                        error={Boolean(touched.profile_id && errors.profile_id)}
                                        fullWidth
                                        label={<label>Perfiles</label>}
                                        name="profile_id"
                                        SelectProps={{ native: true }}
                                        select
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.profile_id}
                                        variant="outlined"
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                    >
                                        {profiles.map((profile) => (
                                            <option
                                            key={profile.perf_c_yid}
                                            value={profile.perf_c_yid}
                                            >
                                            {profile.perf_c_vnomb}
                                            </option>
                                        ))}
                                    </TextField>
                                    <IconButton 
                                        size="small" 
                                        color="secondary" 
                                        aria-label="add to shopping cart"
                                        onClick={() => { setModalState(0);handleModalOpen3()}}
                                    >
                                        <AddIcon2 />
                                    </IconButton>
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
            <Dialog
                maxWidth="md"
                fullWidth
                onClose={handleModalClose3}
                open={isModalOpen3}
            >
                {/* Dialog renders its body even if not open */}
                {isModalOpen3 && (
                    <NewOPC
                    menuID={_initialValue[editID].menu_c_iid}
                    vdesc={vdesc}
                    bestado={bestado}
                    onAddComplete={handleModalClose3}
                    onCancel={handleModalClose3}
                    onDeleteComplete={handleModalClose3}
                    onEditComplete={handleModalClose3}
                />
                )}
            </Dialog>
        </>
    );
};

NewUser.propTypes = {
    // @ts-ignore
    event: PropTypes.object,
    onAddComplete: PropTypes.func,
    onCancel: PropTypes.func,
    onDeleteComplete: PropTypes.func,
    onEditComplete: PropTypes.func,
    // @ts-ignore
    range: PropTypes.object
};

export default NewUser;

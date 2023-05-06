import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import {
    Grid, Button, DialogActions,
    Autocomplete, Accordion, AccordionSummary, AccordionDetails
    , Typography
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useParams, useNavigate } from "react-router-dom"
import axios from 'axios'
// import "../formik/FormStyles.css"
import ToastNotification from '../toast/ToastNotification';
import CustomizedSelectForFormik from '../formik/CustomizedSelectForFormik';
import { RolesDepartment, UserAccessPicklist, UserRolePicklist } from '../../data/pickLists';
import './Form.css'
import { PermissionSavedValues, PermissionSetInitialValues } from '../formik/IntialValues/formValues';


const url = `${process.env.REACT_APP_SERVER_URL}/upsertPermission`;
const urlgetUsersByName = `${process.env.REACT_APP_SERVER_URL}/getUsers`;

const PermissiionSetForm = ({ item }) => {

    const [singlePermission, setsinglePermission] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const [showNew, setshowNew] = useState()
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

    const [userRecords, setUserRecord] = useState([])


    useEffect(() => {
        console.log('passed record', location.state.record.item);

        setsinglePermission(location.state?.record?.item ?? {});
        setshowNew(!location.state.record.item)
    }, [])

    const initialValues = PermissionSetInitialValues
    const savedValues = PermissionSavedValues(singlePermission)

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

    const validationSchema = Yup.object({
        permissionName: Yup
            .string()
            .required('Required'),
    })

    const formSubmission = (values) => {

        console.log('form submission value', values);
        // let dateSeconds = new Date().getTime();
        // let createDateSec = new Date(values.createdDate).getTime()


        // if (showNew) {
        //     values.modifiedDate = dateSeconds;
        //     values.createdDate = dateSeconds;
        //     values.createdBy = (sessionStorage.getItem("loggedInUser"));
        //     values.modifiedBy = (sessionStorage.getItem("loggedInUser"));    
        //     values.userDetails=JSON.stringify(values.userDetails)
        // }
        // else if (!showNew) {
        //     values.modifiedDate = dateSeconds;
        //     values.createdDate = createDateSec;
        //     values.createdBy = singlePermission.createdBy;
        //     values.modifiedBy = (sessionStorage.getItem("loggedInUser"));

        // }
        // console.log('after change form submission value', values);

    }

    const handleFormClose = () => {
        navigate(-1)
    }

    return (
        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                {
                    showNew ? <h3>New User</h3> : <h3>User Detail Page </h3>
                }
            </div>
            <div>
                <Formik
                    enableReinitialize={true}
                    initialValues={showNew ? initialValues : savedValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => { formSubmission(values) }}
                >
                    {(props) => {
                        const {
                            values,
                            dirty,
                            isSubmitting,
                            handleChange,
                            handleSubmit,
                            handleReset,
                            setFieldValue,
                        } = props;

                        return (
                            <>
                                <ToastNotification notify={notify} setNotify={setNotify} />
                                <Form className='my-form'>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="permissionName">Permission Set Name:</label>
                                            <Field type="text" id="permissionName" name="permissionName" class="form-input" />

                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="userDetails">User Details:</label>
                                            <Field type="text" id="userDetails" name="userDetails" class="form-input" />
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <Accordion>
                                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                    <Typography variant='h4' className="accordion-Header">Permission Sets</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>

                                                    <FieldArray name="permissionSets">
                                                        {({ remove, push }) => (
                                                            <>
                                                                {values.permissionSets && values.permissionSets.length > 0 &&
                                                                    values.permissionSets.map((obj, index) => (
                                                                        <div key={index} style={{ margin: '5px' }}>
                                                                            <Grid container spacing={2} alignItems="center">
                                                                                <Grid item xs={4} md={4}>
                                                                                    <h3>{obj.object}</h3>
                                                                                </Grid>
                                                                                <Grid item xs={8} md={8}>
                                                                                    <Grid container spacing={2} alignItems="center">
                                                                                        <Grid item xs={3} md={3}>
                                                                                            <label htmlFor={`permissionSets.${index}.permissions.insert`} className="checkbox-label">
                                                                                                Insert
                                                                                            </label>
                                                                                            <Field
                                                                                                type="checkbox"
                                                                                                id={`permissionSets.${index}.permissions.insert`}
                                                                                                name={`permissionSets.${index}.permissions.insert`}
                                                                                            />
                                                                                        </Grid>
                                                                                        <Grid item xs={3} md={3}>
                                                                                            <label htmlFor={`permissionSets.${index}.permissions.read`} className="checkbox-label">
                                                                                                Read
                                                                                            </label>
                                                                                            <Field
                                                                                                type="checkbox"
                                                                                                id={`permissionSets.${index}.permissions.read`}
                                                                                                name={`permissionSets.${index}.permissions.read`}
                                                                                            />
                                                                                        </Grid>
                                                                                        <Grid item xs={3} md={3}>
                                                                                            <label htmlFor={`permissionSets.${index}.permissions.edit`} className="checkbox-label">
                                                                                                Edit
                                                                                            </label>
                                                                                            <Field
                                                                                                type="checkbox"
                                                                                                id={`permissionSets.${index}.permissions.edit`}
                                                                                                name={`permissionSets.${index}.permissions.edit`}
                                                                                                onChange={(e)=>{
                                                                                                    // setFieldValue(`permissionSets.${index}.permissions.insert`,e.target.checked);
                                                                                                    setFieldValue(`permissionSets.${index}.permissions.read`,e.target.checked);
                                                                                                    setFieldValue(`permissionSets.${index}.permissions.edit`,e.target.checked);     
                                                                                                }}
                                                                                            />
                                                                                        </Grid>
                                                                                        <Grid item xs={3} md={3}>
                                                                                            <label htmlFor={`permissionSets.${index}.permissions.delete`} className="checkbox-label">
                                                                                                Delete
                                                                                            </label>
                                                                                            <Field
                                                                                                type="checkbox"
                                                                                                id={`permissionSets.${index}.permissions.delete`}
                                                                                                name={`permissionSets.${index}.permissions.delete`}
                                                                                                onChange={(e)=>{
                                                                                                    setFieldValue(`permissionSets.${index}.permissions.insert`,e.target.checked);
                                                                                                    setFieldValue(`permissionSets.${index}.permissions.read`,e.target.checked);
                                                                                                    setFieldValue(`permissionSets.${index}.permissions.edit`,e.target.checked);
                                                                                                    setFieldValue(`permissionSets.${index}.permissions.delete`,e.target.checked);
                                                                                                    
                                                                                                }}
                                                                                            />
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </div>
                                                                    ))}
                                                            </>
                                                        )}
                                                    </FieldArray>

                                                </AccordionDetails>
                                            </Accordion>
                                        </Grid>
                                        {!showNew && (
                                            <>
                                                <Grid item xs={6} md={6}>
                                                    <label htmlFor="createdDate" >Created Date</label>
                                                    <Field name='createdDate' type="text" class="form-input" disabled />
                                                </Grid>

                                                <Grid item xs={6} md={6}>
                                                    <label htmlFor="modifiedDate" >Modified Date</label>
                                                    <Field name='modifiedDate' type="text" class="form-input" disabled />
                                                </Grid>
                                            </>
                                        )}
                                    </Grid>
                                    <div className='action-buttons'>
                                        <DialogActions sx={{ justifyContent: "space-between" }}>
                                            {
                                                showNew ?
                                                    <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Save</Button>
                                                    :
                                                    <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Update</Button>
                                            }
                                            <Button type="reset" variant="contained" onClick={handleFormClose}   >Cancel</Button>
                                        </DialogActions>
                                    </div>

                                </Form>
                            </>
                        )
                    }}
                </Formik>
            </div>
        </Grid>
    )
}
export default PermissiionSetForm;



{/* <FieldArray name="permissionSets">
                                                {({ remove, push }) => (
                                                    <>
                                                        {values.permissionSets.length > 0 &&
                                                            values.permissionSets.map((obj, index) => (
                                                                <div key={index} style={{margin:'5px'}}>
                                                                    <Grid container spacing={2} alignItems="center">
                                                                        <Grid item xs={4} md={4}>
                                                                            <h3>{obj.object}</h3>
                                                                        </Grid>
                                                                        <Grid item xs={8} md={8}>
                                                                            <Grid container spacing={2} alignItems="center">
                                                                                
                                                                                <Grid item xs={3} md={3}>
                                                                                    <label htmlFor={`permissionSets.${index}.permissions.read`} className="checkbox-label">
                                                                                        Read
                                                                                    </label>
                                                                                    <Field
                                                                                        type="checkbox"
                                                                                        id={`permissionSets.${index}.permissions.read`}
                                                                                        name={`permissionSets.${index}.permissions.read`}
                                                                                    />
                                                                                </Grid>
                                                                                <Grid item xs={3} md={3}>
                                                                                    <label htmlFor={`permissionSets.${index}.permissions.insert`} className="checkbox-label">
                                                                                        Insert
                                                                                    </label>
                                                                                    <Field
                                                                                        type="checkbox"
                                                                                        id={`permissionSets.${index}.permissions.insert`}
                                                                                        name={`permissionSets.${index}.permissions.insert`}
                                                                                    />
                                                                                </Grid>
                                                                                <Grid item xs={3} md={3}>
                                                                                    <label htmlFor={`permissionSets.${index}.permissions.edit`} className="checkbox-label">
                                                                                        Edit
                                                                                    </label>
                                                                                    <Field
                                                                                        type="checkbox"
                                                                                        id={`permissionSets.${index}.permissions.edit`}
                                                                                        name={`permissionSets.${index}.permissions.edit`}
                                                                                    />
                                                                                </Grid>
                                                                                <Grid item xs={3} md={3}>
                                                                                    <label htmlFor={`permissionSets.${index}.permissions.delete`} className="checkbox-label">
                                                                                        Delete
                                                                                    </label>
                                                                                    <Field
                                                                                        type="checkbox"
                                                                                        id={`permissionSets.${index}.permissions.delete`}
                                                                                        name={`permissionSets.${index}.permissions.delete`}
                                                                                    />
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Grid>
                                                                </div>
                                                            ))}
                                                    </>
                                                )}
                                            </FieldArray> */}
{/* <FieldArray name="permissionSets">
                                            {({ remove, push }) => (
                                                <>
                                                    {values.permissionSets.length > 0 &&
                                                        values.permissionSets.map((obj, index) => (
                                                            <div key={index}>

                                                                <h3>{obj.name}</h3>

                                                                <Grid item xs={6} md={6}>
                                                                    <label htmlFor={`permissionSets.${index}.permissions.insert`}>
                                                                        Insert                                                                </label>
                                                                    <Field
                                                                        type="checkbox"
                                                                        id={`permissionSets.${index}.permissions.insert`}
                                                                        name={`permissionSets.${index}.permissions.insert`}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={6} md={6}>
                                                                    <label htmlFor={`permissionSets.${index}.permissions.read`}>
                                                                        Read
                                                                    </label>
                                                                    <Field
                                                                        type="checkbox"
                                                                        id={`permissionSets.${index}.permissions.read`}
                                                                        name={`permissionSets.${index}.permissions.read`}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={6} md={6}>


                                                                    <label htmlFor={`permissionSets.${index}.permissions.edit`}>
                                                                        Edit
                                                                    </label>
                                                                    <Field
                                                                        type="checkbox"
                                                                        id={`permissionSets.${index}.permissions.edit`}
                                                                        name={`permissionSets.${index}.permissions.edit`}
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={6} md={6}>
                                                                    <label htmlFor={`permissionSets.${index}.permissions.delete`}>
                                                                        Delete
                                                                    </label>
                                                                    <Field
                                                                        type="checkbox"
                                                                        id={`permissionSets.${index}.permissions.delete`}
                                                                        name={`permissionSets.${index}.permissions.delete`}
                                                                    />
                                                                </Grid>
                                                                 <button type="button" onClick={() => remove(index)}>
                                                                    Remove
                                                                </button> 
                                                            </div>
                                                        ))}
                                                    <button type="button" onClick={() => push({ name: "", permissions: {} })}>
                                                        Add Object
                                                    </button> 
                                                </>
                                            )}
                                        </FieldArray> */}

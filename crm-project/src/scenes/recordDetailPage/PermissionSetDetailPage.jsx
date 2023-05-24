import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import {
    Grid, Button, DialogActions,
    Autocomplete, Accordion, AccordionSummary, AccordionDetails
    , Typography, MenuItem, TextField
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useParams, useNavigate } from "react-router-dom"
import ToastNotification from '../toast/ToastNotification';
import CustomizedSelectForFormik from '../formik/CustomizedSelectForFormik';
import './Form.css'
import { PermissionSetInitialValues, PermissionSetSavedValues } from '../formik/IntialValues/formValues';
import { RolesDepartment } from '../../data/pickLists';
import { RequestServer } from '../api/HttpReq';
import queryString from 'query-string';
import { apiMethods } from '../api/methods';
import { apiCheckObjectPermission } from "../Auth/apiCheckObjectPermission";
import { getLoginUserRoleDept } from "../Auth/userRoleDept";
import { OBJECT_API_PERMISSIONS, POST_PERMISSIONS 
    ,GET_ROLE,GET_ALL_TABLE_NAME,
} from '../api/endUrls';


const PermissionSetDetailPage = ({ item }) => {

    const OBJECT_API = OBJECT_API_PERMISSIONS
    const URL_postRecords = POST_PERMISSIONS
    const URL_getRolesRecord=GET_ROLE
    const URL_getAllTableNames=GET_ALL_TABLE_NAME


    const [singlePermission, setsinglePermission] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const [showNew, setshowNew] = useState()
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

    const [roleRecordsByDept, setRoleRecordsByDept] = useState([])
    const [objTableName, setObjTableName] = useState([])


    const [permissionValues, setPermissionValues] = useState({})
    const userRoleDpt = getLoginUserRoleDept(OBJECT_API)
    console.log(userRoleDpt, "userRoleDpt")

    useEffect(() => {
        console.log('passed record PermissionSetDetailPage', location.state.record.item);

        setsinglePermission(location.state?.record?.item ?? {});
        setshowNew(!location.state.record.item)
        fetchTableNames()
        fetchObjectPermissions()
    }, [])


    const fetchObjectPermissions = () => {
        if (userRoleDpt) {
            apiCheckObjectPermission(userRoleDpt)
                .then(res => {
                    console.log(res[0].permissions, "apiCheckObjectPermission promise res")
                    setPermissionValues(res[0].permissions)
                })
                .catch(err => {
                    console.log(err, "res apiCheckObjectPermission error")
                    setPermissionValues({})
                })
        }
    }

    const fetchTableNames = () => {
        RequestServer(apiMethods.get, URL_getAllTableNames)
            .then(res => {
                if (res.success) {
                    console.log(res.data, "URL_getAllTableNames then res")
                    // const objNameChangeArr = res.data.map(item => {
                    //     if (item === "Inventory Management") {
                    //       return "Inventory";
                    //     } else {
                    //       return item;
                    //     }
                    //   });

                    const tableName = res.data.map(i => {
                        return i
                    })
                    console.log(tableName, "tableName")
                    setObjTableName(tableName)
                } else {
                    console.log(res.error, "URL_getAllTableNames then error")
                }
            })
            .catch(error => {
                console.log(error, "URL_getAllTableNames catch")
            })
    }


    const initialValues = PermissionSetInitialValues
    initialValues.permissionSets = objTableName.map(i => {
        return {
            object: i, permissions: {
                read: false,
                create: false,
                edit: false,
                delete: false,
            }, permissionLevel: 0,
        }
    })

    const savedValues = PermissionSetSavedValues(singlePermission)

    console.log(initialValues, "initialValues")
    console.log(savedValues, "savedValues")

    const validationSchema = Yup.object({
        permissionName: Yup
            .string()
            .required('Required'),
    })

    const formSubmission = (values) => {

        console.log('form submission value', values);
        // console.log(values.permissionSets, "values.permissionSets")

        const convertValue = [...values.permissionSets]
        convertValue.forEach(obj => {
            let permissionLevel =
                (obj.permissions.read ? 1 : 0) +
                (obj.permissions.create ? 2 : 0) +
                (obj.permissions.edit ? 3 : 0) +
                (obj.permissions.delete ? 4 : 0);

            obj.permissionLevel = permissionLevel;

        })

        values.permissionSets = convertValue;

        console.log(values.permissionSets, "values.permissionSets")

        let dateSeconds = new Date().getTime();
        let createDateSec = new Date(values.createdDate).getTime()
        values.permissionSets = JSON.stringify(values.permissionSets)
        if (showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = dateSeconds;
            values.createdBy = JSON.parse(sessionStorage.getItem('loggedInUser'))
            values.modifiedBy = JSON.parse(sessionStorage.getItem('loggedInUser'))
        }
        else if (!showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = createDateSec;
            values.createdBy = singlePermission.createdBy;
            values.modifiedBy = JSON.parse(sessionStorage.getItem('loggedInUser'))
        }
        console.log('after change form submission value', values);


        RequestServer(apiMethods.post, URL_postRecords, values)
            .then((res) => {
                console.log(res, "res")
                if (res.success) {
                    setNotify({
                        isOpen: true,
                        message: res.data,
                        type: 'success'
                    })
                    setTimeout(() => {
                        navigate(-1);
                    }, 2000)
                } else {
                    setNotify({
                        isOpen: true,
                        message: res.error.message,
                        type: 'error'
                    })
                    setTimeout(() => {
                        navigate(-1);
                    }, 2000)
                }
            })
            .catch((err) => {
                console.log(err, "err")
                setNotify({
                    isOpen: true,
                    message: err.message,
                    type: 'error'
                })
                setTimeout(() => {
                    navigate(-1);
                }, 2000)
            })
    }



    const handleFormClose = () => {
        navigate(-1)
    }

    const FetchRolesbyName = (dpt, inputValue) => {
        console.log(dpt, "dpt")
        console.log(inputValue, 'inputValue')
        let payloadObj = {
            departmentName: dpt,
            role: inputValue
        }

        let url = URL_getRolesRecord + '?' + queryString.stringify(payloadObj);

        RequestServer(apiMethods.get, url)
            .then((res) => {
                console.log(res, " FetchRolesbyName url_getRolesRecord res")
                if (res.success) {
                    // const obj={id:res.data._id,roleName:res.data.roleName}
                    if (typeof (res.data) === 'object') {
                        setRoleRecordsByDept(res.data)
                    } else {
                        setRoleRecordsByDept([])
                    }
                } else {
                    console.log("url_getRolesRecord status error", res.error.message)
                    setRoleRecordsByDept([])
                }
            })
            .catch((error) => {
                console.log("error url_getRolesRecord", error)
                setRoleRecordsByDept([])
            })

        // let payloadObj ={department:dpt,value:inputValue}
        // RequestServer("post",urlgetRolesByDept,null,payloadObj)
        // .then(res=>{
        //     if(res.success){
        //         console.log(res.success,"success")
        //     }else{
        //         console.log(res.error.message,"error")
        //     }
        // })
        // .catch((error)=>{
        //     console.log(error.message,"error")
        // })

    }

    return (
        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                {
                    showNew ? <h3>New Permission Set</h3> : <h3>Permission Set Detail Page </h3>
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
                        const { values, dirty, isSubmitting, handleChange, handleSubmit, handleReset, setFieldValue, errors, touched, } = props;

                        return (
                            <>
                                <ToastNotification notify={notify} setNotify={setNotify} />
                                <Form className='my-form'>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="permissionName">Permission Set Name <span className="text-danger">*</span></label>
                                            <Field type="text" id="permissionName" name="permissionName" class="form-input"
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}

                                            />
                                            <div style={{ color: "red" }}>
                                                <ErrorMessage name="permissionName" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="department">Department</label>
                                            <Field name="department"
                                                component={CustomizedSelectForFormik}
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                className="form-customSelect"
                                                onChange={(e) => {
                                                    console.log(e.target.value, "event")
                                                    let dpt = e.target.value
                                                    if (dpt.length > 0) {
                                                        FetchRolesbyName(dpt, null)
                                                    } else {
                                                        setRoleRecordsByDept([])
                                                    }
                                                }}
                                            >
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {
                                                    RolesDepartment.map((i) => {
                                                        return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="RoleId">Role Name</label>

                                            <Autocomplete
                                                name="RoleId"
                                                options={roleRecordsByDept}
                                                value={values.roleDetails}
                                                getOptionLabel={option => option.roleName || ""}
                                                onChange={(e, value) => {
                                                    if (!value) {
                                                        console.log("!value", value)
                                                        setFieldValue("RoleId", "")
                                                        setFieldValue("roleDetails", "")
                                                    } else {
                                                        console.log("value", value)
                                                        const obj = { id: value._id, roleName: value.roleName }
                                                        setFieldValue("roleDetails", obj)
                                                        setFieldValue("RoleId", value._id)
                                                    }
                                                }}
                                                onInputChange={(e, newInputValue) => {
                                                    if (values.department) {
                                                        console.log(values.department, "if")
                                                        FetchRolesbyName(values.department, newInputValue)
                                                    }
                                                    else {
                                                        console.log(values.department, "else ")
                                                    }
                                                }}
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                renderInput={params => (
                                                    // console.log(params,"params")
                                                    <Field component={TextField} {...params} name="roleDetails" />
                                                )}
                                            />
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
                                                                {
                                                                    Array.isArray(values.permissionSets) && values.permissionSets.length > 0 &&

                                                                    values.permissionSets.map((obj, index) => (
                                                                        <div key={index} style={{ margin: '5px' }}>
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
                                                                                                onChange={(e) => {
                                                                                                    if (e.target.checked) {
                                                                                                        console.log(e.target.checked, "read checked ")
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.read`, e.target.checked)
                                                                                                    } else {
                                                                                                        console.log(e.target.checked, "read unchecked")
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.read`, e.target.checked)
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.create`, e.target.checked)
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.edit`, e.target.checked)
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.delete`, e.target.checked)
                                                                                                    }
                                                                                                }}
                                                                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                                                            />
                                                                                        </Grid>
                                                                                        <Grid item xs={3} md={3}>
                                                                                            <label htmlFor={`permissionSets.${index}.permissions.create`} className="checkbox-label">
                                                                                                Create
                                                                                            </label>
                                                                                            <Field
                                                                                                type="checkbox"
                                                                                                id={`permissionSets.${index}.permissions.create`}
                                                                                                name={`permissionSets.${index}.permissions.create`}
                                                                                                onChange={(e) => {
                                                                                                    if (e.target.checked) {
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.create`, e.target.checked);
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.read`, e.target.checked);
                                                                                                    } else {
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.create`, e.target.checked);
                                                                                                    }
                                                                                                }}
                                                                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
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
                                                                                                onChange={(e) => {
                                                                                                    if (e.target.checked) {
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.read`, e.target.checked);
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.edit`, e.target.checked);
                                                                                                    } else {
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.edit`, e.target.checked);
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.delete`, e.target.checked)
                                                                                                    }
                                                                                                }}
                                                                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
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
                                                                                                onChange={(e) => {
                                                                                                    console.log(e.target.checked, "checkbox")
                                                                                                    if (e.target.checked) {
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.read`, e.target.checked);
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.edit`, e.target.checked);
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.delete`, e.target.checked);
                                                                                                    }
                                                                                                    else {
                                                                                                        setFieldValue(`permissionSets.${index}.permissions.delete`, e.target.checked);
                                                                                                    }
                                                                                                }}
                                                                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
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
                                                    <Button type='success' variant="contained" color="secondary" disabled={isSubmitting || !dirty}>Save</Button>
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
export default PermissionSetDetailPage;


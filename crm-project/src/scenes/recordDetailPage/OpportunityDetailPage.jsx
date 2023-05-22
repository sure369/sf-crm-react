import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid, Button, Forminput, DialogActions, TextField, Autocomplete, MenuItem, Chip } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"
import ToastNotification from '../toast/ToastNotification';
import { LeadSourcePickList, OppStagePicklist, OppTypePicklist } from '../../data/pickLists';
import CustomizedSelectForFormik from '../formik/CustomizedSelectForFormik';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import './Form.css'
import { RequestServer } from '../api/HttpReq';
import { OpportunityInitialValues, OpportunitySavedValues } from '../formik/IntialValues/formValues';
import { apiMethods } from '../api/methods';
import { apiCheckObjectPermission } from "../Auth/apiCheckObjectPermission";
import { getLoginUserRoleDept } from "../Auth/userRoleDept";
import { OBJECT_API_DEAL,POST_DEAL } from '../api/endUrls';


const OpportunityDetailPage = ({ item }) => {

    const OBJECT_API = OBJECT_API_DEAL
    const URL_postRecords = POST_DEAL
    const fetchLeadsbyName = `/LeadsbyName?searchKey=`;
    const fetchInventoriesbyName = `/InventoryName?searchKey=`;


    const [singleOpportunity, setSinglOpportunity] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const [showNew, setshowNew] = useState()
    const [leadsRecords, setLeadsRecords] = useState([]);
    const [inventoriesRecord, setInventoriesRecord] = useState([]);
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

    const [permissionValues, setPermissionValues] = useState({})
    const userRoleDpt = getLoginUserRoleDept(OBJECT_API)
    console.log(userRoleDpt, "userRoleDpt")

    useEffect(() => {
        console.log('passed record', location.state.record.item);
        console.log('inside opportunity');
        setSinglOpportunity(location.state.record.item);
        setshowNew(!location.state.record.item)
        FetchInventoriesbyName('');
        FetchLeadsbyName('');
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

    const initialValues = OpportunityInitialValues;
    const savedValues = OpportunitySavedValues(singleOpportunity)


    const validationSchema = Yup.object({
        opportunityName: Yup
            .string()
            .required('Required'),
        amount: Yup
            .string()
            .required('Required')
            .matches(/^[0-9]+$/, "Must be only digits"),
        // amount: Yup.number().required('Amount is required').positive('Amount must be positive').integer('Amount must be an integer'),
    })

    const formSubmission = (values) => {
        console.log('form submission value', values);

        let dateSeconds = new Date().getTime();
        let createDateSec = new Date(values.createdDate).getTime()
        let closeDateSec = new Date(values.closeDate).getTime()

        if (showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = dateSeconds;
            values.createdBy = JSON.parse(sessionStorage.getItem('loggedInUser'))
            values.modifiedBy = JSON.parse(sessionStorage.getItem('loggedInUser'))
            if (values.closeDate) {
                values.closeDate = closeDateSec;
            }
            if (values.LeadId === '' && values.InventoryId === '') {
                console.log('both empty')
                delete values.LeadId;
                delete values.InventoryId;
            }
            else if (values.LeadId === '') {
                console.log('LeadId empty')
                delete values.LeadId;
            }
            else if (values.InventoryId === '') {
                console.log('InventoryId empty')
                delete values.InventoryId;
            }
        }
        else if (!showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = createDateSec;
            values.createdBy = singleOpportunity.createdBy;
            values.modifiedBy = JSON.parse(sessionStorage.getItem('loggedInUser'))

            if (values.closeDate) {
                values.closeDate = closeDateSec;
            }
            if (values.LeadId === '' && values.InventoryId === '') {
                console.log('both empty !showNew')
                delete values.LeadId;
                delete values.InventoryId;
            }
            else if (values.LeadId === '') {
                console.log('LeadId empty !showNew')
                delete values.LeadId;
            }
            else if (values.InventoryId === '') {
                console.log('InventoryId empty !showNew')
                delete values.InventoryId;
            }

        }
        console.log('after change form submission value', values);

        RequestServer(apiMethods.post, URL_postRecords, values)
            .then((res) => {
                console.log(res, "res from RequestServer")
                if (res.success) {
                    setNotify({
                        isOpen: true,
                        message: res.data,
                        type: "success",
                    });
                } else {
                    console.log(res, "error in then");
                    setNotify({
                        isOpen: true,
                        message: res.error.message,
                        type: "error",
                    });
                }
            })
            .catch((error) => {
                setNotify({
                    isOpen: true,
                    message: error.message,
                    type: 'error'
                })
            })
            .finally(() => {
                setTimeout(() => {
                    navigate(-1);
                }, 2000);
            })
    }

    const FetchLeadsbyName = (newInputValue) => {

        console.log('newInputValue', newInputValue)
        RequestServer(apiMethods.post, fetchLeadsbyName + newInputValue)
            .then((res) => {
                console.log('res fetchLeadsbyName', res.data)
                if (res.success) {
                    if (typeof (res.data) === "object") {
                        setLeadsRecords(res.data)
                    }
                } else {
                    setLeadsRecords([])
                }
            })
            .catch((error) => {
                console.log('error fetchLeadsbyName', error);
            })
    }

    const FetchInventoriesbyName = (newInputValue) => {
        RequestServer(apiMethods.post, fetchInventoriesbyName + newInputValue)
            .then((res) => {
                console.log('res fetch Inventoriesby Name', res.data)
                if (res.success) {
                    if (typeof (res.data) === "object") {
                        setInventoriesRecord(res.data)
                    }
                } else {
                    setInventoriesRecord([])
                }
            })
            .catch((error) => {
                console.log('error fetchInventoriesbyName', error);
            })
    }

    const handleFormClose = () => {
        navigate(-1)
    }

    return (

        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                {
                    showNew ? <h2>New Opportunity</h2> : <h2>Opportunity Detail Page </h2>
                }
            </div>
            <div>
                <Formik
                    enableReinitialize={true}
                    initialValues={showNew ? initialValues : savedValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => { formSubmission(values) }}
                >
                    {(props) => {
                        const { values, dirty, isSubmitting, handleChange, handleSubmit, handleReset, setFieldValue, errors, touched, } = props;

                        return (
                            <>
                                <ToastNotification notify={notify} setNotify={setNotify} />
                                <Form className="my-form">
                                    <Grid container spacing={2}>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="opportunityName" >Opportunity Name<span className="text-danger">*</span> </label>
                                            <Field name='opportunityName' type="text" class="form-input"
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                            />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="opportunityName" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="InventoryId">Inventory Name </label>
                                            <Autocomplete

                                                name="InventoryId"
                                                options={inventoriesRecord}
                                                value={values.inventoryDetails}
                                                getOptionLabel={option => option.propertyName || ''}

                                                onChange={(e, value) => {
                                                    if (!value) {
                                                        console.log('!value', value);
                                                        setFieldValue("InventoryId", '')
                                                        setFieldValue("inventoryDetails", '')
                                                        setFieldValue("InventoryName", '')
                                                    } else {
                                                        console.log('value', value);
                                                        setFieldValue("InventoryId", value.id)
                                                        setFieldValue("inventoryDetails", value)
                                                        setFieldValue("InventoryName", value.propertyName)
                                                    }
                                                }}
                                                onInputChange={(event, newInputValue) => {
                                                    console.log('newInputValue', newInputValue);
                                                    if (newInputValue.length >= 3) {
                                                        FetchInventoriesbyName(newInputValue);
                                                    }
                                                    else if (newInputValue.length == 0) {
                                                        FetchInventoriesbyName(newInputValue);
                                                    }
                                                }}
                                                renderTags={(value, getTagProps) =>
                                                    value.map((option, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={option.propertyName}
                                                            {...getTagProps({ index })}
                                                            sx={{ my: 0.5 }}
                                                        />
                                                    ))
                                                }
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                renderInput={params => (
                                                    <Field component={TextField} {...params} name="InventoryId" />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="LeadId">Lead Name </label>
                                            <Autocomplete
                                                name="LeadId"
                                                options={leadsRecords}
                                                value={values.leadDetails}
                                                getOptionLabel={option => option.leadName || ''}
                                                onChange={(e, value) => {
                                                    console.log('lead onchange', value);
                                                    if (!value) {
                                                        console.log('!value', value);
                                                        setFieldValue("LeadId", '')
                                                        setFieldValue("LeadName", '')
                                                        setFieldValue("leadDetails", '')
                                                    } else {
                                                        console.log('value', value);
                                                        setFieldValue("LeadId", value.id)
                                                        setFieldValue("LeadName", value.leadName)
                                                        setFieldValue("leadDetails", value)
                                                    }
                                                }}
                                                onInputChange={(event, newInputValue) => {
                                                    console.log('newInputValue', newInputValue);
                                                    if (newInputValue.length >= 3) {
                                                        FetchLeadsbyName(newInputValue);
                                                    }
                                                    else if (newInputValue.length == 0) {
                                                        FetchLeadsbyName(newInputValue);
                                                    }
                                                }}
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                renderInput={params => (
                                                    <Field component={TextField} {...params} name="LeadId" />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="stage">Opportunity Stage</label>
                                            <Field name="stage" component={CustomizedSelectForFormik}
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                            >
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {
                                                    OppStagePicklist.map((i) => {
                                                        return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="type">Type</label>
                                            <Field name="type" component={CustomizedSelectForFormik}
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                            >
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {
                                                    OppTypePicklist.map((i) => {
                                                        return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="leadSource"> Lead Source</label>
                                            <Field name="leadSource" component={CustomizedSelectForFormik}
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                            >
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {
                                                    LeadSourcePickList.map((i) => {
                                                        return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="closeDate">Close Date</label> <br />
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    name="closeDate"
                                                    value={values.closeDate}
                                                    onChange={(e) => {
                                                        setFieldValue('closeDate', e)
                                                    }}
                                                    renderInput={(params) => <TextField  {...params} style={{ width: '100%' }} error={false} />}
                                                    disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                />
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="amount">Amount<span className="text-danger">*</span> </label>
                                            <Field class="form-input" type='text' name="amount"
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                            />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="amount" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <label htmlFor="description">Description</label>
                                            <Field as="textarea" name="description" class="form-input-textarea" style={{ width: '100%' }}
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                            />
                                        </Grid>
                                        {!showNew && (
                                            <>
                                                <Grid container spacing={2} item xs={12} md={12} direction="row">
                                                    {/* <Grid item xs={6} md={6}>
                                                    <label htmlFor="createdBy" >Created By</label>
                                                    <Field name='createdBy' type="text" class="form-input" disabled />
                                                </Grid>
                                                <Grid item xs={6} md={6}>
                                                    <label htmlFor="modifiedBy" >Modified By</label>
                                                    <Field name='modifiedBy' type="text" class="form-input" disabled />
                                                </Grid> */}
                                                    <Grid item xs={6} md={6}>
                                                        {/* value is aagined to  the fields */}
                                                        <label htmlFor="createdDate" >Created By</label>
                                                        <Field name='createdDate' type="text" class="form-input"
                                                            value={values.createdBy + ',  ' + values.createdDate} disabled />
                                                    </Grid>
                                                    <Grid item xs={6} md={6}>
                                                        {/* value is aagined to  the fields */}
                                                        <label htmlFor="modifiedDate" >Modified By</label>
                                                        <Field name='modifiedDate' type="text" class="form-input"
                                                            value={values.modifiedBy + ',  ' + values.modifiedDate} disabled />
                                                    </Grid>
                                                </Grid>
                                            </>
                                        )}
                                    </Grid>
                                    <div className='action-buttons'>
                                        <DialogActions sx={{ justifyContent: "space-between" }}>

                                            {showNew ?
                                                <Button type='success' variant="contained" color="secondary" disabled={isSubmitting || !dirty}>Save</Button>
                                                :
                                                <Button type='success' variant="contained" color="secondary" disabled={isSubmitting || !dirty}>Update</Button>
                                            }
                                            <Button type="reset" variant="contained" onClick={handleFormClose}  >Cancel</Button>
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
export default OpportunityDetailPage;






















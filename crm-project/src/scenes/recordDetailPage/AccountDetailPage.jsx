import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {Grid,Button,DialogActions,TextField,
    Autocomplete, MenuItem,Select,} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import {IndustryPickList,AccRatingPickList,AccTypePickList,
    AccCitiesPickList,AccCountryPickList } from "../../data/pickLists";
import CustomizedSelectForFormik from "../formik/CustomizedSelectForFormik";
import ToastNotification from "../toast/ToastNotification";
import "./Form.css";
import { RequestServer } from "../api/HttpReq";
import { AccountInitialValues,AccountSavedValues } from "../formik/IntialValues/formValues";
import { apiMethods } from "../api/methods";
import { apiCheckObjectPermission } from "../Auth/apiCheckObjectPermission";
import { getLoginUserRoleDept } from "../Auth/userRoleDept";


const AccountDetailPage = ({ item }) => {
    
const OBJECT_API = "Account"
const urlUpsert = `/UpsertAccount`;
const fetchInventoriesbyName = `/InventoryName?searchKey=`;


    const [singleAccount, setsingleAccount] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const [showNew, setshowNew] = useState();
    const [inventoriesRecord, setInventoriesRecord] = useState([]);
    const [notify, setNotify] = useState({isOpen: false,message: "",type: "",});
    
    const [permissionValues, setPermissionValues] = useState({})
    const userRoleDpt= getLoginUserRoleDept(OBJECT_API)
    console.log(userRoleDpt,"userRoleDpt")

    useEffect(() => {
        console.log("passed record", location.state.record.item);
        setsingleAccount(location.state.record.item);
        console.log("true", !location.state.record.item);
        setshowNew(!location.state.record.item);
        FetchInventoriesbyName("");
        fetchObjectPermissions();   
    }, []);

    const fetchObjectPermissions=()=>{
        if(userRoleDpt){
            apiCheckObjectPermission(userRoleDpt)
            .then(res=>{
                console.log(res[0].permissions,"apiCheckObjectPermission promise res")
                setPermissionValues(res[0].permissions)
            })
            .catch(err=>{
                console.log(err,"res apiCheckObjectPermission error")
                setPermissionValues({})
            })
        }
    }
    
    const initialValues=AccountInitialValues;
    const savedValues=AccountSavedValues(singleAccount)


    const getCities = (billingCountry) => {
        return new Promise((resolve, reject) => {
            console.log("billingCountry", billingCountry);
            resolve(AccCitiesPickList[billingCountry] || []);
        });
    };

    console.log("getCities", getCities("India"));
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

    const validationSchema = Yup.object({
            accountName: Yup.string()
            .required("Required")
            // .matches(/^[A-Za-z ]*$/, "Numeric characters not accepted")
            .max(30, "lastName must be less than 30 characters"),
       
            rating: Yup.string().required("Required"),
       
            phone: Yup.string()
            .matches(phoneRegExp, "Phone number is not valid")
            .min(10, "Phone number must be 10 characters, its short")
            .max(10, "Phone number must be 10 characters,its long"),
        
            annualRevenue: Yup.string().matches(/^[0-9]+$/, "Must be only digits"),
    });

    const formSubmission = (values) => {
        console.log("form submission value", values);

        let dateSeconds = new Date().getTime();
        let createDateSec = new Date(values.createdDate).getTime();

        if (showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = dateSeconds;
            values.createdBy = JSON.parse(sessionStorage.getItem("loggedInUser"));
            values.modifiedBy = JSON.parse(sessionStorage.getItem("loggedInUser"));
            if (values.InventoryId === "") {
                delete values.InventoryId;
            }
        } else if (!showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = createDateSec;
            values.createdBy = singleAccount.createdBy;
            values.modifiedBy = JSON.parse(sessionStorage.getItem("loggedInUser"));

            if (values.InventoryId === "") {
                delete values.InventoryId;
            }
        }

        console.log("after change form submission value", values);
        
        RequestServer(apiMethods.post,urlUpsert,values)
        .then((res) => {
            console.log(res,"res from RequestServer")
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
        .catch((error)=>{
            setNotify({
                        isOpen:true,
                        message:error.message,
                        type:'error'
                      })
        })
        .finally(()=>{
            setTimeout(() => {
                navigate(-1);
            }, 2000);
        })       
    };

    const FetchInventoriesbyName = (newInputValue) => {
        
        RequestServer(apiMethods.post,fetchInventoriesbyName+newInputValue)
        .then((res)=>{
            if(res.success){
                if(typeof(res.data)!=='string'){
                    setInventoriesRecord(res.data)
                }else{
                    setInventoriesRecord([])
                }
                
            }else{
                console.log("status error",res.error.message)
            }
        })
        .catch((error)=>{
            console.log("error fetchInventoriesbyName",error)
        })
    };

    const handleFormClose = () => {
        navigate(-1);
    };
    const MenuItemhandleclick = (e) => {
        console.log(e);
    };
    return (            
          
        <Grid item xs={12} style={{ margin: "20px" }}>
           
            {/* {
                permissionValues.read ? <> */}
          
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                {showNew ? <h2>New Account</h2> : <h2>Account Detail Page </h2>}
            </div>
            <div>
                <Formik
                    enableReinitialize={true}
                    initialValues={showNew ? initialValues : savedValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {formSubmission(values)}}
                >
                     {(props) => {
                        const {values,dirty, isSubmitting, handleChange,handleSubmit,handleReset,setFieldValue,errors,touched,} = props;

                        return (
                            <>
                                <ToastNotification notify={notify} setNotify={setNotify} />

                                <Form className="my-form">
                                    <Grid container spacing={2}>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="accountName">
                                                Account Name <span className="text-danger">*</span>
                                            </label>
                                            <Field
                                                name="accountName" type="text" class="form-input"
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                            />
                                            <div style={{ color: "red" }}>
                                                <ErrorMessage name="accountName" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="accountNumber">Account Number </label>
                                            <Field
                                                name="accountNumber" type="number" class="form-input"
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="InventoryId">Inventory Name </label>
                                            <Autocomplete
                                                name="InventoryId"
                                                options={inventoriesRecord}
                                                value={values.inventoryDetails}
                                                getOptionLabel={(option) => option.propertyName || ""}
                                                onChange={(e, value) => {
                                                    if (!value) {
                                                        console.log("!value", value);
                                                        setFieldValue("InventoryId", "");
                                                        setFieldValue("inventoryDetails", "");
                                                        setFieldValue("InventoryId", "");
                                                        setFieldValue("InventoryName", "");

                                                    } else {
                                                        console.log("value", value);
                                                        setFieldValue("InventoryId", value.id);
                                                        setFieldValue("inventoryDetails", value);
                                                        setFieldValue("InventoryId", value.id);
                                                        setFieldValue("InventoryName", value.propertyName);
                                                    }
                                                }}
                                                onInputChange={(event, newInputValue) => {
                                                    console.log("newInputValue", newInputValue);
                                                    if (newInputValue.length >= 3) {
                                                        FetchInventoriesbyName(newInputValue);
                                                    } else if (newInputValue.length === 0) {
                                                        FetchInventoriesbyName(newInputValue);
                                                    }
                                                }}
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                renderInput={(params) => (
                                                    <Field
                                                        component={TextField}
                                                        {...params}
                                                        name="InventoryId"
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="annualRevenue">Annual Revenue</label>
                                            <Field
                                                class="form-input" type="text" name="annualRevenue"
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                            />
                                            <div style={{ color: "red" }}>
                                                <ErrorMessage name="annualRevenue" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="phone">Phone</label>
                                            <Field name="phone" type="phone" class="form-input"
                                            disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                             />
                                            <div style={{ color: "red" }}>
                                                <ErrorMessage name="phone" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="rating">Rating<span className="text-danger">*</span></label>
                                            <Field  name="rating" component={CustomizedSelectForFormik}
                                            disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {AccRatingPickList.map((i) => {
                                                    return <MenuItem value={i.value}>{i.text}</MenuItem>;
                                                })}
                                            </Field>
                                            <div style={{ color: "red" }}>
                                                <ErrorMessage name="rating" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="type">Type</label>
                                            <Field name="type" component={CustomizedSelectForFormik} 
                                            disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {AccTypePickList.map((i) => {
                                                    return <MenuItem value={i.value}>{i.text}</MenuItem>;
                                                })}
                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="industry">Industry</label>
                                            <Field name="industry"component={CustomizedSelectForFormik}
                                            disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {IndustryPickList.map((i) => {
                                                    return <MenuItem value={i.value}>{i.text}</MenuItem>;
                                                })}
                                            </Field>
                                        </Grid>

                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="billingCountry">Billing Country</label>
                                            <Field
                                                className="form-input"
                                                id="billingCountry"
                                                name="billingCountry"
                                                component={CustomizedSelectForFormik}
                                                value={values.billingCountry}
                                                onChange={async (event) => {
                                                    console.log("onchange", event.target.value);                                                   
                                                    const value = event.target.value;
                                                    const _billingCities = await getCities(value);
                                                    console.log("billingCities", _billingCities);
                                                    setFieldValue("billingCountry", value);
                                                    setFieldValue("billingCity", "");
                                                    setFieldValue("billingCities", _billingCities);
                                                }}
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {AccCountryPickList.map((i) => {
                                                    return <MenuItem value={i.value}>{i.text}</MenuItem>;
                                                })}
                                            </Field>
                                        </Grid>

                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="billingCity">Billing City</label>
                                            <Field
                                                className="form-input"
                                                value={values.billingCity}
                                                id="billingCity"
                                                name="billingCity"
                                                component={CustomizedSelectForFormik}
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                {values.billingCities &&
                                                    values.billingCities.map((r) => (
                                                        <MenuItem
                                                            key={r.value}
                                                            value={r.value}
                                                            onClick={(e) => MenuItemhandleclick(e)}
                                                        >
                                                            {r.text}
                                                        </MenuItem>
                                                    ))}
                                            </Field>
                                        </Grid>

                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="billingAddress">Billing Address </label>
                                            <Field  name="billingAddress" as="textarea"
                                                class="form-input-textarea" style={{ width: "100%" }}
                                                disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                            />
                                        </Grid>

                                        {!showNew && (
                                            <>
                                                <Grid container  spacing={2}
                                                    item  xs={12} md={12} direction="row"
                                                >
                                                    <Grid item xs={6} md={6}>
                                                        <label htmlFor="createdDate">Created By</label>
                                                        <div style={{ overflowX: "auto" }}>
                                                            <Field name="createdDate"
                                                                type="text" class="form-input"
                                                                value={
                                                                    values.createdBy + ",  " + values.createdDate
                                                                }
                                                                style={{ whiteSpace: "nowrap" }}
                                                                disabled
                                                            />
                                                        </div>
                                                    </Grid>

                                                    <Grid item xs={6} md={6}>
                                                        <label htmlFor="modifiedDate">Modified By</label>                                                     
                                                        <div style={{ overflowX: "auto" }}>
                                                            <Field name="modifiedDate"
                                                                type="text" class="form-input"
                                                                value={
                                                                    values.modifiedBy +
                                                                    ",  " +
                                                                    values.modifiedDate
                                                                }
                                                                style={{ whiteSpace: "nowrap" }}
                                                                disabled
                                                            />
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                            </>
                                        )}
                                    </Grid>

                                    <div className="action-buttons">
                                        <DialogActions sx={{ justifyContent: "space-between" }}>
                                            {showNew ? (
                                                <Button type="success"  variant="contained" color="secondary"
                                                    disabled={isSubmitting || !dirty}
                                                >
                                                    Save
                                                </Button>
                                            ) : (
                                                <Button type="success" variant="contained" color="secondary"
                                                    disabled={isSubmitting || !dirty}
                                                >
                                                    Update
                                                </Button>
                                            )}
                                            <Button type="reset"  variant="contained"onClick={handleFormClose}>
                                                Cancel
                                            </Button>
                                        </DialogActions>
                                    </div>
                                </Form>
                            </>
                        );
                    }}
                </Formik>
            </div>
            {/* </>
            : <NoAccessCard/>
            } */}
        </Grid>    
    );
};
export default AccountDetailPage;

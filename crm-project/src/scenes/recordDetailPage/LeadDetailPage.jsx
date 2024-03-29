import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Grid, Button, DialogActions, TextField,
  Autocomplete, MenuItem, Select, Typography, Modal
} from "@mui/material";
import { Timeline } from "@mui/lab";
import { useParams, useNavigate } from "react-router-dom";
import ToastNotification from "../toast/ToastNotification";
import { NameSalutionPickList, LeadSourcePickList, IndustryPickList, LeadStatusPicklist, LeadsDemoPicklist, LeadMonthPicklist, } from "../../data/pickLists";
import CustomizedSelectForFormik from "../formik/CustomizedSelectForFormik";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers";
import "./Form.css";
import { RequestServer } from "../api/HttpReq";
import { LeadInitialValues, LeadSavedValues } from "../formik/IntialValues/formValues";
import { apiMethods } from "../api/methods";
import TimelineTrack from "../timeline/LeadTimeline";
import ButtonGroup from "../timeline/ButtonGroup";
import ModalOppTask from "../tasks/ModalOppTask";
import ModalLeadConvertion from "../timeline/ModalLeadConvertion";
import { apiCheckObjectPermission } from "../Auth/apiCheckObjectPermission";
import { getLoginUserRoleDept } from "../Auth/userRoleDept";
import { OBJECT_API_ENQUIRY, POST_ENQUIRY } from "../api/endUrls";
import LeadStepper from "../timeline/LeadStepper";
import '../timeline/ModalLeadConvertion.css'

const LeadDetailPage = ({ item }) => {

  const OBJECT_API = OBJECT_API_ENQUIRY
  const URL_postRecords = POST_ENQUIRY

  const [singleLead, setsingleLead] = useState();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNew, setshowNew] = useState();

  const [usersRecord, setUsersRecord] = useState([]);
  const [notify, setNotify] = useState({ isOpen: false, message: "", type: "", });

  const [stageActive, setStageActive] = useState()
  const [modalLeadConvertionOpen, setModalLeadConvertionOpen] = useState(false)

  const [permissionValues, setPermissionValues] = useState({})
  const userRoleDpt = getLoginUserRoleDept(OBJECT_API)
  console.log(userRoleDpt, "userRoleDpt")

  useEffect(() => {
    console.log("passed record", location.state.record.item);
    setsingleLead(location.state.record.item);
    setshowNew(!location.state.record.item);
    if (location.state.record.item) {
      setStageActive(location.state.record.item.leadStatus)
    }
    // getTasks(location.state.record.item._id)
    fetchObjectPermissions();
  }, []);

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

  const initialValues = LeadInitialValues
  const savedValues = LeadSavedValues(singleLead)


  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const phoneRegex = /^\d{10}$/; // matches 10 digits
  const landlineRegex = /^\d{2,5}-\d{6,8}$/; // matches 2-5 digits, hyphen, 6-8 digits

  const validationSchema = Yup.object({
    fullName: Yup.string()
      .required("Required")
      // .matches(/^[A-Za-z ]*$/, 'Numeric characters not accepted')
      .max(30, "lastName must be less than 15 characters"),
    companyName: Yup.string()
      .required("Required")
      .max(25, "lastName must be less than 15 characters"),
    email: Yup.string().email("Invalid email address").required("Required"),

    // phone: Yup.string()
    //   .matches(phoneRegex, "Phone number is not valid")
    //   .min(10, "Phone number must be 10 characters, its short")
    //   .max(10, "Phone number must be 10 characters,its long"),

    // leadStatus: Yup.string().required("Required"),

    // primaryPhone: Yup.string().matches(phoneRegex, "Phone number is not valid"),
    // secondaryPhone: Yup.string().matches(landlineRegex,"Phone number is not valid" ),
  });

  const formSubmission = (values) => {
    console.log("form submission value", values);

    let dateSeconds = new Date().getTime();
    let createDateSec = new Date(values.createdDate).getTime();
    let appointmentDateSec = new Date(values.appointmentDate).getTime();
    if (showNew) {
      values.modifiedDate = dateSeconds;
      values.createdDate = dateSeconds;
      values.appointmentDate = appointmentDateSec;
      values.createdBy = JSON.parse(sessionStorage.getItem('loggedInUser'))
      values.modifiedBy = JSON.parse(sessionStorage.getItem('loggedInUser'))
    } else if (!showNew) {
      values.modifiedDate = dateSeconds;
      values.createdDate = createDateSec;
      values.appointmentDate = appointmentDateSec;
      values.createdBy = singleLead.createdBy;
      values.modifiedBy = JSON.parse(sessionStorage.getItem('loggedInUser'))
    }
    console.log("after change form submission value", values);

    RequestServer(apiMethods.post, URL_postRecords, values)
      .then((res) => {
        console.log("upsert record  response", res);
        if (res.success) {
          setNotify({
            isOpen: true,
            message: res.data,
            type: "success",
          })
        } else {
          console.log(res, "error in then");
          setNotify({
            isOpen: true,
            message: res.error.message,
            type: "error",
          })
        }
      })
      .catch((error) => {
        console.log("upsert record error", error);
        setNotify({
          isOpen: true,
          message: error.message,
          type: "error",
        })
      })

      .finally(() => {
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      })
  };
  const handleFormClose = () => {
    navigate(-1);
  };

  const openInNewTab = (url) => {
    window.open(url, "_blank");
  };

  const handleTimeLineClick = (item) => {
    console.log("handleTimeLineClick", item)
    setStageActive(item.value)
    if (item.hasOwnProperty('convert')) {
      console.log(item.convert, "inside convert stage")
      const updateSavedValue = {
        ...savedValues,
        leadStatus: item.value
      }
      if (item.value === 'Converted') {
        setModalLeadConvertionOpen(true)
        console.log('opens modal ', modalLeadConvertionOpen);
      } else {
        formSubmission(updateSavedValue)
      }
    }
  }

  const hanldeLeadConvert = () => {
    setModalLeadConvertionOpen(false)
    const updateSavedValue = {
      ...savedValues,
      leadStatus: 'Converted'
    };
    formSubmission(updateSavedValue);
  }
  const hanldeConvetionModelClose1 = () => {
    setModalLeadConvertionOpen(false)
  }

  return (

    <Grid item xs={12} style={{ margin: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        {showNew ? <h3>New Lead</h3> : <h3>Lead Detail Page </h3>}
      </div>
      {
        !showNew && singleLead &&
        <div className="timeline-track">
          {/* <TimelineTrack stages={LeadStatusPicklist} activeStage={stageActive} onItemClick={handleTimeLineClick}
            record={singleLead} /> */}
          <LeadStepper stages={LeadStatusPicklist} activeStage={stageActive} onItemClick={handleTimeLineClick}
            record={singleLead} />
        </div>

      }
      <div>
        <Formik
          enableReinitialize={true}
          initialValues={showNew ? initialValues : savedValues}
          validationSchema={validationSchema}
          onSubmit={(values) => { formSubmission(values); }}
        >
          {(props) => {
            const { values, dirty, isSubmitting, handleChange, handleSubmit, handleReset, setFieldValue, errors, touched, } = props;

            return (
              <>
                <ToastNotification notify={notify} setNotify={setNotify} />
                <Form className="my-form">
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={6}>
                      <label htmlFor="fullName">Full Name<span className="text-danger">*</span></label>
                      <Field name="fullName" type="text" class="form-input"
                        disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                      />
                      <div style={{ color: "red" }}>
                        <ErrorMessage name="fullName" />
                      </div>
                    </Grid>
                    <Grid item xs={6} md={6}>
                      <label htmlFor="companyName">Company Name <span className="text-danger">*</span></label>
                      <Field name="companyName" type="text" class="form-input"
                        disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                      />
                      <div style={{ color: "red" }}>
                        <ErrorMessage name="companyName" />
                      </div>
                    </Grid>

                    <Grid item xs={6} md={6}>
                      <label htmlFor="designation">Designation</label>
                      <Field name="designation" type="text" class="form-input"
                        disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                      />
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
                      <label htmlFor="email"> Email <span className="text-danger">*</span></label>
                      <Field name="email" type="text" class="form-input"
                        disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                      />
                      <div style={{ color: "red" }}>
                        <ErrorMessage name="email" />
                      </div>
                    </Grid>
                    <Grid item xs={6} md={6}>
                      <label htmlFor="leadSource"> Lead Source</label>
                      <Field name="leadSource" component={CustomizedSelectForFormik}
                        disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {LeadSourcePickList.map((i) => {
                          return <MenuItem value={i.value}>{i.text}</MenuItem>;
                        })}
                      </Field>
                    </Grid>
                    <Grid item xs={6} md={6}>
                      <label htmlFor="industry">Industry</label>
                      <Field name="industry" component={CustomizedSelectForFormik}
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
                      <label htmlFor="leadStatus"> Lead Status <span className="text-danger">*</span></label>
                      <Field name="leadStatus" component={CustomizedSelectForFormik}
                        disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {LeadStatusPicklist.map((i) => {
                          return <MenuItem value={i.value}>{i.text}</MenuItem>;
                        })}
                      </Field>
                      <div style={{ color: "red" }}>
                        <ErrorMessage name="leadStatus" />
                      </div>
                    </Grid>

                    <Grid item xs={6} md={6}>
                      <label htmlFor="linkedinProfile">Linkedin Profile</label>
                      <Field
                        name="linkedinProfile"
                        type="url"
                        class="form-input"
                        style={{ color: "blue", textDecoration: "underline" }}
                        onClick={() => {
                          const linkedinProfile = values.linkedinProfile;
                          if (linkedinProfile) {
                            //   window.location.href = linkedinProfile;
                            openInNewTab(linkedinProfile);
                          }
                        }}
                        disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                      />
                    </Grid>
                    <Grid item xs={6} md={6}>
                      <label htmlFor="location">Location</label>
                      <Field name="location" type="text" class="form-input"
                        disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                      />
                    </Grid>
                    <Grid item xs={6} md={6}>
                      <label htmlFor="appointmentDate">Appointment Date</label>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          name="appointmentDate"
                          value={values.appointmentDate}
                          onChange={(e) => {
                            setFieldValue("appointmentDate", e);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              style={{ width: "100%" }}
                              error={false}
                            />
                          )}
                          disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                        />
                      </LocalizationProvider>
                      {/* <Field name="appointmentDate" type="date" class="form-input" /> */}
                    </Grid>
                    <Grid item xs={6} md={6}>
                      <label htmlFor="demo">Demo</label>
                      <Field name="demo" component={CustomizedSelectForFormik}
                        disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {LeadsDemoPicklist.map((i) => {
                          return <MenuItem value={i.value}>{i.text}</MenuItem>;
                        })}
                      </Field>
                    </Grid>
                    <Grid item xs={6} md={6}>
                      <label htmlFor="month">PipeLine</label>
                      <Field name="month" component={CustomizedSelectForFormik}
                        disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {LeadMonthPicklist.map((i) => {
                          return <MenuItem value={i.value}>{i.text}</MenuItem>;
                        })}
                      </Field>
                    </Grid>
                    <Grid item xs={6} md={6}>
                      <label htmlFor="primaryPhone">Primary Phone</label>
                      <Field name="primaryPhone" type="text" class="form-input"
                        disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                      />
                      <div style={{ color: "red" }}>
                        <ErrorMessage name="primaryPhone" />
                      </div>
                    </Grid>
                    <Grid item xs={6} md={6}>
                      <label htmlFor="secondaryPhone">Secondary Phone</label>
                      <Field name="secondaryPhone" type="text" class="form-input"
                        disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                      />
                      <div style={{ color: "red" }}>
                        <ErrorMessage name="secondaryPhone" />
                      </div>
                    </Grid>
                    <Grid item xs={6} md={6}>
                      <label htmlFor="remarks">Remarks</label>
                      <Field name="remarks" as="textarea"
                        class="form-input-textarea"
                        style={{ width: "100%" }} rows="6"
                        disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                      />
                    </Grid>
                    {!showNew && (
                      <>
                        <Grid item xs={6} md={6}>
                          <label htmlFor="createdDate">Created By</label>
                          <Field name="createdDate" type="text"
                            class="form-input" disabled
                            value={values.createdBy + ',  ' + values.createdDate}
                          />
                        </Grid>
                        <Grid item xs={6} md={6}>
                          <label htmlFor="modifiedDate">Modified By</label>
                          <Field
                            name="modifiedDate" type="text"
                            class="form-input" 
                            value={values.modifiedBy + ',  ' + values.modifiedDate} 
                            disabled
                          />
                        </Grid>
                      </>
                    )}
                  </Grid>

                  <div className="action-buttons">
                    <DialogActions sx={{ justifyContent: "space-between" }}>
                      {showNew ? (
                        <Button
                          type="success" variant="contained" color="secondary"
                          disabled={isSubmitting || !dirty}
                        >
                          Save
                        </Button>
                      ) : (
                        <Button
                          type="success" variant="contained" color="secondary"
                          disabled={isSubmitting || !dirty}
                        >
                          Update
                        </Button>
                      )}
                      <Button
                        type="reset" variant="contained"
                        onClick={handleFormClose}
                      >
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

      <Modal
        open={modalLeadConvertionOpen}
        onClose={hanldeConvetionModelClose1}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ backdropFilter: "blur(1px)" }}
      >
        <div style={{ border: '2px solid' }} className="lead-convert-modal">
          <ModalLeadConvertion record={singleLead} handleModal={hanldeConvetionModelClose1} leadConvertion={hanldeLeadConvert} />
        </div>
      </Modal>

    </Grid>
  );
};
export default LeadDetailPage;

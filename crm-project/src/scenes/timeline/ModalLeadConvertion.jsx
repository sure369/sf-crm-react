import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { TextField, Box, Paper, Button, Divider, MenuItem, Select, FormControl, InputLabel, FormHelperText, InputAdornment, Checkbox } from '@mui/material'
import { Masonry } from '@mui/lab'
import { styled } from '@mui/material/styles'
import "./ModalLeadConvertion.css"
import { AccountInitialValues, OpportunityInitialValues, ContactInitialValues } from '../formik/IntialValues/formValues'
import { CheckBox } from '@mui/icons-material'
import { RequestServer } from '../api/HttpReq'
import { apiMethods } from '../api/methods'
import { POST_ACCOUNT, POST_CONTACT, POST_DEAL } from '../api/endUrls'
import ToastNotification from '../toast/ToastNotification'



const ratings = ['Hot', 'Cold', 'Warm']

function ModalLeadConvertion({ record, handleModal, leadConvertion }) {

  const URL_postAccountRecords = POST_ACCOUNT
  const URL_postDealRecords = POST_DEAL
  const URL_postContactRecords = POST_CONTACT

  const [accountName, setAccountName] = useState(record?.companyName || record.fullName + ' Lead Converted');
  const [accountRating, setAccountRating] = useState('None');
  const [opportunityName, setOpportunityName] = useState(record?.companyName || record.fullName);
  const [opportunityAmount, setOpportunityAmount] = useState(0);
  const [contactName, setContactName] = useState(record.fullName);
  const [contactEmail, setContactEmail] = useState("");
  const [error, setError] = useState('');
  const [opportunityChecked, setOpportunityChecked] = useState(false);
  const [contactChecked, setContactChecked] = useState(false);
  const [notify, setNotify] = useState({ isOpen: false, message: "", type: "", });

  console.log('record is ', record);
  console.log('handleModal is ', handleModal);

  const handleAccountNameChange = (event) => {
    console.log('event is ', event.target.value);
    setAccountName(event.target.value);
  }

  const handleRatingChange = (event) => {
    console.log('event is ', event.target.value);
    setAccountRating(event.target.value);
  }

  const handleOpportunityNameChange = (event) => {
    console.log('event is ', event.target.value);
    setOpportunityName(event.target.value);
  }

  const handleOpportunityAmountChange = (event) => {
    console.log('event is ', event.target.value);

    const regex = /^[0-9\b]+$/;
    if (event.target.value === "" || regex.test(event.target.value)) {
      setOpportunityAmount(event.target.value);
    }
  }

  const handleContactNameChange = (event) => {
    console.log('event is ', event.target.value);
    setContactName(event.target.value);
  }



  const handleContactEmailChange = (event) => {
    console.log('event is ', event.target.value);
    setContactEmail(event.target.value);
    validateEmail();
  }

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(contactEmail.trim());
    setError(!isValid);
  };

  const handleCheckOpportunity = (event) => {
    setOpportunityChecked(event.target.checked);
  }

  const handleCheckContact = (event) => {
    setContactChecked(event.target.checked);
  }




  const handleLeadConvert = () => {
    console.log('inside handleLeadConvert ');

    console.log('accountName is ', accountName);
    console.log('opportunityName is ', opportunityName);
    console.log('contactName is ', contactName);

    let dateSeconds = new Date().getTime();
    let loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"))

    const updateAccountValue = {
      ...AccountInitialValues,
      accountName: accountName,
      accountNumber: 0,
      rating: accountRating,
      modifiedDate: dateSeconds,
      createdDate: dateSeconds,
      createdBy: loggedInUser,
      modifiedBy: loggedInUser,

    }
    console.log(updateAccountValue, "updateAccountValue");

    const updateOpportunityValues = {
      ...OpportunityInitialValues,
      opportunityName: opportunityName,
      leadDetails: { leadName: record.fullName, id: record._id },
      LeadId: record._id,
      LeadName: record.fullName,
      leadSource: record.leadSource,
      amount: opportunityAmount,
      modifiedDate: dateSeconds,
      createdDate: dateSeconds,
      createdBy: loggedInUser,
      modifiedBy: loggedInUser,

    }
    console.log(updateOpportunityValues, "updateOpportunityValues");

    const updateContactValues = {
      ...ContactInitialValues,
      fullName: contactName,
      phone: record.phone,
      leadSource: record.leadSource,
      email: contactEmail,
      modifiedDate: dateSeconds,
      createdDate: dateSeconds,
      createdBy: loggedInUser,
      modifiedBy: loggedInUser,
    }



    console.log(updateContactValues, "updateContactValues");
    let array = [];
    array.push({ url: URL_postAccountRecords, data: updateAccountValue })
    opportunityChecked && array.push({ url: URL_postDealRecords, data: updateOpportunityValues })
    contactChecked && array.push({ url: URL_postContactRecords, data: updateContactValues })

    console.log(array, "array");
    array.map(i => {
      console.log(i, "array i");
      RequestServer(apiMethods.post, i.url, i.data)
        .then(res => {
          console.log(res, "res inside array insert");
          if (res.success) {
            setNotify({
              isOpen: true,
              message: res.data,
              type: "success",
            });
            // handleModal();
          } else {
            console.log(res, "error inside array insert");
            setNotify({
              isOpen: true,
              message: res.error.message,
              type: "error",
            });
          }
        })
    })
    leadConvertion();

  }

  const handleCancelConvert = () => {
    console.log('inside handleCancelConvert ');
    handleModal();
  }

  return (
    <>
      <ToastNotification notify={notify} setNotify={setNotify} />
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          margin: "10px",
        }}
      >
        <Typography fontWeight='bold' variant="h3">Convert Lead</Typography>
      </div>
      <Box sx={{ width: 500, minHeight: 393, margin: "10px" }}>
        <Divider sx={{ fontWeight: 'bold' }}>Account</Divider>
        <Box className='lead-boxes'>
          <TextField
            error={!accountName}
            required
            id="demo-text-field"
            label="Account Name"
            value={accountName}
            onChange={(event) => handleAccountNameChange(event)}
            helperText={!accountName ? 'Required' : ""}

          />
          <FormControl sx={{ minWidth: '180px' }} error={accountRating === 'None' || ""}>
            <InputLabel id="demo-simple-select-label">Rating *</InputLabel>
            <Select
              required
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={accountRating}
              label="Rating *"
              onChange={(event) => handleRatingChange(event)}
              error={accountRating === 'None' || "" ? 'Required' : ""}
            >
              <MenuItem value='None'><em>None</em></MenuItem>
              {ratings.map(rating => (
                <MenuItem value={rating}>{rating}</MenuItem>
              ))}
            </Select>
            {accountRating === 'None' ?
              <FormHelperText sx={{ color: 'red' }}>Required</FormHelperText> : ""
            }
          </FormControl>

        </Box>
        <Divider sx={{ fontWeight: 'bold' }}>Opportunity</Divider>
        <Box className='lead-boxes'>
          <Checkbox checked={opportunityChecked} onChange={(event) => handleCheckOpportunity(event)} />
          {opportunityChecked ?
            <>
              <TextField
                id=""
                label="Opportunity Name"
                value={opportunityName}
                onChange={(event) => handleOpportunityNameChange(event)}

              />
              <TextField

                id=""
                label="Opportunity Amount"
                value={opportunityAmount}
                onChange={(event) => handleOpportunityAmountChange(event)}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}

              />
            </> : <Typography>Would you like to Convert the Lead into Opportunity, If Yes Check the Box. </Typography>
          }
        </Box>
        <Divider sx={{ fontWeight: 'bold' }}>Contact</Divider>
        <Box className='lead-boxes'>
          <Checkbox checked={contactChecked} onChange={(event) => handleCheckContact(event)} />
          {contactChecked ?
            <>
              <TextField
                id=""
                label="Contact Name"
                value={contactName}
                onChange={(event) => handleContactNameChange(event)}

              />
              <TextField
                id=""
                label="Email"
                // type={'email'}
                value={contactEmail}
                onChange={(event) => handleContactEmailChange(event)}
                onBlur={validateEmail}
                error={contactEmail === "" ? "" : error}
                helperText={contactEmail === "" ? "" : error ? 'Invalid email' : ''}
              />
            </> : <Typography>Would you like to Convert the Lead into Contact, If Yes Check the Box. </Typography>
          }
        </Box>

        {/* <Accordion className='modal-lead-accordion'>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-label="Expand"
            aria-controls="-content"
            id="-header"
          >
            <Typography>Account Name</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              required
              id=""
              label="Account Name"
              value={accountName}
              onChange={(event) => handleAccountNameChange(event)}

            />
          </AccordionDetails>
        </Accordion>
        <Accordion className='modal-lead-accordion'>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-label="Expand"
            aria-controls="-content"
            id="-header"
          >
            <Typography>Opportunity Name</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              id=""
              label="Opportunity Name"
              value={opportunityName}
              onChange={(event) => handleOpportunityNameChange(event)}

            />
          </AccordionDetails>
        </Accordion>
        <Accordion className='modal-lead-accordion'>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-label="Expand"
            aria-controls="-content"
            id="-header"
          >
            <Typography>Contact Name</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              id=""
              label="Contact Name"
              value={contactName}
              onChange={(event) => handleContactNameChange(event)}

            />
          </AccordionDetails>
        </Accordion> */}


        <div style={{ display: "flex", justifyContent: "center", gap: "5px" }}>
          <Button
            type="success"
            variant="contained"
            color="secondary"
            onClick={() => handleLeadConvert()}
            disabled={(!accountName) || (!accountRating || accountRating === 'None')}

          >
            Convert
          </Button>
          <Button
            type="reset"
            variant="contained"
            onClick={() => handleCancelConvert()}
          >
            Cancel
          </Button>
        </div>
      </Box>
    </>
  );
}

export default ModalLeadConvertion
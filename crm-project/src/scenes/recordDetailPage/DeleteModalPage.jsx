import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Grid, Button, FormControl, Stack, Alert, DialogActions,
    Autocomplete, TextField ,Dialog,DialogTitle,Box,IconButton,
    DialogContent,Typography ,DialogContentText
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios'
import SimpleSnackbar from "../toast/SimpleSnackbar";
import "../formik/FormStyles.css"

const UpsertUrl = "http://localhost:4000/api/UpsertTask";
const urlDelete ="http://localhost:4000/api/deleteAccount?code=";


const ModalDeletePage = ({ handleModal,handleDeleteConfirm,row }) => {

    console.log('row ',row);
    console.log('handle modal',handleModal.setModalOpen)
    console.log('handle handleDeleteConfirm',handleDeleteConfirm)


    const [open, setOpen] = useState(true);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleCloseCancel = () => {
      setOpen(false);
      handleModal(false)
    };
    const handleCloseConfirm = () => {
        setOpen(false);
        handleModal(false)
        handleDeleteConfirm(true)
        onHandleDelete()
      };

      const onHandleDelete = ( ) => {
        // e.stopPropagation();
        console.log('req delete rec',row);
        console.log('req delete rec id',row._id);
     
        axios.post(urlDelete+row._id)
        .then((res)=>{
            console.log('api delete response',res);
            // fetchRecords();
            // //delete show toast
            // setShowAlert(true)
            // setAlertMessage(res.data)
            // setAlertSeverity('success')
        })
        .catch((error)=> {
            console.log('api delete error',error);
             //delete show toast
    
            //  setShowAlert(true)
            //  setAlertMessage(error.message)
            //  setAlertSeverity('error')
          })
      };

    return(
        <>
      <Dialog
        open={open}
        onClose={handleCloseCancel}
        maxWidth="xs" fullWidth
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm the Action "}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to delete the Record ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button  color="primary" variant="contained" onClick={handleCloseCancel}>
            Cancel
            </Button>
          <Button color="secondary" variant="contained" onClick={handleCloseConfirm} autoFocus>
          Confirm
          </Button>
        </DialogActions>
      </Dialog>
        </>

    )
    

}
export default ModalDeletePage


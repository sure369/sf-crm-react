import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Grid, Button, FormControl, Stack, Alert, DialogActions,
    Autocomplete, TextField ,Dialog,DialogTitle,Box,IconButton,
    DialogContent,Typography
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios'
import SimpleSnackbar from "../toast/SimpleSnackbar";
import "../formik/FormStyles.css"

const UpsertUrl = "http://localhost:4000/api/UpsertTask";

const ModalDeletePage = ({ handleModal }) => {

    console.log('handle modal',handleModal)

    return(
        <>
        <Dialog open={true} maxWidth="sm" fullWidth>
      <DialogTitle>Confirm the action</DialogTitle>
      <Box position="absolute" top={0} right={0}>
        <IconButton>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent>
        <Typography>some message here</Typography>
      </DialogContent>
      <DialogActions>
        <Button color="primary" variant="contained">
          Cancel
        </Button>
        <Button color="secondary" variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
        </>

    )
    

}
export default ModalDeletePage


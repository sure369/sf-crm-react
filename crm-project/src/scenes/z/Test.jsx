import React, { useEffect, useState } from 'react'
import {useLocation} from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid,Button ,DialogActions} from "@mui/material";
import { useParams,useNavigate } from "react-router-dom"
import axios from 'axios'
import SimpleSnackbar from "../toast/test";
import "../formik/FormStyles.css"

const url ="http://localhost:4000/api/UpsertInventory";

const Test = ({item}) => {
    console.log('item',item);
    useEffect(()=>{
        
    console.log('data',item);
    })

    return(
        <>
        {item}
        </>
    )

}
export default Test;
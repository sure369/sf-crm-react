import React, { useEffect, useState } from 'react'
import {useLocation} from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid,Button ,DialogActions} from "@mui/material";
import { useParams,useNavigate } from "react-router-dom"
import axios from 'axios'
import SimpleSnackbar from "../toast/test";
import "../formik/FormStyles.css"


const Test = ({item}) => {

// const [rec,setRec]=useState({city:"Dubai",country:"UAE",projectName:"property",
//                             propertyName: "LT",status:"available ",type:"Commercial Space",
//                             _id:"6396c6aa468e1e2c0d809b22"})


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
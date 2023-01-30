import React from "react";
import { Formik, Form, Field } from "formik";
import {
  Select,TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Button
} from "@mui/material";
import "./FormStyles.css"
import { AccCitiesPickList } from "../../data/pickLists";

const  CustomizedControlSelectForFormik = ({ children, form, field }) => {
    console.log('children',children);
    console.log('form',form);
    console.log('field',field);
    

  const { name, value } = field;
  const { setFieldValue } = form;

  const getCities = (billingCountry) => {
    return new Promise((resolve, reject) => {
        console.log("billingCountry", billingCountry);
        resolve(AccCitiesPickList[billingCountry] || []);
    });
};

  return (
    <TextField
        
        name={name}
        value={value}
        onChange={async (e) => {
          const _billingCities = await getCities(e.target.value);
          setFieldValue(name, e.target.value);
          setFieldValue("billingCity", "");
          setFieldValue("billingCities", _billingCities);
        }}
  >
    {children}
  </TextField>


  );
};
export default CustomizedControlSelectForFormik
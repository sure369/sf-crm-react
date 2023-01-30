import React from "react";
import { Formik, Form, Field } from "formik";
import {
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  Button
} from "@mui/material";
import "./FormStyles.css"
import { AccCitiesPickList } from "../../data/pickLists";


const  CustomizedSelectForFormik = ({ children, form, field }) => {
    console.log('children',children);
    console.log('form',form);
    console.log('field',field);
    

  const { name, value } = field;
  const { setFieldValue } = form;

 

  return (
    <Select
    className="form-customSelect"
      name={name}
      value={value}
      onChange={ (e) => {
        setFieldValue(name, e.target.value);
      }}
      // style={{
      //   width:'200px'
      //   }}
    >
      {children}
    </Select>
  );
};
export default CustomizedSelectForFormik
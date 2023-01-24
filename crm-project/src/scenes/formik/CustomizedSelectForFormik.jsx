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

const  CustomizedSelectForFormik = ({ children, form, field }) => {
    console.log('children',children);
    console.log('form',form);
    console.log('field',field);
    

  const { name, value } = field;
  const { setFieldValue } = form;

  return (
    <Select
        className="form-child"
      name={name}
      value={value}
      onChange={e => {
        setFieldValue(name, e.target.value);
      }}
    >
      {children}
    </Select>
  );
};
export default CustomizedSelectForFormik
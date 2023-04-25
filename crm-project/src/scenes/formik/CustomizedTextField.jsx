import React from "react";
import {TextField} from "@mui/material";
import "./FormStyles.css"


const  CustomizedTextFieldForFormik = ({ children, form, field,...props }) => {

    //  console.log('form',form);
    //  console.log('field',field);
    //  console.log('props',props)
    
     if(props.readOnly){
      console.log('inside read only')
     }

  const { name, value } = field;
  const { setFieldValue } = form;
  const changeFunc = (e)=>{
    // console.log(props.onChange(e));
    if(props.onChange){
      props.onChange(e);
    }
    setFieldValue(name,e.target.value)
    
  }
 

  return (
    <TextField
      className="form-customSelect"
      disabled
      name={name}
      value={value}
      onChange={ (e) => {
        changeFunc(e);
        

      }}
    >
      {children}
    </TextField>
  );
};
export default CustomizedTextFieldForFormik
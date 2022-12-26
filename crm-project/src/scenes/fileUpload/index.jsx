import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Grid, Button, FormControl, Stack, Alert, DialogActions,
    Autocomplete, TextField
} from "@mui/material";
import axios from 'axios'
import SimpleSnackbar from "../toast/SimpleSnackbar";
import "../formik/FormStyles.css"



const UpsertUrl = "http://localhost:4000/api/uploadfile";


const DropFileInput = () => {


    
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState();
    const [alertSeverity, setAlertSeverity] = useState();

 

    useEffect(() => {

       
    }, [])

    
    const initialValues = {
       name:'',
       email:'',
       photo:null,
    }




     const formSubmission = async (values, { resetForm }) => {
        console.log('inside form Submission', values);
      

        let formData = new FormData();
        // formData.append('name',values.name);
        // formData.append('email',values.email);
        formData.append('photo',values.photo);


        await axios.post(UpsertUrl, formData)
    
            .then((res) => {
                console.log('file Submission  response', res);
                setShowAlert(true)
                setAlertMessage(res.data)
                setAlertSeverity('success')
            
            })
            .catch((error) => {
                console.log('file  Submission  error', error);
                setShowAlert(true)
                setAlertMessage(error.message)
                setAlertSeverity('error')
            })
    }

    const toastCloseCallback = () => {
        setShowAlert(false)
    }

   

    return (
        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <h3>New Task</h3>                 
            </div>

            <Formik
                enableReinitialize={true}
                initialValues={initialValues}
              
                onSubmit={(values, { resetForm }) => formSubmission(values, { resetForm })}
            >
                {(props) => {
                    const {
                        values,
                        dirty,
                        isSubmitting,
                        handleChange,
                        handleSubmit,
                        handleReset,
                        setFieldValue,
                      
                    } = props;

                    return (
                        <>
                            {
                                showAlert ? <SimpleSnackbar severity={alertSeverity} message={alertMessage} showAlert={showAlert} onClose={toastCloseCallback} /> : <SimpleSnackbar />
                            }

                            <Form>
                                <Grid container spacing={2}>
                                  
                                  {/* <Grid item xs={12} md={12}>
                                    <label htmlFor="name">Name</label>
                                    <Field name='name' type="text" class="form-input" />
                                  </Grid>
                                  <Grid item xs={12} md={12}>
                                    <label htmlFor="email">Email</label>
                                    <Field name='email' type="email" class="form-input" />
                                  </Grid> */}
                                  
                                    <Grid item xs={12} md={12}>

                                        <label htmlFor="file">file</label>
                                        
                                        <Field id="file" name="file" type="file" 
                                        className="form-input"
                                        onChange={(event)=>{
                                            setFieldValue("photo", (event.currentTarget.files[0]));
                                        }} 
                                        />
                                      
                                    </Grid>
                                 </Grid>

                                <div className='action-buttons'>
                                    <DialogActions sx={{ justifyContent: "space-between" }}>
                                 
                                        <Button type='success' variant="contained" color="secondary"disabled={isSubmitting}>Save</Button>
                                                                                      
                  

                                    </DialogActions>
                                </div>
                            </Form>
                        </>
                    )
                }}
            </Formik>


        </Grid>
    )

}
export default DropFileInput



// import React, { useRef, useState } from 'react';
// import PropTypes from 'prop-types';
// import './index.css';
// import { ImageConfig } from './ImageConfig'
//  import uploadImage from '../assets/cloud-upload-regular-240.png'

// const DropFileInput = props => {

//     const wrapperRef = useRef(null);

//     const [fileList, setFileList] = useState([]);

//     const onDragEnter = () => wrapperRef.current.classList.add('dragover');

//     const onDragLeave = () => wrapperRef.current.classList.remove('dragover');

//     const onDrop = () => wrapperRef.current.classList.remove('dragover');

//     const onFileDrop = (e) => {
//         const newFile = e.target.files[0];
//         if (newFile) {
//             const updatedList = [...fileList, newFile];
//             setFileList(updatedList);
//             props.onFileChange(updatedList);
//         }
//     }

//     const fileRemove = (file) => {
//         const updatedList = [...fileList];
//         updatedList.splice(fileList.indexOf(file), 1);
//         setFileList(updatedList);
//         props.onFileChange(updatedList);
//     }

//     return (
//         <>
//             <div
//                 ref={wrapperRef}
//                 className="drop-file-input"
//                 onDragEnter={onDragEnter}
//                 onDragLeave={onDragLeave}
//                 onDrop={onDrop}
//             >
//                 <div className="drop-file-input__label">
//                     <img src={uploadImage} alt="" />
//                     <p>Drag & Drop your files here</p>
//                 </div>
//                 <input type="file" value="" onChange={onFileDrop} />
//             </div>
//             {
//                 fileList.length > 0 ? (
//                     <div className="drop-file-preview">
//                         <p className="drop-file-preview__title">
//                             Ready to upload
//                         </p>
//                         {
//                             fileList.map((item, index) => (
//                                 <div key={index} className="drop-file-preview__item">
//                                     <img src={ImageConfig[item.type.split('/')[1]] || ImageConfig['default']} alt="" />
//                                     <div className="drop-file-preview__item__info">
//                                         <p>{item.name}</p>
//                                         <p>{item.size}B</p>
//                                     </div>
//                                     <span className="drop-file-preview__item__del" onClick={() => fileRemove(item)}>x</span>
//                                 </div>
//                             ))
//                         }
//                     </div>
//                 ) : null
//             }
//         </>
//     );
// }

// DropFileInput.propTypes = {
//     onFileChange: PropTypes.func
// }

// export default DropFileInput;
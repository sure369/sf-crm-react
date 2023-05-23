import React, { useEffect, useState, useRef, useCallback } from "react";
import { Formik, Form, Field, ErrorMessage, useField } from "formik";
import * as Yup from "yup";
import { Grid, MenuItem } from "@mui/material";
import axios from 'axios'
import '../recordDetailPage/Form.css'
import CustomizedSelectForFormik from "../formik/CustomizedSelectForFormik";
import { DataLoaderObjectPicklist } from "../../data/pickLists";
import PreviewDataload from "./PreviewUpsert";
import {POST_DATALOADER_FILE_PREVIEW} from '../api/endUrls'
import { RequestServer } from "../api/HttpReq";
import { apiMethods } from "../api/methods";

const URL_filePreview = POST_DATALOADER_FILE_PREVIEW;

const DataLoadPage = () => {

    const [uplodedData, setUplodedData] = useState([])
    const [uplodedFile, setUploadedFile] = useState()

    useEffect(() => {

    }, [])

    const initialValues = {
        file: null,
        attachments: null,
        object: ''
    }
    const SUPPORTED_FORMATS = ['text/csv'];
    const FILE_SIZE = 1024 * 1024

    const validationSchema = Yup.object({
        object: Yup
            .string()
            .required('Required'),
    })

    const fileSendValue = (obj, files) => {

        
        let formData = new FormData();
        formData.append('file', files)
        formData.append('object', obj);
        console.log('modified formData', formData);
        RequestServer(apiMethods.post,(URL_filePreview, formData))
        // axios.post(URL_filePreview, formData)

            .then((res) => {
                console.log('POST_DATALOADER_FILE_PREVIEW  response', res.data);
                setUplodedData(res.data)
            })
            .catch((error) => {
                console.log('POST_DATALOADER_FILE_PREVIEW  error', error);
            })
    }


    const handleModal = () => {
        setUplodedData([])
    }
    return (
        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <h3>Data Loader1</h3>
            </div>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                // onSubmit={(values, { resetForm }) => formSubmission(values, { resetForm })}
            >
                {(props) => {
                    const {values, isValid,dirty,setFieldValue,} = props;

                    return (
                        <>
                            <Form className="my-form">
                                <Grid container spacing={2}>
                                    <Grid item xs={6} md={6}>
                                        <label htmlFor="object">Select Object <span className="text-danger">*</span></label>
                                        <Field name="object" component={CustomizedSelectForFormik} className="form-customSelect">
                                            <MenuItem value=""><em>None</em></MenuItem>
                                            {
                                                DataLoaderObjectPicklist.map((i) => {
                                                    return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                })
                                            }
                                        </Field>
                                        <div style={{ color: 'red' }}>
                                            <ErrorMessage name="object" />
                                        </div>
                                    </Grid>

                                    <Grid item xs={6} md={6}>
                                        <label htmlFor="file">File</label>
                                        <Field name="file" type="file"
                                            className="form-input"
                                            accept=".csv"
                                            onChange={(event) => {
                                                setFieldValue("attachments", (event.target.files[0]));
                                                fileSendValue(values.object, (event.target.files[0]))
                                            }}
                                        />
                                        <div style={{ color: 'red' }}>
                                            <ErrorMessage name="file" />
                                        </div>
                                    </Grid>
                                </Grid>
                                {
                                    uplodedData.length > 0 && <PreviewDataload data={uplodedData} file={uplodedFile} ModalClose={handleModal} obj={values.object} />
                                }

                            </Form>
                        </>
                    )
                }}
            </Formik>
        </Grid>
    )
}
export default DataLoadPage

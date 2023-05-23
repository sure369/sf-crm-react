import React, { useEffect, useState, useRef } from "react";
import {
    Button, Typography, Box
} from "@mui/material";
import axios from "axios";
import "../formik/FormStyles.css";
import ArticleIcon from "@mui/icons-material/Article";
import DeleteIcon from "@mui/icons-material/Delete";
import ToastNotification from "../toast/ToastNotification";
import "../recordDetailPage/Form.css";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import { useMediaQuery } from "react-responsive";
import { POST_FILE } from "../api/endUrls";
import { RequestServerFiles } from "../api/HttpReqFiles";
import { apiMethods } from "../api/methods";


const URL_postRecords = POST_FILE

const ModalFileUpload = ({ handleModal }) => {

    const [notify, setNotify] = useState({ isOpen: false, message: "", type: "", });

    const [fileUploadRes, setFileUploadResponse] = useState();
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileInputChange = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles(files);
    };

    const handleUploadButtonClick = () => {
        const formData = new FormData();
        let dateSeconds = new Date().getTime();
        let userDetails = (sessionStorage.getItem("loggedInUser"))

        selectedFiles.forEach((file) => {
            formData.append("file", file);
            formData.append("createdDate", dateSeconds)
            formData.append("modifiedDate", dateSeconds)
            formData.append("createdBy", JSON.stringify(userDetails))
            formData.append("modifiedBy", JSON.stringify(userDetails))
        });
        console.log("selected files :", selectedFiles);

        RequestServerFiles(apiMethods.post, URL_postRecords, formData)
            .then(res => {
                console.log("RequestServerFiles response", res)
                if (res.success) {
                    console.log("file Submission  response", res);
                    setFileUploadResponse(res.data);
                    setSelectedFiles([]);
                    setNotify({
                        isOpen: true,
                        message: "file Uploaded successfully",
                        type: "success",
                    });
                }else{
                    console.log("RequestServer file then error",res.error.message)
                    setNotify({
                        isOpen: true,
                        message: res.error.message,
                        type: "error",
                    });
                }                
            })
            .catch((error)=>{
                console.log('RequestServer file form Submission  error', error);
                setNotify({
                    isOpen: true,
                    message: error.message,
                    type: "error",
                });
            })
            .finally(()=>{
                handleModal()
            })

        // axios
        //   .post(URL_postRecords, formData, {
        //     headers: { "Content-Type": "multipart/form-data" },
        //   })
        //   .then((res) => {
        //     console.log("file Submission  response", res);
        //     setFileUploadResponse(res.data);
        //     console.log("res data is :", res.data);
        //     console.log("uploaded files : ", fileUploadRes);
        //     setSelectedFiles([]);
        //     setNotify({
        //       isOpen: true,
        //       message: "Uploaded Successfully",
        //       type: "success",
        //     });
        //     document.getElementById("images").value = "";

        //   })
        //   .catch((error) => {
        //     console.log("fupload error", error);
        //     setNotify({
        //       isOpen: true,
        //       message: error.message,
        //       type: "error",
        //     });
        //   })
        //   .finally(()=>{
        //     handleModal()
        //   })
    };

    const handleClearInput = () => {
        setSelectedFiles([]);
        document.getElementById("images").value = "";
    };



    return (
        <>
            <ToastNotification notify={notify} setNotify={setNotify} />

            <Box sx={{ height: "500px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "285px" }}>
                <Typography variant="h4">Upload Your Files</Typography>
                <label htmlFor="images" className="input-drop-container">
                    <input
                        className="file-upload-input"
                        accept=".jpeg, .pdf, .png, .csv, .xlsx, .doc"
                        sx={{ cursor: "pointer" }}
                        id="images"
                        type="file"
                        multiple
                        onChange={handleFileInputChange}
                    />
                </label>


                <Box
                    sx={{
                        display: "flex",
                        width: "350px",
                        justifyContent: "center",
                        gap: "5px"
                    }}
                >
                    <Button
                        sx={{ marginTop: "10px" }}
                        type="success"
                        variant="contained"
                        color="secondary"
                        onClick={handleUploadButtonClick}
                        startIcon={<FileUploadIcon />}
                    >
                        Upload
                    </Button>
                    <Button
                        type="reset"
                        variant="outlined"
                        sx={{
                            marginTop: "10px",
                            color: "black",
                            backgroundColor: "whitesmoke",
                        }}
                        onClick={() => handleClearInput()}
                        startIcon={<ClearAllIcon />}
                    >
                        Clear
                    </Button>
                </Box>

            </Box>
        </>
    );

};
export default ModalFileUpload;
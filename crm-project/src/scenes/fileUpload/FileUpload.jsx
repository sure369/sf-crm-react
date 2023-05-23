import React, { useEffect, useState, useRef } from "react";
import {
  Grid, Button, List, ListItem, ListItemButton, ListItemText,
  ListItemIcon, Accordion, AccordionSummary, Typography,
  AccordionDetails, Box, Paper, Alert,
  AlertTitle, Divider, Tooltip, Modal,
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

const UpsertUrl = `${process.env.REACT_APP_SERVER_URL}/uploadfile`;
const urlFiles = `${process.env.REACT_APP_SERVER_URL}/files`;
const deleteUrl = `${process.env.REACT_APP_SERVER_URL}/deletefile?code=`;

const FileUpload = () => {
  const [filesList, setFileList] = useState([]);

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  // file upload response
  const [fileUploadRes, setFileUploadResponse] = useState();
  console.log("fileUploadRes", fileUploadRes);

  const [open, setOpen] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState([]);
  useEffect(() => {
    getFilesList();
    console.log("fileUploadRes", fileUploadRes);
  }, []);

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  });
  const isBigScreen = useMediaQuery({ query: "(min-width: 1824px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1124px)" });
  const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });
  const isRetina = useMediaQuery({ query: "(min-resolution: 2dppx)" });

  const getFilesList = async () => {
    await axios
      .post(urlFiles)

      .then((res) => {
        console.log("get file list", res);
        if (typeof res.data !== "string") {
          console.log("res data ", res.data);
          setFileList(res.data);
        } else {
          setFileList([]);
        }
      })
      .catch((error) => {
        console.log("get file list error", error);
      });
  };

  const initialValues = {
    files: [],
  };

  const handleFileInputChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleUploadButtonClick = () => {
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("file", file);
    });
    console.log("selected files :", selectedFiles);

    axios
      .post(UpsertUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        console.log("file Submission  response", res);
        setFileUploadResponse(res.data);
        console.log("res data is :", res.data);
        console.log("uploaded files : ", fileUploadRes);
        setSelectedFiles([]);
        setNotify({
          isOpen: true,
          message: "Uploaded Successfully",
          type: "success",
        });
        document.getElementById("images").value = "";
        getFilesList();
      })
      .catch((error) => {
        console.log("fupload error", error);
        setNotify({
          isOpen: true,
          message: error.message,
          type: "error",
        });
      });
  };

  const handleRowClick = (fileUrl) => {
    window.open(fileUrl, "_blank");
  };

  const handleOnRowDelete = (item) => {
    console.log("inside delete row", item);
    axios
      .post(deleteUrl + item._id)
      .then((res) => {
        console.log("File Deleted Successfully", res);
        getFilesList();
        setNotify({
          isOpen: true,
          message: "File Deleted Successfully",
          type: "success",
        });
      })
      .catch((err) => {
        console.log("Error Deleting Records", err);
      });
  };

  const handleClearInput = () => {
    console.log("inside handleClearInput");
    setSelectedFiles([]);
    document.getElementById("images").value = "";
  };

  const handleFilesOpen = () => {
    setOpen(true);
  };

  const handleFileClose = () => {
    setOpen(false);
  };

  return (
    <>
      <ToastNotification notify={notify} setNotify={setNotify} />

      <Box sx={{ height: "500px" }}>
        <Grid
          height="500px"
          container
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
          paddingTop="30px"
          marginLeft="50px"
        >
          <Paper
            elevation={16}
            sx={{
              height: "250px",
              width: "500px",
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "12px",
            }}
          >
            <label htmlFor="images" className="input-drop-container">
              <span
                sx={{
                  marginRight: "180px",
                  marginBottom: "5px",
                }}
              >
                File Upload
              </span>
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

            <Grid
              marginTop="12px"
              height="50px"
              container
              direction="row"
              justifyContent="center"
            >
              {selectedFiles.length > 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    width: "200px",
                    justifyContent: "space-between",
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
                    onClick={() => handleClearInput(selectedFiles)}
                    startIcon={<ClearAllIcon />}
                  >
                    Clear
                  </Button>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "grid",
                    width: "200px",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    sx={{ marginTop: "10px" }}
                    variant="contained"
                    color="secondary"
                    onClick={handleFilesOpen}
                    startIcon={<FileOpenIcon />}
                  >
                    View Files
                  </Button>
                </Box>
              )}

              <Modal
                open={open}
                onClose={handleFileClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <div className="modal">
                  <Box className="modal-box">
                    <List
                      sx={{
                        width: "100%",
                        maxWidth: 550,
                        bgcolor: "#f0f6fb",
                        position: "relative",
                        overflow: "auto",
                        borderRadius: "8px",
                        maxHeight: 250,
                        "& ul": { padding: 0 },
                      }}
                      subheader={<ListItem />}
                    >
                      <Typography
                        display="flex"
                        justifyContent="center"
                        variant="h4"
                      >
                        Uploaded Files
                      </Typography>
                      {filesList.map((item, index) => (
                        <>
                          <ListItem sx={{ maxHeight: "200px" }}>
                            {index + 1}
                            <ListItemButton
                              onClick={() => handleRowClick(item.fileUrl)}
                            >
                              <ListItemIcon>
                                <ArticleIcon />
                              </ListItemIcon>
                              <Tooltip
                                arrow
                                placement="bottom"
                                title={item.originalname}
                              >
                                <ListItemText
                                  sx={{ wordBreak: "break-all" }}
                                  primary={item.originalname}
                                ></ListItemText>
                              </Tooltip>
                            </ListItemButton>
                            <DeleteIcon
                              sx={{ cursor: "pointer" }}
                              onClick={() => handleOnRowDelete(item)}
                            />
                          </ListItem>
                          <Divider component="li" />
                        </>
                      ))}
                    </List>
                  </Box>
                </div>
              </Modal>
            </Grid>
          </Paper>
        </Grid>
      </Box>
    </>
  );

};
export default FileUpload;

  // return (
  //   <>
  //     <ToastNotification notify={notify} setNotify={setNotify} />


  //     <Box
  //       sx={{
  //         height: "500px",
  //       }}
  //     >
  //       <Grid
  //         height="500px"
  //         container
  //         direction="row"
  //         justifyContent="center"
  //         alignItems="flex-start"
  //         paddingTop="30px"
  //         marginLeft="50px"
  //       >
  //         <Paper
  //           elevation={16}
  //           sx={{
  //             height: "250px",
  //             width: "500px",
  //             display: "flex",
  //             flexWrap: "wrap",
  //             flexDirection: "column",
  //             alignItems: "center",
  //             justifyContent: "center",
  //             borderRadius: "12px",
  //           }}
  //         >

  //           <label for="images" class="input-drop-container">
  //             <span
  //               style={{
  //                 marginRight: "180px",
  //                 marginBottom: "5px",
  //               }}
  //             >
  //               File Upload
  //             </span>

  //             <input
  //               className="file-upload-input"
  //               accept=".jpeg, .pdf, .png, .csv, .xlsx, .doc, "
  //               style={{ cursor: "pointer" }}
  //               id="images"
  //               type="file"
  //               multiple
  //               onChange={handleFileInputChange}
  //             />
  //           </label>

  //           <Grid
  //             marginTop="12px"
  //             height="50px"
  //             container
  //             direction="row"
  //             justifyContent="center"
  //           >
  //             {selectedFiles.length > 0 && (
  //               <>
  //                 <Box
  //                   sx={{
  //                     display: "flex",
  //                     width: "200px",
  //                     justifyContent: "space-between",
  //                   }}
  //                 >
  //                   <Button
  //                     sx={{ marginTop: "10px" }}
  //                     type="success"
  //                     variant="contained"
  //                     color="secondary"
  //                     onClick={handleUploadButtonClick}
  //                     startIcon={<FileUploadIcon />}
  //                   >
  //                     Upload
  //                   </Button>
  //                   <Button
  //                     type="reset"
  //                     variant="outlined"
  //                     sx={{
  //                       marginTop: "10px",
  //                       color: "black",
  //                       backgroundColor: "whitesmoke",
  //                     }}
  //                     onClick={() => handleClearInput(selectedFiles)}
  //                     startIcon={<ClearAllIcon />}
  //                   >
  //                     Clear
  //                   </Button>
  //                 </Box>
  //               </>
  //             )}
  //             {selectedFiles.length === 0 && (
  //               <Box
  //                 sx={{
  //                   display: "grid",
  //                   width: "200px",
  //                   justifyContent: "center",
  //                 }}
  //               >
  //                 <Button
  //                   sx={{ marginTop: "10px" }}
  //                   variant="contained"
  //                   color="secondary"
  //                   onClick={handleFilesOpen}
  //                   startIcon={<FileOpenIcon />}
  //                 >
  //                   View Files
  //                 </Button>
  //               </Box>
  //             )}

  //             <Modal
  //               open={open}
  //               onClose={handleFileClose}
  //               aria-labelledby="modal-modal-title"
  //               aria-describedby="modal-modal-description"
  //             >
  //               <div className="modal">
  //                 <Box className="modal-box">

  //                   <List
  //                     sx={{
  //                       width: "100%",
  //                       maxWidth: 550,
  //                       bgcolor: "#f0f6fb",
  //                       position: "relative",
  //                       overflow: "auto",
  //                       borderRadius: "8px",
  //                       maxHeight: 250,
  //                       "& ul": { padding: 0 },
  //                     }}
  //                     subheader={<ListItem />}
  //                   >
  //                     <Typography
  //                       display="flex"
  //                       justifyContent="center"
  //                       variant="h4"
  //                     >
  //                       Uploaded Files
  //                     </Typography>
  //                     {filesList.map((item, index) => (
  //                       <>
  //                         <ListItem sx={{ maxHeight: "200px" }}>
  //                           {index + 1}

  //                           <ListItemButton
  //                             onClick={() => handleRowClick(item.fileUrl)}
  //                           >
  //                             <ListItemIcon>
  //                               <ArticleIcon />
  //                             </ListItemIcon>
  //                             <Tooltip
  //                               arrow
  //                               placement="bottom"
  //                               title={item.originalname}
  //                             >
  //                               <ListItemText
  //                                 sx={{ wordBreak: "break-all" }}
  //                                 primary={item.originalname}
  //                               ></ListItemText>
  //                             </Tooltip>
  //                           </ListItemButton>

  //                           <DeleteIcon
  //                             sx={{ cursor: "pointer" }}
  //                             onClick={() => handleOnRowDelete(item)}
  //                           />
  //                         </ListItem>
  //                         <Divider component="li" />
  //                       </>
  //                     ))}
  //                   </List>
  //                 </Box>
  //               </div>
  //             </Modal>
  //           </Grid>
  //         </Paper>
  //       </Grid>
  //     </Box>
  //   </>
  // );
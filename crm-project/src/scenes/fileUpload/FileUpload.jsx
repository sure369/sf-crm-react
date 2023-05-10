import React, { useEffect, useState, useRef } from "react";
import {
  Grid,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Box,
  Paper,
  Alert,
  AlertTitle,
  Divider,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import "../formik/FormStyles.css";
import ArticleIcon from "@mui/icons-material/Article";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ToastNotification from "../toast/ToastNotification";
import "../recordDetailPage/Form.css";

const UpsertUrl = `${process.env.REACT_APP_SERVER_URL}/uploadfile`;
const urlFiles = `${process.env.REACT_APP_SERVER_URL}/files`;
const deleteUrl = `${process.env.REACT_APP_SERVER_URL}/deletefile?code=`;

const FileUpload = () => {
  const [filesList, setFileList] = useState([]);
  // const [hoveredFile, setHoveredFile] = useState(null);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  // file upload response
  const [fileUploadRes, setFileUploadResponse] = useState();
  console.log("fileUploadRes", fileUploadRes);

  const [selectedFiles, setSelectedFiles] = useState([]);
  useEffect(() => {
    getFilesList();
    console.log("fileUploadRes", fileUploadRes);
  }, []);

  const getFilesList = async () => {
    // const {data} =await axios.get(urlFiles)
    // setFileList(data);
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
        // setFileUploadResponse(old => [...old, res.data]);
        console.log("res data is :", res.data);
        console.log("uploaded files : ", fileUploadRes);
        setSelectedFiles([]);
        setNotify({
          isOpen: true,
          message: "Uploaded Successfully",
          type: "success",
        });
        // setSelectedFiles(null);
        document.getElementById("null").value = "";
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
    document.getElementById("null").value = "";
  };

  // const handleMouseOver = (file) => {
  //   setHoveredFile(file);
  // };

  // const handleMouseOut = () => {
  //   setHoveredFile(null);
  // };

  return (
    <>
      <ToastNotification notify={notify} setNotify={setNotify} />
      {/* {hoveredFile && (
        <img
          height={200}
          width={200}
          src={hoveredFile.fileUrl} // or use a different URL depending on file type
          alt={hoveredFile.name}
        />
      )} */}
      <Box
        sx={{
          height: "500px",
        }}
      >
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
            {/* <div className="drop-container"> */}
            <label for="images" class="input-drop-container">
              <b
                style={{
                  marginRight: "180px",
                  marginBottom: "5px",
                }}
              >
                File Upload
              </b>

              <input
                className="file-upload-input"
                accept=".jpeg, .pdf, .png, .csv, .xlsx, .doc, "
                style={{ cursor: "pointer" }}
                id="null"
                type="file"
                multiple
                onChange={handleFileInputChange}
              />
              {selectedFiles.length > 0 && (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      width: "150px",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      sx={{ marginTop: "10px" }}
                      type="success"
                      variant="contained"
                      color="secondary"
                      onClick={handleUploadButtonClick}
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
                    >
                      Clear
                    </Button>
                  </Box>
                </>
              )}
            </label>
            {/* </div> */}

            <Grid
              marginTop="12px"
              height="50px"
              container
              direction="row"
              justifyContent="center"
            >
              <Grid item xs={9}>
                <Accordion style={{ borderRadius: "10px" }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography fontWeight="bold">UPLOADED FILES</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List
                      sx={{
                        width: "100%",
                        maxWidth: 360,
                        bgcolor: "#eeeeff",
                        position: "relative",
                        overflow: "auto",
                        borderRadius: "8px",
                        maxHeight: 240,
                        "& ul": { padding: 0 },
                      }}
                      subheader={<ListItem />}
                    >
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
                                  // onMouseOver={() => handleMouseOver(item)}
                                  // onMouseOut={handleMouseOut}
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
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Box>
    </>
  );
};
export default FileUpload;

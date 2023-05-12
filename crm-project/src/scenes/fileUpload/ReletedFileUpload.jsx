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
  Modal,
  IconButton,
  ListSubheader,
} from "@mui/material";
import axios from "axios";
import "../formik/FormStyles.css";
import ArticleIcon from "@mui/icons-material/Article";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ToastNotification from "../toast/ToastNotification";
import "../recordDetailPage/Form.css";
import "./RelatedFileUpload.css";
import { CloseOutlined } from "@mui/icons-material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import useViewport from "../../utility/useViewPort";
import CircularProgress from "@mui/material/CircularProgress";
// import LinearProgress from "@mui/material/LinearProgress";

const UpsertUrl = `${process.env.REACT_APP_SERVER_URL}/uploadfile`;
const urlFiles = `${process.env.REACT_APP_SERVER_URL}/files`;
const deleteUrl = `${process.env.REACT_APP_SERVER_URL}/deletefile?code=`;

const RelatedFileUpload = (taskId) => {
  const inputRef = useRef(null);
  const [isLoading, setisLoading] = useState(false);

  console.log("taskId is :", taskId);
  const [filesList, setFileList] = useState([]);

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const [open, setOpen] = useState(false);

  // file upload response
  const [RelatedfileUploadRes, setRelatedFileUploadResponse] = useState();
  console.log("RelatedfileUploadRes", RelatedfileUploadRes);

  const [selectedFiles, setSelectedFiles] = useState([]);
  useEffect(() => {
    getFilesList();
    console.log("RelatedfileUploadRes", RelatedfileUploadRes);
  }, []);

  const { width, breakpoint } = useViewport();

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

  const handleUploadButtonClick = (event) => {
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("file", file);
    });
    console.log("selected files :", selectedFiles);

    console.log("formData :", formData);
    setisLoading(true);

    axios
      .post(UpsertUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        console.log("file Submission  response", res);
        setRelatedFileUploadResponse(res.data);
        // setRelatedFileUploadResponse(old => [...old, res.data]);
        console.log("res data is :", res.data);
        console.log("uploaded files : ", RelatedfileUploadRes);
        setSelectedFiles([]);
        setNotify({
          isOpen: true,
          message: "Uploaded Successfully",
          type: "success",
        });
        // setSelectedFiles(null);
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
    setisLoading(false);
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

  const fileUploadTime = 50;

  // const resWidth = window.innerWidth;
  // const responsive = resWidth < breakpoint ? 290 : 550;

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
      <Box className="related-file-box">
        <Grid
          height="500px"
          container
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
          //   paddingTop="30px"
          //   marginLeft="50px"
        >
          {/* <Paper
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
              marginRight: "100px",
            }}
          > */}
          {/* <div className="drop-container"> */}
          <label for="images" class="related-input-drop-container">
            {/* <b
                style={{
                  marginRight: "180px",
                  marginBottom: "5px",
                }}
              >
                File Upload
              </b> */}

            <input
              className="related-file-upload-input"
              accept=".jpeg, .pdf, .png, .csv, .xlsx, .doc, "
              style={{ cursor: "pointer" }}
              id="images"
              type="file"
              multiple
              onChange={(event) => handleFileInputChange(event)}
            />
          </label>

          {selectedFiles.length > 0 && (
            <>
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
            </>
          )}

          {/* </div> */}
          {selectedFiles.length === 0 && (
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
              <Box className="related-modal-box">
                {/* <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <IconButton onClick={handleFileClose}>
                    <CloseOutlined />
                  </IconButton>
                </div> */}

                <List
                  sx={{
                    width: "100%",
                    maxWidth: 550,
                    bgcolor: "#f0f6fb",
                    position: "relative",
                    overflow: "auto",
                    borderRadius: "8px",
                    maxHeight: 240,
                    "& ul": { padding: 0 },
                  }}
                  subheader={
                    <ListSubheader
                      sx={{
                        display: "flex",
                        fontSize: "20px",
                        justifyContent: "center",
                      }}
                    >
                      Uploaded Files
                    </ListSubheader>
                  }
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
              </Box>
            </div>
          </Modal>

          <Grid
            // marginTop="12px"
            marginBottom="280px"
            height="50px"
            container
            direction="row"
            justifyContent="center"
          >
            <Grid item xs={11}>
              {/* <Accordion style={{ borderRadius: "10px" }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography fontWeight="bold">UPLOADED FILES</Typography>
                </AccordionSummary>
                <AccordionDetails> */}
              {/* <List
                    sx={{
                    width: "100%",
                    maxWidth: 360,
                    bgcolor: "#f0f6fb",
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
                </List> */}
              {/* </AccordionDetails>
              </Accordion> */}
            </Grid>
          </Grid>
          {/* </Paper> */}
        </Grid>
      </Box>
    </>
  );
};
export default RelatedFileUpload;

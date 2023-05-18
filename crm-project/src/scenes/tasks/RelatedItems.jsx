import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card, CardContent, Box, Button, Typography, Modal,
  IconButton, Grid, Accordion, AccordionSummary,
  AccordionDetails, Pagination, Menu, MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ModalLeadTask from "../tasks/ModalLeadTask";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PreviewFile from "../formik/PreviewFile";
import { string } from "yup/lib/locale";
// import FileUpload from "../fileUpload/FileUpload";
import RelatedFileUpload from "../fileUpload/ReletedFileUpload";

const TaskRelatedItems = ({ item }) => {
  const urlDelete = `${process.env.REACT_APP_SERVER_URL}/deleteTask?code=`;

  const navigate = useNavigate();
  const location = useLocation();
  const [relatedTask, setRelatedTask] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [taskRecordId, setTaskRecordId] = useState();

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState();
  const [alertSeverity, setAlertSeverity] = useState();

  const [itemsPerPage, setItemsPerPage] = useState(2);
  const [page, setPage] = useState(1);
  const [noOfPages, setNoOfPages] = useState(0);

  const [resFiles, setResFiles] = useState();

  useEffect(() => {
    console.log(" Task RecordId", location.state.record.item);
    if (location.state.record.item) {
      setTaskRecordId(location.state.record.item._id);
      // console.log("taskRecordID is :", taskRecordId);
    }
  }, []);

  return (
    <>
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <h2> Related Items </h2>
      </div>

      <Accordion style={{ borderRadius: "10px" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h4">Notes and Attachments </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <RelatedFileUpload taskID={taskRecordId} />
        </AccordionDetails>
      </Accordion>

      {/* 
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="modal">
          <ModalLeadTask handleModal={handleModalClose} />
        </div>
      </Modal> */}
    </>
  );
};
export default TaskRelatedItems;

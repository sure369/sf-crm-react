import React ,{ useEffect, useState ,useRef } from "react";
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Inventories from '../inventories';
import Test from './Test';
import axios from 'axios'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid,Button ,DialogActions} from "@mui/material";
import SimpleSnackbar from "../toast/test";
import "../formik/FormStyles.css"

import {useLocation ,useNavigate} from 'react-router-dom';
import LeadDetailPage from "../recordDetailPage/LeadDetailPage";
import NewEventForm from "../formik/NewEvent";

const urlInventory = "http://localhost:4000/api/inventories";
const url ="http://localhost:4000/api/UpsertInventory";

function Item(props) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        p: 1,
        m: 1,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : 'grey.100'),
        color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
        border: '1px solid',
        borderColor: (theme) =>
          theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
        borderRadius: 2,
        fontSize: '0.875rem',
        fontWeight: '700',
        ...sx,
      }}
      {...other}
    />
  );
}

Item.propTypes = {
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
    ),
    PropTypes.func,
    PropTypes.object,
  ]),
};

const FlexLeadEvent = (item) => {

    const [property, setProperty] = useState([{}])
    const [rowId, setRowId] = useState()
    const [singleProps, setSingleProps] = useState({})
    const [loading, setLoading] = useState(true)
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [showNew, setshowNew] = useState()
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState();
    const [alertSeverity, setAlertSeverity] = useState();

    const[passedRecord,setPassedRecord] =useState();
    const location = useLocation();
    useEffect(() => {

        console.log('passed record',location.state.record.item)
        setPassedRecord(location.state.record.item); 

       
    }, [])



 

   
    return (
        <div style={{ width: '100%' }}>
            <Box
                sx={{ display: 'flex', p: 1, bgcolor: 'background.paper', borderRadius: 1 }}
            >

                <Item sx={{ width: '70%' }}><LeadDetailPage props={passedRecord}/> </Item>
                <Item sx={{ width: '30%' }}> <NewEventForm props={passedRecord} /> </Item>
            </Box>
        </div>
    );
}
export default FlexLeadEvent

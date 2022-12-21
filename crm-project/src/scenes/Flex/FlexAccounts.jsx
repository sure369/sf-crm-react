import React ,{ useEffect, useState ,useRef } from "react";
import PropTypes from 'prop-types';
import { Box,Grid,Button ,DialogActions} from "@mui/material";
import {useLocation ,useNavigate} from 'react-router-dom';
import CardAccTask from "../tasks/CardAccTask";
import AccountDetailPage from "../recordDetailPage/AccountDetailPage";

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

const FlexAccounts = (item) => {

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

                <Item sx={{ width: '65%' }}> <AccountDetailPage props={passedRecord}/> </Item>
                <Item sx={{ width: '35%' }}> <CardAccTask props={passedRecord} /> </Item>

                
            </Box>
        </div>
    );
}
export default FlexAccounts

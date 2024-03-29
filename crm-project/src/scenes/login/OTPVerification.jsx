import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, Link, Navigate } from 'react-router-dom';
import {
    Grid, Button, DialogActions, InputAdornment, IconButton,
    Box, Paper, Avatar, Typography, TextField
} from "@mui/material";
import '../recordDetailPage/Form.css'
import Cdlogo from '../assets/cdlogo.jpg';
import OtpInput from 'react-otp-input';
import { RequestServer } from "../api/HttpReq";
import { apiMethods } from "../api/methods";
import { POST_Generate_OTP } from "../api/endUrls";

const URL_generate_OTP = POST_Generate_OTP

export default function OTPVerification() {
    const paperStyle = { padding: 20, height: '100%', width: 280, margin: "20px auto" }
    const avatarStyle = { width: 100, height: 100 }
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const navigate = useNavigate();
    const location = useLocation();
    const isRunned=useRef(false);
    const [otp, setOtp] = useState('');
    const [isResendOtpClicked, setIsResendOtpClicked] = useState(false);

    const [minutes, setMinutes] = useState(1);
    const [seconds, setSeconds] = useState(30);

    const otpStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',
    };

    const inputStyle = {
        width: '50px',
        height: '50px',
        marginRight: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '20px',
        textAlign: 'center',
    };

    useEffect(() => {
        console.log(location.state.record.item, "otp useEffect")
       
        if(isRunned.current) return;
       isRunned.current=true;
       if(isRunned.current)
       return handleSendEmailId()
    },[])

    const handleSendEmailId = () => {
        RequestServer(apiMethods.post,URL_generate_OTP, { emailId: location.state.record.item.email })
            .then((res) => {
                console.log(res.data, "otp email res")
                if(res.success){
                    console.log("res success",res)
                }else{
                    console.log("res then error",res.error.message)
                }                
            })
            .catch((err) => {
                console.log(err, "otp email error")
            })
    }

    const handleSendOtp =()=>{
        RequestServer(apiMethods.post,URL_generate_OTP, {otp: otp})
        .then((res) => {
            console.log(res.data, "otp RES")
            if(res.data.status==='success'){
                const item =location.state.record.item
                navigate('/confirm-password',{ state: { record: { item } }});
            }
        })
        .catch((err) => {
            console.log(err, "error")
        })
    }

    const handleResendOtp = () => {
        setIsResendOtpClicked(true);
        handleSendEmailId();
    }

    const handleOtpSubmit = () => {
        console.log('OTP submitted:', otp);
        handleSendOtp()
    }

    const handleOtpChange = (otp) => {
        setOtp(otp);
    }

    const handleClearOtp = () => {
        setOtp('');
    }
    return (
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                    <Avatar style={avatarStyle}>
                        <img src={Cdlogo} alt="cdlogo" style={avatarStyle} />
                    </Avatar>
                    <h2>Confirm OTP</h2>
                </Grid>

                <OtpInput
                    value={otp}
                    onChange={handleOtpChange}
                    numInputs={4}
                    // renderSeparator={<span> - </span>}
                    isInputNum={true}
                    shouldAutoFocus
                    isDisabled={isResendOtpClicked}
                    inputStyle={inputStyle}
                    containerStyle={otpStyle}
                    
                    renderInput={(props) => <input {...props} />}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={handleResendOtp} disabled={isResendOtpClicked || seconds>0 || minutes>0 } 
                    sx={{color:seconds >0 || minutes >0 ? "#DFE3E8" :"#FF5630"}} > Resend OTP</Button>
                    <Button onClick={handleClearOtp}>Clear OTP</Button>
                    <Button onClick={handleOtpSubmit} disabled={!otp}>Submit OTP</Button>
                </div>



                <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                        <Typography component={Link} to='/'>Login Page</Typography>
                </div>
            </Paper>
            
        </Grid>
    )
}



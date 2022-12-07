import {Snackbar,Alert} from"@mui/material";
import { useState } from "react";

export default function SimpleSnackbar({message,showAlert,onClose,severity}) {


  // console.log('message',message);
  // console.log('showAlert',showAlert);
  // console.log('onClose',onClose);
    return (
      <Snackbar
      key={Math.random()}
      anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
      }}
       open={showAlert}
      autoHideDuration={1000}
      // message={message}
      // onClose={onClose}
      // ContentProps={{ bgcolor:"red",color:'green'}}
  >
      <Alert onClose={onClose} severity={severity}  open={showAlert}>
          {message}
      </Alert>
  </Snackbar>
 
    )
};

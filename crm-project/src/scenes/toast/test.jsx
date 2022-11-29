import {Snackbar,Alert} from"@mui/material";
import { useState } from "react";

export default function SimpleSnackbar({message,showAlert,onClose,severity}) {


  console.log('message',message);
  console.log('showAlert',showAlert);
  console.log('onClose',onClose);
    return (
  
     
      <Snackbar
      
      key={Math.random()}
      anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
      }}
      open={showAlert}
      autoHideDuration={5000}
      message={message}
      onClose={onClose}
      ContentProps={{ bgcolor:"red",color:'green'}}
  >
      <Alert onClose={onClose} severity={severity}>
      {message}
      </Alert>
  </Snackbar>
 
    )
};

// import {Snackbar,Alert} from"@mui/material";
// import { useState } from "react";

// export default function SimpleSnackbar({message,showAlert,onClose}  ) {

//   const [value, setValue] = useState(message);

//   console.log('message',message)
//   console.log('showAlert',showAlert)
//   console.log('onClose',onClose)
  

//     return (
//       <Snackbar
      
//       key={Math.random()}
//       anchorOrigin={{
//           vertical: 'top',
//           horizontal: 'center'
//       }}
//       open={showAlert}
//       autoHideDuration={5000}
//       message={message}
//       onClose={onClose}
//       ContentProps={{ bgcolor:"red",color:'green'}}
//   >
//       <Alert onClose={onClose} severity="success">
//       {message}
//       </Alert>
//   </Snackbar>
 
//     )
// };
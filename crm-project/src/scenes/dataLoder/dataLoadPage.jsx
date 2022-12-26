import React, { useEffect, useState, useRef ,useCallback } from "react";
import { Formik, Form, Field, ErrorMessage,useField } from "formik";
import * as Yup from "yup";
import {
    Grid, Button, FormControl, Stack, Alert, DialogActions,
    Autocomplete, TextField
} from "@mui/material";
import axios from 'axios'
import "../formik/FormStyles.css"




const UpsertUrl = "http://localhost:4000/api/dataloaderlead";



const DataLoadPage = () => {

      

  



    useEffect(() => {
       
    }, [])

    
    const initialValues = {
        file:null,
        attachments:null
    }

   
    

     const formSubmission = async (values, { resetForm }) => {
        console.log('inside form Submission', values);
      
            let formData = new FormData();
        formData.append('file',values.attachments);

        console.log('modified formData',formData);
        await axios.post(UpsertUrl, formData)
    
            .then((res) => {
                console.log('task form Submission  response', res);
              
             
            })
            .catch((error) => {
                console.log('task form Submission  error', error);
               
            })

         }
      
       

    
    return (
        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <h3>Data Loader</h3>                 
            </div>


            <Formik
                initialValues={initialValues}
               
                onSubmit={(values, { resetForm }) => formSubmission(values, { resetForm })}
            >
                {(props) => {
                    const {
                        values,
                        dirty,
                        isSubmitting,
                        handleChange,
                        handleSubmit,
                        handleReset,
                        setFieldValue,
                    } = props;

                    return (
                        <>
                           

                            <Form>
                                <Grid container spacing={2}>
                                    
                                       
                                    <Grid item xs={12} md={12}>

                                        <label htmlFor="file">file</label>
                                        
                                        <Field name="file" type="file"
                                        className="form-input"
                                        onChange={(event)=>{
                                            // console.log(event.target.files[0]);
                                            setFieldValue("attachments", (event.target.files[0]));
                                        }} 
                                        />
                                     
                                    </Grid>
                                    
                                 
                                </Grid>

                                <div className='action-buttons'>
                                    <DialogActions sx={{ justifyContent: "space-between" }}>

                                   
                                                <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Save</Button>
                                                 
                                                                            
                                        

                                    </DialogActions>
                                </div>
                            </Form>
                        </>
                    )
                }}
            </Formik>


        </Grid>
    )

     
    
}
export default DataLoadPage


// import React, { useEffect, useState, useRef } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { useLocation, useNavigate } from 'react-router-dom';
// import {
//     Grid, Button, FormControl, Stack, Alert, DialogActions,
//     Autocomplete, TextField
// } from "@mui/material";
// import axios from 'axios'
// import "../formik/FormStyles.css"
// import Papa from 'papaparse';



// const UpsertUrl = "http://localhost:4000/api/dataloaderlead";

// const allowedExtensions =['csv'];

// const DataLoadPage = () => {

//     const [data,setData] = useState([]);
//     const [error,setError] = useState('');
//     const [file,setFile] =useState();

//     const fileReader = new FileReader();




//     useEffect(() => {
     
       
//     }, [])

    
//     const initialValues = {
//         csvFile:null,
//         attachement:'',
//     }


   
//     const validationSchema = Yup.object({
       

//     })

//      const formSubmission = async (values, { resetForm }) => {
//         console.log('inside form Submission', values);
       

//         // await axios.post(UpsertUrl, values)
    
//         //     .then((res) => {
//         //         console.log('task form Submission  response', res);
              
              
//         //     })
//         //     .catch((error) => {
//         //         console.log('task form Submission  error', error);
               
//         //     })
//     }


//     return (
//         <Grid item xs={12} style={{ margin: "20px" }}>
//             <div style={{ textAlign: "center", marginBottom: "10px" }}>
//                 <h3>Upload Files</h3>                 
//             </div>

//             <Formik
//                 enableReinitialize={true}
//                 initialValues={initialValues}
//                 validationSchema={validationSchema}
//                 onSubmit={(values, { resetForm }) => formSubmission(values, { resetForm })}
//             >
//                 {(props) => {
//                     const {
//                         values,
//                         dirty,
//                         isSubmitting,
//                         handleChange,
//                         handleSubmit,
//                         handleReset,
//                         setFieldValue,
//                     } = props;

//                     return (
//                         <>
                            

//                             <Form>
//                                 <Grid container spacing={2}>
                                    
//                                     <Grid item xs={12} md={12}>

//                                         <label htmlFor="csvFile">File </label>
                                        
//                                         <Field name="csvFile" type="file"
//                                         className="form-input"
//                                         onChange={(event)=>{
//                                             setFieldValue("attachement", (event.currentTarget.files[0]));
//                                         }} 
//                                         />
//                                         <div style={{ color: 'red' }}>
//                                             <ErrorMessage name="csvFile" />
//                                         </div>
//                                     </Grid>
                                   
//                                 </Grid>

//                                 <div className='action-buttons'>
//                                     <DialogActions sx={{ justifyContent: "space-between" }}>
                                 
//                                         <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Save</Button>
                                                                                      
//                                         <Button type="reset" variant="contained" onClick={handleReset} disabled={!dirty || isSubmitting}  >Cancel</Button>

//                                     </DialogActions>
//                                 </div>
//                             </Form>
//                         </>
//                     )
//                 }}
//             </Formik>


//         </Grid>
//     )

// }
// export default DataLoadPage


// const [file, setFile] = useState();
//     const [array, setArray] = useState([]);
  
//     const fileReader = new FileReader();
  
//     const handleOnChange = (e) => {
//       setFile(e.target.files[0]);
//     };
  
//     const csvFileToArray = string => {
//       const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
//       const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");
  
//       const array = csvRows.map(i => {
//         const values = i.split(",");
//         const obj = csvHeader.reduce((object, header, index) => {
//           object[header] = values[index];
//           return object;
//         }, {});
//         return obj;
//       });
  
//       setArray(array);
//     };
  
//     const handleOnSubmit = (e) => {
//       e.preventDefault();
  
//       if (file) {
//         fileReader.onload = function (event) {
//           const text = event.target.result;
//           csvFileToArray(text);
//         };
  
//         fileReader.readAsText(file);
//       }
//     };
  
//     const headerKeys = Object.keys(Object.assign({}, ...array));
  
//     return (
//       <div style={{ textAlign: "center" }}>
//         <h1>REACTJS CSV IMPORT EXAMPLE </h1>
//         <form>
//           <input
//             type={"file"}
//             id={"csvFileInput"}
//             accept={".csv"}
//             onChange={handleOnChange}
//           />
  
//           <button
//             onClick={(e) => {
//               handleOnSubmit(e);
//             }}
//           >
//             IMPORT CSV
//           </button>
//         </form>
  
//         <br />
  
//         <table>
//           <thead>
//             <tr key={"header"}>
//               {headerKeys.map((key) => (
//                 <th>{key}</th>
//               ))}
//             </tr>
//           </thead>
  
//           <tbody>
//             {array.map((item) => (
//               <tr key={item.id}>
//                 {Object.values(item).map((val) => (
//                   <td>{val}</td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     )

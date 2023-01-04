import React, { useState } from "react";
 
const EventForm = () => {
 const [showForm, setshowform] = useState(true);
 const [showNew, setshowNew] = useState(true);
 const [showDelete, setshowDelete] = useState(true);
 const [toggleSubmit, settoggleSubmit] = useState(true);
 const [isEditItem, setisEditItem] = useState(null);
 const [showList, setshowList] = useState(true);
 const [editMessage, seteditMessage] = useState(false);
 const [deleteMessage, setdeleteMessage] = useState(false);
 const [deleteMessagesuccess, setdeleteMessagesuccess] = useState(false);
 const [inputTitle, setinputTitle] = useState("");
 const [inputDesc, setinputDesc] = useState("");
 const [items, setitems] = useState([
   {
     id: "001",
     name: "Default Task",
     desc: "Default Description",
     status: false,
   },
 ]);
 
 //   HANDLING INPUT FIELDS
 const handleInput = (e) => {
   setinputTitle(e.target.value);
 };
 const handleInputdesc = (e) => {
   setinputDesc(e.target.value);
 };
 //   HANDLING INPUT FIELDS
 
 //   SUBMITTING FORM
 const handleSubmit = (e) => {
   setshowList(true);
   setshowNew(true);
 
   e.preventDefault();
   if (!inputTitle || !inputDesc) {
     alert("fill data");
     showList(false);
   } else if (inputTitle && !toggleSubmit) {
     setitems(
       items.map((elem) => {
         if (elem.id === isEditItem) {
           return { ...elem, name: inputTitle, desc: inputDesc };
         }
         return elem;
       })
     );
 
     setinputTitle("");
     setinputDesc("");
     settoggleSubmit(true);
     setshowform(false);
     setshowDelete(true);
   } else {
     const allinputTitle = {
       id: new Date().getTime().toString(),
       name: inputTitle,
       desc: inputDesc,
     };
     setitems([allinputTitle, ...items]);
     setinputTitle("");
     setinputDesc("");
     setshowform(false);
   }
 };
 //   SUBMITTING FORM
 
 //   DELETE
 const handleDelete = (index) => {
   console.log(index);
   const updatedItems = items.filter((elem) => {
     return index !== elem.id;
   });
   setdeleteMessage(true);
 
   setTimeout(() => {
     setitems(updatedItems);
     setdeleteMessage(false);
   }, 2000);
   setdeleteMessagesuccess(false);
 };
 //   DELETE
 
 //   EDIT
 const handleEdit = (id) => {
   setshowList(false);
   setshowDelete(false);
   setshowNew(false);
   setshowform(true);
 
   settoggleSubmit(false);
   let newEditItem = items.find((elem) => {
     return elem.id === id;
   });
   setinputTitle(newEditItem.name);
   setinputDesc(newEditItem.desc);
   // setshowDelete(true)
 
   setisEditItem(id);
   console.log(newEditItem);
 };
 //   EDIT
 
 // ADD NEW TASK
 const handleAdd = () => {
   //   alert("hello")
   setshowform(true);
   setshowList(false);
   setshowNew(false);
 };
 // ADD NEW TASK
 return (
   <>
     {showNew ? (
       <div className="container">
         <div className="col-12 text-end">
           <button className="btn btn-primary " onClick={handleAdd}>
             New
           </button>
         </div>
       </div>
     ) : (
       ""
     )}
 
     {showForm ? (
       <>
         <div className="container border rounded d-flex justify-content-center shadow p-3 mb-5 bg-white rounded">
           <div className="row">
             <div className="text-center">
               <h2>{toggleSubmit ? "Add Task" : " Edit Task"}</h2>
             </div>
             <form className="col-12 p-2" onSubmit={handleSubmit}>
               <label htmlFor="title" className="my-2">
                 Enter Title
               </label>
               <input
                 type="text"
                 name="title"
                 id="title"
                 placeholder="title"
                 className="w-100 my-1 p-2"
                 onChange={handleInput}
                 value={inputTitle}
               />
               <label className="my-2" htmlFor="description">
                 Enter
               </label>
               <input
                 type="text"
                 name="description"
                 id="description"
                 placeholder="Description"
                 className="w-100 my-1 p-2"
                 onChange={handleInputdesc}
                 value={inputDesc}
               />
               {/* <div className="text-center"> */}
               {toggleSubmit ? (
                 <button className="btn btn-primary my-2">Save</button>
               ) : (
                 <button className="btn btn-primary my-2">Update</button>
               )}
               {/* </div> */}
             </form>
           </div>
         </div>
       </>
     ) : (
       ""
     )}
 
     {showList ? (
       <div className="container py-2 ">
         {deleteMessage ? (
           <p className="text-center text-danger">Item Deleted Successfully</p>
         ) : (
           ""
         )}
         {items.map((elem, index) => {
           return (
             <div
               className="row border rounded shadow p-3 mb-3 bg-white rounded  p-2"
               key={elem.id}
             >
               <div className="col-12 d-flex justify-content-between align-items-center">
                 <div>
                   <h4>{elem.name}</h4>
                   <p>{elem.desc}</p>
                 </div>
                   <button
                     className="btn btn-primary mx-2"
                     onClick={() => handleEdit(elem.id)}
                   >
                     Edit
                   </button>
                   {showDelete ? (
                     <button
                       className="btn btn-danger mx-2"
                       onClick={() => handleDelete(elem.id)}
                     >
                       Delete
                     </button>
                   ) : (
                     ""
                   )}
                 </div>
               </div>
            
           );
         })}
       </div>
     ) : (
       ""
     )}
   </>
 );
};
 
export default EventForm;



// import React ,{useState}from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { Grid,Button ,FormControl, Input} from "@mui/material";
// import axios from 'axios'
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { useNavigate } from "react-router-dom";
// import { useRef } from "react";
// import Thumb from "./Thumb";
// import SimpleSnackbar from "../toast/test";



// const validationSchema = Yup.object({
//     title:Yup
//             .string()
//             .required('Required'),

// })



// const EventForm =() =>{
//     const initialValues={
//         title:'',
//         dueDate:'',
//         time:'',
//         contact:'',
//         notes:'',
//         number:'',
//         assignTo:'',
//         senMeetingmainder:'',
//         test:'',
//         createdbyId: '',
//         createdDate: curr,
//     }

//     var curr = new Date();
//     console.log('curr',curr);

//     curr.setDate(curr.getDate() + 0);

//     var crrdate = curr.toISOString().substring(0,10);
// console.log('date',crrdate);
//     //   var x=crrdate.toString()
//       var xx = crrdate + ''
//       console.log('s',xx);

//     return (
//     <>

// <div className="container mb-10">
//             <div className="col-lg-12 text-center mb-3">
//                 <h3>New Contact</h3>
//             </div>
//             <div class="container overflow-hidden ">
//                 <Formik
//                     initialValues={initialValues}
//                     validationSchema={validationSchema}
//                     onSubmit={(values, { resetForm }) => {
                       
//                         console.log(values);

//                       }}
//                      >

// {/* {({ setFieldValue, handleSubmit }) => ( */}
//                 {
//                 (props) => {
//                             const {
//                                 values,
//                                 dirty,
//                                 isSubmitting,
//                                 handleChange,
//                                 handleSubmit,
//                                 handleReset,
//                                 setFieldValue,
//                             } = props;
//     return(
//         <>       
//          <form onSubmit={handleSubmit}>

//             <FormControl>
//              <Grid container spacing={2}>
            
//             <Grid item xs={6} md={6}>
//             <label htmlFor="dueDate">Date</label>
//             <Field name='dueDate' type="date" id="dueDate"  class="form-control" />
//             </Grid>
//             <Grid item xs={6} md={6}>
//                 <label htmlFor="createdDate">createdDate <span className="text-danger">*</span></label>
//                 <Field name="createdDate" type="date" class="form-control" value={crrdate} />
//             </Grid>
//             <Grid item xs={6} md={6}>
//             <label htmlFor="title">Title  </label>
//             <Field name="title" as="select" class="form-control">
//                 <option value="">--Select--</option>
//                 <option value="Plan a task">Plan a task</option>
//                 <option value="Send an email">Send an email</option>
//                 <option value="Call">Call</option>
//                 <option value="Meeting">Meeting</option>
//             </Field>
//             </Grid>
//             <Grid item xs={6} md={6}>
//                  <label htmlFor="time" >Time<span className="text-danger">*</span> </label>
//             <Field name='time' type="time" class="form-control" />
//             </Grid>
//             <Grid item xs={6} md={6}>
//                  <label htmlFor="test" >checkbox</label>
//             <Field name='test' type="checkbox"  class="form-check-input"/>
//             </Grid>
//             <Grid item xs={6} md={6}>
//                 <label htmlFor="contact">Contact</label>
//                 <Field name="contact" type="text" class="form-control" />
//             </Grid>
//             <Grid item xs={6} md={6}>
//                 <label htmlFor="notes">Notes</label>
//                 <Field name="notes" as="textarea" class="form-control" />
//             </Grid>
//             <Grid item xs={6} md={6}>
//                 <label htmlFor="assignTaskTo">Assign Task To</label>
//                 <Field name="assignTaskTo" type="text" class="form-control" />
//             </Grid>
//             <Grid item xs={6} md={6}>
//                 <label htmlFor="email">Email <span className="text-danger">*</span></label>
//                 <Field name="email" type="text" class="form-control" />
//             </Grid>
           
            
//             <Grid item xs={6} md={12} >
//                 <Button type='success' variant="contained" color="secondary">Save</Button>
//                 <Button type="reset" variant="contained" >Cancel</Button>
//             </Grid>
//     </Grid>
// </FormControl>
// </form>
//         </>
//     )
//                 }}
//      </Formik>
//   </div>
//         </div>

//     </>
//   )
// }

// export default EventForm
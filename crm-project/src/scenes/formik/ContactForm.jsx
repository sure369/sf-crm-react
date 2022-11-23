import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid,Button ,FormControl} from "@mui/material";

const initialValues={
                        accountName:'',
                        salutation:'',
                        firstName:'',
                        lastName:'',
                        dop:'',
                        phone:'',
                        department:'',
                        leadSource:'',
                        email:'',
                        mailingAddress:'',
                        description:'',
}

const validationSchema = Yup.object({
    lastName:Yup
            .string()
            .required('Required'),
    email: Yup
            .string()
            .email('Invalid email address')
            .required('Required'),
})

const onSubmit= (values,{resetForm}) => {
    console.log(values);
    resetForm({values:''})
}

const ContactForm = () => {
    return (
        <div className="container mb-10">
            <div className="col-lg-12 text-center mb-3">
                <h3>New Contact</h3>
            </div>
            <div class="container overflow-hidden ">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    <Form >
                        <FormControl>
                            <Grid container spacing={2}>
                                <Grid item xs={6} md={6}>
                                    <h6><label htmlFor="name">Name <span className="text-danger">*</span></label></h6>
                                    <label htmlFor="salutation">Salutation  </label>
                                    <Field name="salutation" as="select" class="form-control">
                                        <option value="">--Select--</option>
                                        <option value="Mr.">Mr.</option>
                                        <option value="Ms.">Ms.</option>
                                        <option value="Mrs.">Mrs.</option>
                                        <option value="Dr.">Dr.</option>
                                        <option value="Prof.">Prof.</option>
                                    </Field>
                                    <label htmlFor="firstName" >First Name</label>
                                    <Field name='firstName' type="text" class="form-control" />
                                    <label htmlFor="lastName" >Last Name<span className="text-danger">*</span> </label>
                                    <Field name='lastName' type="text" class="form-control" />
                                    <div style={{ color: 'red' }}>
                                        <ErrorMessage name="lastName" />
                                    </div>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="accountName">Account Name </label>
                                    <Field name="accountName" type="text" class="form-control" />
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="phone">Phone</label>
                                    <Field name="phone" type="phone" class="form-control" />
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="department">Department</label>
                                    <Field name="department" type="text" class="form-control" />
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="email">Email <span className="text-danger">*</span></label>
                                    <Field name="email" type="text" class="form-control" />
                                    <div style={{ color: 'red' }}>
                                        <ErrorMessage name="email" />
                                    </div>
                                </Grid>
                                <Grid item xs={6} md={6}>
                                    <label htmlFor="leadSource"> lead Source</label>
                                    <Field name="leadSource" as="select" class="form-select">
                                        <option value="">--Select--</option>
                                        <option value="web">Web</option>
                                        <option value="phone Inquiry">phone Inquiry</option>
                                        <option value="Partner Referral">Partner Referral</option>
                                        <option value="Purchased List">Purchased List</option>
                                        <option value="other">Other</option>
                                    </Field>
                                </Grid>
                                <Grid Grid item xs={6} md={12}>
                                    <label htmlFor="description">Description</label>
                                    <Field as="textarea" name="description" class="form-control" />
                                </Grid>
                                <Grid item xs={6} md={12} >
                                    <Button type='success' variant="contained" color="secondary">Submit</Button>
                                    <Button type="reset" variant="contained" >Clear</Button>
                                </Grid>
                            </Grid>
                        </FormControl>
                    </Form>
                </Formik>
            </div>
        </div>
    );
  }
export default ContactForm

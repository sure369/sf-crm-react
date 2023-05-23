import React, { useState } from 'react'
import axios from 'axios';
import {
  Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, DialogActions, Button
} from "@mui/material";
import ToastNotification from '../toast/ToastNotification';
import { useEffect } from 'react';
import { POST_DATALOADER_ACCOUNT,POST_DATALOADER_DEAL,POST_DATALOADER_ENQUIRY } from '../api/endUrls';
import { RequestServerFiles } from '../api/HttpReqFiles';
import { apiMethods } from '../api/methods';

const URL_postBulkAccount=POST_DATALOADER_ACCOUNT
const URL_postBulkDeal =POST_DATALOADER_DEAL
const URL_postBulkEnquiry =POST_DATALOADER_ENQUIRY

function PreviewUpsert({ data, file, ModalClose, object }) {

  console.log(object, "object")
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

  const [upsertUrl, setUpsertUrl] = useState()

  const headers = Object.keys(data[0]).slice(0, 8);

  useEffect(() => {
    if (object) {
      if (object === 'Account') {
        setUpsertUrl(URL_postBulkAccount)
      }
      else if (object === 'Lead') {
        setUpsertUrl(URL_postBulkDeal)
      }
      else if (object === 'Opportunity') {
        setUpsertUrl(URL_postBulkEnquiry)
      }
    }
    else {     
      if (window.location.href.includes('opportunity')) {
        setUpsertUrl(URL_postBulkEnquiry)
      }
      else if (window.location.href.includes('account')) {
        setUpsertUrl(URL_postBulkAccount)
      }
      else if (window.location.href.includes('lead')) {
        setUpsertUrl(URL_postBulkDeal)
      }
    }

  }, [])
  const handleModal = () => {

  }
  const hanldeSave = () => {

    let formData = new FormData();
    formData.append('file', file)
    formData.append('createdBy',JSON.parse(sessionStorage.getItem("loggedInUser")))
    formData.append('modifiedBy',JSON.parse(sessionStorage.getItem("loggedInUser")))
    RequestServerFiles(apiMethods.post, upsertUrl, formData)

      .then((res) => {
        console.log('data import res', res);
        setNotify({
          isOpen: true,
          message: 'Records Inserted Successfully',
          type: 'success'
        })
        setTimeout(() => {
          window.location.reload();
          // handleModal()    
        }, 2000)

      })
      .catch((error) => {
        console.log('data import error', error);
        setNotify({
          isOpen: true,
          message: 'Records not Inserted ',
          type: 'error'
        })
        setTimeout(() => {
          window.location.reload();
        }, 2000)
      })
  }

  return (
    <>
      <ToastNotification notify={notify} setNotify={setNotify} />
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map(header => (
                <TableCell align="right">{header.toUpperCase()}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(0, 5).map((emp, index) => (
              <TableRow key={index}>
                {headers.map(header => (
                  <TableCell align="right">{emp[header]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <div className='action-buttons'>
        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button type='success' variant="contained" color="secondary" onClick={hanldeSave}>Upload</Button>
          <Button type="reset" variant="contained" onClick={ModalClose}>Cancel</Button>
        </DialogActions>
      </div>
    </>
  );
}



export default PreviewUpsert


import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import axios from 'axios';


function Preview() {

  const [fileData, setFileData] = useState(null);
  const urlimage = `${process.env.REACT_APP_SERVER_URL}/images`
  const [img, setImg] = useState()
  useEffect(() => {
    fetchRecords()
    console.log('inside prview component')


  })

  const fetchRecords = () => {
    axios.post(urlimage)
      .then(
        (res) => {
          console.log("fetch res data", res);
          setImg(res.data)

        }
      )
      .catch((error) => {
        console.log('res error', error);
      })
  }

  return (
    <div>
      <iframe src={`https://view.officeapps.live.com/op/embed.aspx?src=${img}&embedded=true`} width='100%' height='800px' frameborder='0'></iframe>
      <iframe src='https://view.officeapps.live.com/op/embed.aspx?src=http%3A%2F%2Fieee802%2Eorg%3A80%2Fsecmail%2FdocIZSEwEqHFr%2Edoc' width='80%' height='800px' frameborder='0'>This is an embedded <a target='_blank' href='http://office.com'>Microsoft Office</a> document, powered by <a target='_blank' href='http://office.com/webapps'>Office Online</a>.</iframe>
    </div>
  )
}

export default Preview



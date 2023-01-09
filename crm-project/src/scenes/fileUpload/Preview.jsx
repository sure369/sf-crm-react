import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'



function Preview() {

    const[fileData,setFileData]=useState(null);

useEffect(()=>{
    
    console.log('inside prview component')

    fetch(`http://localhost:4000/api/preview-file/63b5227da1adc611b6bf0141`)
    .then(response => response.arrayBuffer())
    .then(buffer => {
      // Convert the file buffer to a data URL
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setFileData( fileReader.result);
      };
      fileReader.readAsDataURL(new Blob([buffer]));
    });
})

  return (
    <div>
        
        {
fileData ? (<iframe src={fileData} />) : (<p>file loading...</p>)
        }
    </div>
  )
}

export default Preview



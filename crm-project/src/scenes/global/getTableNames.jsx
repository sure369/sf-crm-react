import React, { useEffect, useState } from 'react';
import { RequestServer } from '../api/HttpReq';



export const GetTableNames = () => {    
//  const getTableUrl = `/getObject`;

const getObjectTabs =`/getTabs`

const userDetails = JSON.parse(sessionStorage.getItem("loggedInUser"))
const userRoleDpt ={
                     loginUserRole:JSON.parse(userDetails.userRole).roleName,
                     loginUserDepartmentName:userDetails.userDepartment,
                   }


 return new Promise((resolve,reject)=>{
  RequestServer(getObjectTabs,userRoleDpt)
  .then(res=>{
    console.log(res,"getObjectTabs ")
    if(res.success){
      console.log(res.data,"res data getObjectTabs")
      resolve(res.data)
    }
    else{
      console.log(res.data,"error res data getObjectTabs")
      reject(res.error)
    }
  })
  .catch(err=>{
    console.log(err,"catch error getObjectTabs")
    reject(err)
  })
 })

};

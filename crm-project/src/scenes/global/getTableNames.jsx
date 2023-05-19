import React, { useEffect, useState } from 'react';
import { RequestServer } from '../api/HttpReq';
import { apiMethods } from '../api/methods';
import queryString from 'query-string';

export const GetTableNames = () => {
  //  const getTableUrl = `/getObject`;

  const getObjectTabsURL = `/tabs`

  // http://localhost:8080/api/tabs?department=Admin&role=VP  ---- get

  const userDetails = JSON.parse(sessionStorage.getItem("loggedInUser"))
  const userRoleDpt = {
    role: userDetails.userRole.roleName,
    department: userDetails.userDepartment,
  }

  let url = getObjectTabsURL + '?' + queryString.stringify(userRoleDpt)
console.log(url,"url")
  return new Promise((resolve, reject) => {
    RequestServer(apiMethods.get, url)
      .then(res => {
        console.log(res, "getObjectTabs ")
        if (res.success) {
          console.log(res.data, "res data getObjectTabs")
          resolve(res.data)
        }
        else {
          console.log(res.data, "error res data getObjectTabs")
          reject(res.error)
        }
      })
      .catch(err => {
        console.log(err, "catch error getObjectTabs")
        reject(err)
      })
  })

};

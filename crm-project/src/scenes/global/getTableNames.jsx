import React, { useEffect, useState } from 'react';
import { RequestServer } from '../api/HttpReq';
import { apiMethods } from '../api/methods';
import queryString from 'query-string';
import { GET_TABS_Name } from '../api/endUrls';

export const GetTableNames = () => {

  const URL_getTabs = GET_TABS_Name
  const userDetails = JSON.parse(sessionStorage.getItem("loggedInUser"))
  const userRoleDpt = {
    role: userDetails.userRole.roleName,
    department: userDetails.userDepartment,
  }

  let URL_GetTabsByUser = URL_getTabs + '?' + queryString.stringify(userRoleDpt)
console.log(URL_GetTabsByUser,"URL_GetTabsByUser")
  return new Promise((resolve, reject) => {
    RequestServer(apiMethods.get, URL_GetTabsByUser)
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

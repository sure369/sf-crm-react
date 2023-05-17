export const getLoginUserRoleDept =(OBJECT_API)=>{


    const userDetails = JSON.parse(sessionStorage.getItem("loggedInUser"))
   const userRoleDpt ={
                        loginUserRole:userDetails.userRoleName,
                        loginUserDepartmentName:userDetails.userDepartment,
                        object:OBJECT_API,
                      }
              
    return userRoleDpt;
                      
}
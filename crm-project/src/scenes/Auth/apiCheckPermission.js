import { RequestServer } from "../api/HttpReq"
import { apiMethods } from "../api/methods"

export const apiCheckPermission= (obj)=>{

    const urlCheck=`/permissionforobject/${obj.object}/${obj.loginUserDepartmentName}/${obj.loginUserRole}`

    //   /api/permissionforobject/:object/:department/:role

    return new Promise((resolve,reject)=>{
        RequestServer(apiMethods.get,urlCheck)
        .then(res=>{
            console.log(res,"res checkPermission2")
            if(res.success){
                console.log(res.data,"res.data checkPermission2")
               resolve(res.data)
            }else{
               reject (new Error(res.error.message))
            }
        })
        .catch((err)=>{
            reject(err)
        })
    })
   
}
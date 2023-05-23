import { RequestServer } from "../api/HttpReq"
import { GET_OBJECT_PERMISSION } from "../api/endUrls"
import { apiMethods } from "../api/methods"


export const apiCheckObjectPermission= (obj)=>{
    
    const URL_get_Obj_Permission=`${GET_OBJECT_PERMISSION}/${obj.object}/${obj.loginUserDepartmentName}/${obj.loginUserRole}`

    return new Promise((resolve,reject)=>{
        RequestServer(apiMethods.get,URL_get_Obj_Permission)
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
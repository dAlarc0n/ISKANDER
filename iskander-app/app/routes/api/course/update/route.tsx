import axios from "~/services/axios.server";
import {currentToken} from "~/services/auth.server";

export let action = async ({request}:any)=>{
    let token = await currentToken({request});
    let response;
    if(!token) return null;
    const formData = await request.formData();
    const data = {
        name: formData.get("name") as string,
        beneficiary_id: formData.get("beneficiary_id") as string,
  };
     response = await   axios.post('/api/pathology/delete',data,{
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    return response.data;
};
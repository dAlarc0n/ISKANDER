import axios from "~/services/axios.server";
import {currentToken} from "~/services/auth.server";
import type { ActionFunctionArgs } from "@remix-run/node"

export let action = async ({request}:ActionFunctionArgs)=>{
    let token = await currentToken({request});
    let response;
    if(!token) return null;
    const formData = await request.formData();
    const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
  };
  try{
  response = await   axios.post('/api/user/create',data,{
      headers: {
        Authorization: "Bearer " + token,
      },
    })
  }catch(e:any){
    response = e.response
  }
   
    return response;
};
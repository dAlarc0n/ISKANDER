import axios from "~/services/axios.server";
import {currentToken} from "~/services/auth.server";
import type { ActionFunctionArgs } from "@remix-run/node"

export let action = async ({request}:ActionFunctionArgs)=>{
    let token = await currentToken({request});
    let response;
    if(!token) return null;
    const formData = await request.formData();
    const data = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        instructor: formData.get("instructor") as string,
        category: formData.get("category") as string,
        thumbnail: formData.get("thumbnail") as string,
  };
  try{
    response = await   axios.post('/api/course/create',data,{
      headers: {
        Authorization: "Bearer " + token,
      },
    })
  }catch(e:any){
    response = e.response 
  }
    return response;
};
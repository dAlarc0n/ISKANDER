import axios from "~/services/axios.server";
import {currentToken} from "~/services/auth.server";
import type { ActionFunctionArgs } from "@remix-run/node"

export let action = async ({request}:ActionFunctionArgs)=>{
    let token = await currentToken({request});
    let response;
    if(!token) return null;
    const formData = await request.formData();
    const id = formData.get("id") as string
    const data = {
        students: JSON.parse(formData.get("students")as string),
  };
  try{
    response = await   axios.post(`/api/course/enrollment/${id}`,data,{
      headers: {
        Authorization: "Bearer " + token,
      },
    })
  }catch(e:any){
    response = e.response 
  }
    return response;
};
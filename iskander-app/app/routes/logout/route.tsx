import { redirect } from "@remix-run/react";
import { logout } from "~/services/auth.server";

export let action = async ({request}:any)=>{
    return logout({request});
};
export let loader = async () => {
    return redirect("/")
}
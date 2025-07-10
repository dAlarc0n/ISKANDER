import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import { redirect } from "@remix-run/node";

let client = axios.create({
    baseURL: process.env.API_ROUTE + ":" + process.env.PORT,
    headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
    "Accept": "application/json"
},
});

client.interceptors.response.use(
(response) => response,
    (error) => {
    if (!error.response) {
        return Promise.reject(error);
    }
    if (error.response.status === 401) {
        throw redirect("/login");
    }

    return Promise.reject(error);
},
);
client.interceptors.request.use((config) => {
  const isFormData = config.data instanceof FormData;
  if (isFormData && config.headers) {
    delete config.headers["Content-Type"]; 
  }
  return config;
});
export default client;

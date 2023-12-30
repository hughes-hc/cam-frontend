import { CAM_TOKEN_KEY } from "@/common/constant";
import axios from "axios";

const request = axios.create()

request.interceptors.request.use(
  config => {
    config.headers['Authorization'] = localStorage.getItem(CAM_TOKEN_KEY)
    return config
  }
)

request.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    throw new Error(error.response.data.message)
  }
)

export default request
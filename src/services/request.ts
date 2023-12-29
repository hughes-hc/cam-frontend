import axios from "axios";

const request = axios.create()

request.interceptors.response.use(
  response => {
    return response.data
  }
)

export default request
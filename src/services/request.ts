import { CAM_TOKEN_KEY } from '@/common/constant'
import { notification } from 'antd'
import axios from 'axios'
import { history } from 'umi'

const request = axios.create()

request.interceptors.request.use(config => {
  config.headers['Authorization'] = localStorage.getItem(CAM_TOKEN_KEY)

  return config
})

request.interceptors.response.use(
  response => {
    return response.data
  },
  err => {
    const { message, error, statusCode } = err.response.data
    notification.error({ message: error })
    if (statusCode === 401) {
      history.push('/login')
    }
    throw new Error(message)
  }
)

export default request

import { CAM_TOKEN_KEY } from '@/common/constant'
import { notification } from 'antd'
import axios, { AxiosResponse } from 'axios'
import { history } from 'umi'
import FileDownload from 'js-file-download'
import UrlPattern from 'url-pattern'

const getFileInfo = (response: AxiosResponse) => {
  const contentType = response.headers['content-type'] as string
  const contentDisposition = response.headers['content-disposition'] as string
  // 将Content-Disposition头字段中的文件名提取出来
  const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
  const matches = fileNameRegex.exec(contentDisposition)
  const fileName = matches != null && matches[1] ? matches[1].replace(/['"]/g, '') : 'unknown'
  const isFile = contentType?.startsWith('application') || contentType?.startsWith('octet-stream')

  return { isFile, fileName }
}

const handleError = (errorData: any) => {
  const { message = '接口出错，请联系管理员', error, statusCode } = errorData
  notification.error({ message })
  if (statusCode === 401) {
    history.push('/login')
  }
}

const request = axios.create()

request.interceptors.request.use(config => {
  config.headers['Authorization'] = localStorage.getItem(CAM_TOKEN_KEY)

  // 创建一个UrlPattern对象
  const pattern = new UrlPattern(config.url as string)

  // 根据config.params替换URL中的动态参数并重新赋值给config.url
  config.url = pattern.stringify(
    ['GET', 'DELETE'].includes(config.method?.toUpperCase() as string) ? config.params : config.data
  )

  // 移除已经被替换掉的参数
  const usedParams = pattern.match(config.url)
  for (let usedParam in usedParams) {
    delete config.params?.[usedParam]
    delete config.data?.[usedParam]
  }

  return config
})

request.interceptors.response.use(
  response => {
    // const { isFile, fileName } = getFileInfo(response)
    // if (isFile && fileName !== 'unknown') {
    //   return FileDownload(response.data, decodeURIComponent(fileName))
    // }

    return response.data
  },
  err => {
    // 某些接口返回的是二进制流，这里处理一下
    const isBlobJson =
      err.response.data instanceof Blob && err.response.data.type.toLowerCase().includes('json')

    if (isBlobJson) {
      const reader = new FileReader()
      reader.readAsText(err.response.data, 'utf-8')
      reader.onload = function (evt) {
        const errorData = JSON.parse(evt.target?.result as string)
        handleError(errorData)
      }
    } else {
      handleError(err.response.data)
    }
  }
)

export default request

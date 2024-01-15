/// <reference path="index.d.ts" />
import request from '../request'

export const archiveUpload = (params: FormData, callback?: Function) => {
  return request.post<FormData, string>('/api/v1/archive/upload', params, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: function (progressEvent) {
      // 计算上传进度百分比
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / (progressEvent.total as number)
      )
      callback?.(percentCompleted)
    }
  })
}

export const downloadFile = (params: IDownloadParams, callback?: Function) => {
  return request.post<IDownloadParams, File>('/api/v1/file/download', params, {
    responseType: 'blob',
    onDownloadProgress: progressEvent => {
      const percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total)
      callback?.(params, percentCompleted, Boolean(percentCompleted < 100))
    }
  })
}

export const downloadSealFile = (params: IDownloadParams, callback?: Function) => {
  return request.post<IDownloadParams, File>('/api/v1/file/download/seal', params, {
    responseType: 'blob',
    onDownloadProgress: progressEvent => {
      const percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total)
      callback?.(params, percentCompleted, Boolean(percentCompleted < 100))
    }
  })
}

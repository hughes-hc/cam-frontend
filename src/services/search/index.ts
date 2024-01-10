/// <reference path="index.d.ts" />
import request from '../request'

export const getFileList = (params: IQuery) => {
  return request.get<IQuery, ITable<IFileItem>>('/api/v1/file/list', { params })
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

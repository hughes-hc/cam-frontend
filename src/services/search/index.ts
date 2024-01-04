/// <reference path="index.d.ts" />
import request from '../request'

export const getFileList = (params: IQuery) => {
  return request.get<IQuery, ITable<IFileItem>>('/api/v1/file/list', { params })
}

export const downloadFile = (params: IDownloadParams) => {
  return request.post<IDownloadParams, File>('/api/v1/file/download', params, {
    responseType: 'blob'
  })
}

export const downloadSealFile = (params: IDownloadParams) => {
  return request.post<IDownloadParams, File>('/api/v1/file/download/seal', params, {
    responseType: 'blob'
  })
}

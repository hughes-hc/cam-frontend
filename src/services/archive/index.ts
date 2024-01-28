/// <reference path="index.d.ts" />
import request from '../request'

export const archiveUpload = (params: FormData, callback?: Function) => {
  return request.post<FormData, string>('/api/v1/archives/upload', params, {
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

export const getArchivesList = (params: IArchivesReq) =>
  request.get<IArchivesReq, IArchive[]>('/api/v1/archives/:companyId', { params })

export const getArchiveFile = (params: IParam, callback?: Function) =>
  request.post<IParam, Blob>('/api/v1/archives/download', params, {
    responseType: 'blob',
    onDownloadProgress: progressEvent => {
      const percentCompleted = Math.floor(
        (progressEvent.loaded * 100) / (progressEvent.total as number)
      )
      callback?.(params, percentCompleted, Boolean(percentCompleted < 100))
    }
  })

export const downloadFile = (params: IDownloadParams, callback?: Function) => {
  return request.post<IDownloadParams, File>('/api/v1/file/download', params, {
    responseType: 'blob',
    onDownloadProgress: progressEvent => {
      const percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total)
      callback?.(params, percentCompleted, Boolean(percentCompleted < 100))
    }
  })
}

export const deleteArchive = (params: IParam) => request.delete('/api/v1/archives/:id', { params })

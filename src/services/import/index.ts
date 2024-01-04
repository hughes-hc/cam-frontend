import request from '../request'

export const upload = (params: FormData, callback?: Function) => {
  return request.post<FormData, string>('/api/v1/file/upload', params, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: function (progressEvent) {
      // 计算上传进度百分比
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      callback?.(percentCompleted)
    }
  })
}

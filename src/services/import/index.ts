import request from '../request'

export const upload = (params: FormData) => {
  return request.post<FormData, string>('/api/v1/file/upload', params, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

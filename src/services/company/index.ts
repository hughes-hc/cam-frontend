/// <reference path="index.d.ts" />
import request from '../request'

export const getCompanies = (params: IQuery) =>
  request.get<IQuery, ITable<ICompanyItem>>('/api/v1/companies', { params })

export const getCompany = (params: IParam) =>
  request.get<IParam, ICompanyItem>('/api/v1/companies/:id', { params })

export const addCompany = (params: ICompanyForm) =>
  request.post<ICompanyForm, ICompanyItem>('/api/v1/companies', params)

export const updateCompany = (params: ICompanyForm) =>
  request.put<ICompanyForm, ICompanyItem>('/api/v1/companies/:id', params)

export const deleteCompany = (params: IParam) => request.delete('/api/v1/companies/:id', { params })

export const getTemplate = () =>
  request.get<any, Blob>('/api/v1/companies/template', {
    responseType: 'blob'
  })

export const companyBatchImport = (params: FormData, callback?: Function) => {
  return request.post<FormData, string>('/api/v1/companies/import', params, {
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

/// <reference path="index.d.ts" />
import request from '../request'

export const getCompanies = (params: IQuery) =>
  request.get<IQuery, ITable<ICompanyItem>>('/api/v1/companies', { params })

export const getCompany = (params: IParam) =>
  request.get<IParam, ICompanyItem>('/api/v1/companies/:id', { params })

export const addCompany = (params: ICompanyForm) => request.post('/api/v1/companies', params)

export const updateCompany = (params: ICompanyForm) => request.put('/api/v1/companies/:id', params)

export const deleteCompany = (params: IParam) => request.delete('/api/v1/companies/:id', { params })

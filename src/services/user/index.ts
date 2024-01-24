/// <reference path="index.d.ts" />
import request from '../request'

export const getUsers = (params: IQuery) =>
  request.get<IQuery, ITable<IUser>>('/api/v1/users', { params })

export const addUser = (params: IUserForm) =>
  request.post<IUserForm, IUser>('/api/v1/users', params)

export const updateUser = (params: IUserForm) =>
  request.put<IUserForm, IUser>('/api/v1/users/:id', params)

// 修改密码
export const updateUserPassword = (params: IUserForm) =>
  request.put<IUserForm, IUser>('/api/v1/users/password', params)

export const deleteUser = (params: IParam) => request.delete('/api/v1/users/:id', { params })

/// <reference path="index.d.ts" />
import request from '../request'

export const getCaptcha = () => {
  return request.get<undefined, ICaptcha>('/api/v1/auth/captcha')
}

export const login = (params: ILoginParam) => {
  return request.post<ILoginParam, IUerInfo>('/api/v1/auth/login', params)
}

export const getUserInfo = () => request.get<undefined, IUser>('/api/v1/user')

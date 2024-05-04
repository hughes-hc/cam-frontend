/// <reference path="index.d.ts" />
import request from '../request'

export const getCaptcha = () => {
  return request.get<undefined, ICaptcha>('/api/v1/auth/captcha')
}

export const login = (params: ILoginParam) => {
  return request.post<ILoginParam, ILoginRes>('/api/v1/auth/login', params)
}

export const logout = () => request.post('/api/v1/auth/logout')

export const getUserInfo = () => request.get<undefined, IUserInfo>('/api/v1/user')

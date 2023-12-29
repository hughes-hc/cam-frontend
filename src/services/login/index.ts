/// <reference path="index.d.ts" />

import request  from "../request";

export const login = (params: ILoginParam) => {
  return request.post('/api/v1/auth/login', params)
}


/// <reference path="index.d.ts" />
import request from '../request'

export const getAuditList = (params: IQuery) => {
  return request.get<IQuery, ITable<IAuditItem>>('/api/v1/audit', { params })
}

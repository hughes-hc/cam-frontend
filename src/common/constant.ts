export const CAM_TOKEN_KEY = 'CAM_TOKEN_KEY'

export const ACCOUNT_STATUS_MAP = {
  active: '启用',
  inactive: '未激活',
  locked: '锁定',
  suspended: '暂停',
  disabled: '禁用'
}
export type AccountStatusType = keyof typeof ACCOUNT_STATUS_MAP

export const USER_ROLE_MAP = {
  admin: '管理员',
  internal: '内网用户',
  external: '外网用户'
}
export type UserRoleType = keyof typeof USER_ROLE_MAP

export const Audit_Action_Map = {
  login: '用户登录',
  logout: '用户退出登录',
  create: '新增',
  update: '更新',
  delete: '删除',
  import: '导入',
  upload: '导出',
  download: '下载'
}
export type AuditActionType = keyof typeof Audit_Action_Map

export const Audit_Resource_Map = {
  user: '用户信息',
  company: '企业信息',
  archive: '档案'
}
export type AuditResourceType = keyof typeof Audit_Resource_Map

export enum Archive_Type_Color_Map {
  设立 = '#3CB371',
  变更 = '#1E90FF',
  出质 = '#FFD700',
  注销 = '#FF6347',
  其它 = '#9370DB'
}
export type ArchiveTypeColorMapType = keyof typeof Archive_Type_Color_Map

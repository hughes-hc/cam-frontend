import { USER_ROLE_MAP, UserRoleType } from '@/common/constant'
import useAppStore from '@/store/appStore'

export const getUserAccess = (userInfo: IUserInfo) => {
  const role = userInfo.role as UserRoleType
  const isAdmin = USER_ROLE_MAP[role] === '管理员'
  const isInternal = USER_ROLE_MAP[role] === '内网用户'
  const isExternal = USER_ROLE_MAP[role] === '外网用户'

  const userAccess = {
    // 用户管理相关权限
    canViewAccountList: isAdmin,

    // 企业信息管理相关权限
    canViewCompanyList: isAdmin || isInternal,
    canViewCompanyDetail: isAdmin || isInternal,
    canAddCompany: isAdmin,
    canEditCompany: isAdmin,
    canDeleteCompany: isAdmin,

    // 档案管理相关权限
    canViewArchiveSearch: isAdmin || isInternal,
    canAddArchive: isAdmin,
    canDeleteArchive: isAdmin,

    // 审批管理相关权限
    canViewAuditList: isAdmin
  }

  return userAccess
}

export type IUserAccess = ReturnType<typeof getUserAccess>
export type IAccessKey = keyof IUserAccess

export default function useAccess() {
  const userAccess = useAppStore(state => state.userAccess)

  return userAccess
}

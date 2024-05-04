import { IUserAccess } from '@/hooks/useAccess'
import { create } from 'zustand'
interface IAppState {
  userInfo: IUserInfo
  userAccess: IUserAccess
  accessIsReady: boolean

  setUser: (userInfo: IUserInfo) => void
  setUserAccess: (userAccess: IUserAccess) => void
}

const useAppStore = create<IAppState>(set => ({
  userInfo: {} as IUserInfo, // 用户初始状态
  userAccess: {} as IUserAccess, // 用户权限
  accessIsReady: false, // 用户权限是否准备好

  setUser: userInfo => set(() => ({ userInfo })),
  setUserAccess: userAccess => set(() => ({ userAccess, accessIsReady: true }))
}))

export default useAppStore

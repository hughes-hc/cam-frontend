import { Navigate } from 'umi'

import useAppStore from '@/store/appStore'
import { Spin } from 'antd'
import routes, { IRoute } from 'config/routes'
import { isEmpty } from 'lodash'
import { IAccessKey } from '@/hooks/useAccess'

const findRouteAccessKey = (routes: IRoute[], pathname: string) => {
  let accessKey: IAccessKey[] = []

  const checkRoute = (route: IRoute) => {
    if (route.path === pathname && route.accessKey) {
      accessKey = route.accessKey // 直接匹配路径并取得accessKey
      return true
    }
    if (route.routes && route.routes.some(checkRoute)) {
      return true // 在子路由中递归查找
    }
    return false
  }

  routes.some(checkRoute) // 开始遍历顶级路由
  return accessKey
}

const withAuth = (Component: React.FC<any>) => (props: any) => {
  const accessKey = findRouteAccessKey(routes, location.pathname)
  const { userAccess, accessIsReady } = useAppStore(state => state)

  if (!accessIsReady) {
    return <Spin size="large" spinning={true} />
  }

  // 特殊路由处理
  if (
    location.pathname === '/archive/upload' &&
    !userAccess['canAddArchive'] &&
    userAccess['canViewArchiveSearch']
  ) {
    return <Navigate to="/archive/search" />
  }

  if (isEmpty(accessKey) || accessKey.some(item => userAccess[item])) {
    return <Component {...props} />
  } else {
    return <Navigate to="/403" />
  }
}

export default withAuth

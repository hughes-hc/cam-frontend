import { useLocation } from '@/.umi/exports'
import { CAM_TOKEN_KEY, USER_ROLE_MAP, UserRoleType } from '@/common/constant'
import { findNestedPath } from '@/common/utils'
import useAccess, { IUserAccess, getUserAccess } from '@/hooks/useAccess'
import { getUserInfo, logout } from '@/services/login'
import useAppStore from '@/store/appStore'
import { LoginOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import {
  Button,
  ConfigProvider,
  Flex,
  Layout,
  Menu,
  MenuProps,
  Popover,
  Space,
  Typography
} from 'antd'
import zhCN from 'antd/locale/zh_CN'
import routes, { IRoute } from 'config/routes'
import 'dayjs/locale/zh-cn'
import { chain, some } from 'lodash'
import { useEffect, useState } from 'react'
import { Icon, Link, Outlet, history } from 'umi'
import styles from './index.less'

const { Title } = Typography
const { Header, Content } = Layout

const filterRoutes = (routes: IRoute[], userAccess: IUserAccess): IRoute[] =>
  chain(routes)
    .map(route =>
      route.routes ? { ...route, routes: filterRoutes(route.routes, userAccess) } : route
    )
    .filter(
      route =>
        !route.noShowInMenu && (route.noAccess || some(route.accessKey, key => userAccess[key]))
    )
    .value()

const renderRoutes = (routes: IRoute[]): MenuProps['items'] =>
  chain(routes)
    .map(route => ({
      key: route.path,
      label: <Link to={route.path}>{route.title}</Link>,
      icon: <Icon icon={`local:menu/${route.icon}`} width="20px" height="20px" />,
      children: route.routes ? renderRoutes(route.routes) : null
    }))
    .value()

export default () => {
  const { pathname } = useLocation()
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const { accessIsReady, userAccess, setUserAccess } = useAppStore(state => state)
  const { canViewCompanyList } = useAccess()

  useEffect(() => {
    if (localStorage.getItem(CAM_TOKEN_KEY)) {
      runGetUserInfo()
    } else {
      history.push('/login')
    }
  }, [])

  useEffect(() => {
    const selectedKeys = findNestedPath(routes, pathname, 'path', 'routes')
    setSelectedKeys(selectedKeys)
  }, [pathname])

  const { data: userInfo, run: runGetUserInfo } = useRequest(getUserInfo, {
    manual: true,
    onSuccess(userInfo) {
      const userAccess = getUserAccess(userInfo)
      setUserAccess(userAccess)
    }
  })

  const { run: handleLogout } = useRequest(logout, {
    manual: true,
    onSuccess: () => {
      localStorage.removeItem(CAM_TOKEN_KEY)
      history.push('/login')
    }
  })

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        components: {
          Menu: {
            darkItemColor: '#fff',
            darkItemBg: '#2c7cf6',
            darkItemHoverColor: 'rgba(255,255,255,0.8)',
            darkSubMenuItemBg: '#fff',
            darkItemSelectedBg: '#4096ff',
            darkItemSelectedColor: '#fff'
          }
        }
      }}
    >
      <Layout className={styles.root}>
        <Header className={styles.header}>
          <Flex gap={40} className={styles.left}>
            <Link to={canViewCompanyList ? '/company' : '#'} className={styles.logo}>
              <Icon icon="local:common/logo" width="40px" height="40px" style={{ lineHeight: 1 }} />
              <Title>企业登记档案 · CAM</Title>
            </Link>
            <Menu
              theme="dark"
              mode="horizontal"
              items={accessIsReady ? renderRoutes(filterRoutes(routes, userAccess)) : []}
              selectedKeys={selectedKeys}
            />
          </Flex>

          <Popover
            overlayStyle={{ width: 200 }}
            getPopupContainer={node => {
              return node || document.body
            }}
            title={
              <Space>
                <span className={styles.userName}>{userInfo?.username}</span>
                <span className={styles.userRole}>
                  {USER_ROLE_MAP[userInfo?.role as UserRoleType]}
                </span>
              </Space>
            }
            content={
              <>
                <Button onClick={handleLogout} className={styles.logout}>
                  <LoginOutlined />
                  退出登录
                </Button>
              </>
            }
          >
            <Space size="small" style={{ cursor: 'pointer' }}>
              <Icon
                icon="local:common/user"
                width="20px"
                height="20px"
                style={{ display: 'flex' }}
              />
              {userInfo?.username}
            </Space>
          </Popover>
        </Header>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </ConfigProvider>
  )
}

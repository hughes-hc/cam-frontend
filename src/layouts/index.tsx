import { CAM_TOKEN_KEY } from '@/common/constant'
import { LogoutOutlined } from '@ant-design/icons'
import { ConfigProvider, Flex, Layout, Menu, MenuProps, Space, Tooltip, Typography } from 'antd'
import routes, { IRoute } from 'config/routes'
import { chain } from 'lodash'
import { useEffect } from 'react'
import { Icon, Link, Outlet, history, useLocation } from 'umi'
import styles from './index.less'
import zhCN from 'antd/locale/zh_CN'

const { Title } = Typography
const { Header, Content } = Layout

const filterRoutes = (routes: IRoute[]): IRoute[] =>
  chain(routes)
    .map(route => (route.routes ? { ...route, routes: filterRoutes(route.routes) } : route))
    .filter(route => !route.noShowInMenu)
    .value()

const renderRoutes = (routes: IRoute[]): MenuProps['items'] =>
  chain(routes)
    .map(route =>
      route.routes
        ? {
            key: route.path,
            label: route.title,
            icon: <Icon icon={`local:menu/${route.icon}`} width="20px" height="20px" />,
            children: renderRoutes(route.routes)
          }
        : {
            key: route.path,
            label: <Link to={route.path}>{route.title}</Link>,
            icon: <Icon icon={`local:menu/${route.icon}`} width="20px" height="20px" />
          }
    )
    .value()

export default () => {
  const { pathname } = useLocation()
  useEffect(() => {
    if (!localStorage.getItem(CAM_TOKEN_KEY)) {
      history.push('/login')
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem(CAM_TOKEN_KEY)
    history.push('/login')
  }

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        components: {
          Menu: {
            darkItemBg: '#2c7cf6',
            itemSelectedBg: '#e6f4ff'
          }
        }
      }}
    >
      {pathname !== '/login' ? (
        <Layout className={styles.root}>
          <Header className={styles.header}>
            <Flex gap={40} className={styles.left}>
              <Link to="/" className={styles.logo}>
                <Icon icon="local:common/logo" width="50px" height="50px" />
                <Title>企业档案管理系统</Title>
              </Link>
              <Menu theme="dark" mode="horizontal" items={renderRoutes(filterRoutes(routes))} />
            </Flex>

            <Space size="large">
              admin
              <Tooltip title="退出登录" placement="bottomLeft">
                <LogoutOutlined className={styles.logout} size={25} onClick={handleLogout} />
              </Tooltip>
            </Space>
          </Header>
          <Content className={styles.content}>
            <Outlet />
          </Content>
        </Layout>
      ) : (
        <Outlet />
      )}
    </ConfigProvider>
  )
}

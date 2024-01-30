import { CAM_TOKEN_KEY } from '@/common/constant'
import { LogoutOutlined } from '@ant-design/icons'
import { ConfigProvider, Flex, Layout, Menu, MenuProps, Space, Tooltip, Typography } from 'antd'
import routes, { IRoute } from 'config/routes'
import { chain } from 'lodash'
import { useEffect } from 'react'
import { Icon, Link, Outlet, history, useLocation } from 'umi'
import styles from './index.less'
import zhCN from 'antd/locale/zh_CN'
import { useRequest } from 'ahooks'
import { getUserInfo } from '@/services/login'

const { Title } = Typography
const { Header, Content } = Layout

const filterRoutes = (routes: IRoute[]): IRoute[] =>
  chain(routes)
    .map(route => (route.routes ? { ...route, routes: filterRoutes(route.routes) } : route))
    .filter(route => !route.noShowInMenu)
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
  useEffect(() => {
    if (!localStorage.getItem(CAM_TOKEN_KEY)) {
      history.push('/login')
    }
  }, [])

  const { data: userInfo } = useRequest(getUserInfo)

  const handleLogout = () => {
    localStorage.removeItem(CAM_TOKEN_KEY)
    history.push('/login')
  }
  console.log(renderRoutes(filterRoutes(routes)))

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
            <Link to="/company" className={styles.logo}>
              <Icon icon="local:common/logo" width="40px" height="40px" style={{ lineHeight: 1 }} />
              <Title>企业档案管理 · CAM</Title>
            </Link>
            <Menu theme="dark" mode="horizontal" items={renderRoutes(filterRoutes(routes))} />
          </Flex>

          <Space size="large">
            {userInfo?.username}
            <Tooltip title="退出登录" placement="bottomLeft">
              <LogoutOutlined className={styles.logout} size={25} onClick={handleLogout} />
            </Tooltip>
          </Space>
        </Header>
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </ConfigProvider>
  )
}

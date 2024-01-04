import { Icon, Link, Outlet, history, useLocation } from 'umi'
import { Layout, Space, Typography } from 'antd'
import styles from './index.less'
import { LogoutOutlined } from '@ant-design/icons'
import { useEffect } from 'react'
import { CAM_TOKEN_KEY } from '@/common/constant'

const { Title } = Typography
const { Header, Content } = Layout

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

  return pathname !== '/login' ? (
    <Layout className={styles.root}>
      <Header className={styles.header}>
        <Link to="/" className={styles.logo}>
          <Icon icon="local:logo" width="50px" height="50px" />
          <Title>企业档案管理系统</Title>
        </Link>
        <Space size="large">
          admin
          <LogoutOutlined className={styles.logout} size={25} onClick={handleLogout} />
        </Space>
      </Header>
      <Content className={styles.content}>
        <Outlet />
      </Content>
    </Layout>
  ) : (
    <Outlet />
  )
}

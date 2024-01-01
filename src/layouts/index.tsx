import { Link, Outlet, history, useLocation } from 'umi'
import { Layout, Typography } from 'antd'
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
  return (
    <Layout className={styles.root}>
      {pathname !== '/login' && (
        <Header className={styles.header}>
          <Link to="/">
            <Title className={styles.logo}>企业档案管理系统</Title>
          </Link>
          <LogoutOutlined className={styles.logout} size={25} onClick={handleLogout} />
        </Header>
      )}
      <Content className={styles.content}>
        <Outlet />
      </Content>
    </Layout>
  )
}

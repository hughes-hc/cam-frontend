import { Link, Outlet, history, useLocation } from 'umi';
import { Button, Layout, Typography } from 'antd';
import styles from './index.less'
import { LogoutOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Header, Content } = Layout;

export default () => {
  const { pathname } = useLocation()
  const handleLogout = () => {
    history.push('/login')
  }
  return (
    <Layout className={styles.root}>
      {pathname !== '/login' && <Header className={styles.header}>
        <Link to="/">
          <Title className={styles.logo}>企业档案管理系统</Title>
        </Link>
        <LogoutOutlined className={styles.logout} size={25} onClick={handleLogout}/>
      </Header>}
      <Content className={styles.content}>
        <Outlet />
      </Content>
    </Layout>
  );
}

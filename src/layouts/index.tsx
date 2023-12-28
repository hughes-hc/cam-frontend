import { Link, Outlet } from 'umi';
import { Layout, Typography } from 'antd';
import styles from './index.less'

const { Title } = Typography;
const { Header, Content } = Layout;

export default () => {
  return (
    <Layout className={styles.root}>
      <Link to="/" className={styles.title}>
        <Title>企业档案管理系统</Title>
      </Link>
      <Content className={styles.content}>
        <Outlet />
      </Content>
    </Layout>
  );
}

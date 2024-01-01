import { Row, Col, Card } from 'antd'
import { Link, Icon } from 'umi'

export default () => {
  const menus = [
    { title: '档案导入', path: '/import', icon: 'local:import' },
    { title: '档案查询', path: '/search', icon: 'local:search' },
    { title: '操作记录查询', path: '/audit', icon: 'local:audit' }
  ]

  return (
    <Row gutter={24} justify="space-between" align="middle" style={{ height: '100%' }}>
      {menus.map(({ title, path, icon }, index) => (
        <Col span={7} key={index}>
          <Link to={path}>
            <Card
              hoverable
              bodyStyle={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
              }}
            >
              <h2>{title}</h2>
              <Icon icon={icon} width="200px" height="200px" />
            </Card>
          </Link>
        </Col>
      ))}
    </Row>
  )
}

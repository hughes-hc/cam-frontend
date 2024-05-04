import { Button, Result } from 'antd'
import { history } from 'umi'

const Forbidden = () => (
  <Result
    status="403"
    title="403"
    subTitle="对不起，您无权访问此页面。"
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        返回首页
      </Button>
    }
  />
)

export default Forbidden

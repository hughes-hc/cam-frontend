import { Button, Result } from 'antd'

const NotFound = () => (
  <Result
    status="404"
    title="404"
    subTitle="访问的页面不存在，请检查您的网址是否正确。"
    extra={
      <Button type="primary" onClick={() => history.back()}>
        返回上级
      </Button>
    }
  />
)

export default NotFound

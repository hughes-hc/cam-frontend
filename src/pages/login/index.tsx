import { getCaptcha, login } from '@/services/login'
import { Button, Col, Form, Input, Row, notification } from 'antd'
import { history } from 'umi'
import { useRequest } from 'ahooks'
import { CAM_TOKEN_KEY } from '@/common/constant'

type FieldType = ILoginParam

const getCaptchaUrl = (svgStr: string) => {
  const blob = new Blob([svgStr], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  return url
}

export default () => {
  const { data, run: handleRefreshCaptcha } = useRequest(getCaptcha)
  const { captcha_id, captcha_data } = data || ({} as ICaptcha)

  const { loading, run: handleFinish } = useRequest(params => login({ captcha_id, ...params }), {
    manual: true,
    onSuccess(res) {
      localStorage.setItem(CAM_TOKEN_KEY, `Bearer ${res.access_token}`)
      history.push('/')
    },
    onError(e) {
      console.log(e)
      handleRefreshCaptcha()
    }
  })

  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 450 }}
      initialValues={{ remember: true }}
      onFinish={handleFinish}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        label="用户名"
        name="username"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="密码"
        name="password"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item label="验证码" style={{ marginBottom: 0 }}>
        <Row gutter={8}>
          <Col span={16}>
            <Form.Item<FieldType>
              name="captcha_code"
              rules={[{ required: true, message: '请输入验证码' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <img
              src={getCaptchaUrl(captcha_data)}
              alt="验证码"
              onClick={handleRefreshCaptcha}
              height={32}
              style={{ cursor: 'pointer' }}
            />
          </Col>
        </Row>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" loading={loading}>
          登录
        </Button>
      </Form.Item>
    </Form>
  )
}

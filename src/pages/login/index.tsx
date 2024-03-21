import { CAM_TOKEN_KEY } from '@/common/constant'
import { getCaptcha, login } from '@/services/login'
import { useRequest } from 'ahooks'
import { Button, Col, Form, Input, Row } from 'antd'
import { history } from 'umi'
import styles from './index.less'
import { getCaptchaUrl } from '@/common/utils'

type FieldType = ILoginParam

export default () => {
  const { data, run: handleRefreshCaptcha } = useRequest(getCaptcha)
  const { captcha_id, captcha_data } = data || ({} as ICaptcha)

  const { loading, run: handleFinish } = useRequest(params => login({ captcha_id, ...params }), {
    manual: true,
    onSuccess(res) {
      localStorage.setItem(CAM_TOKEN_KEY, `Bearer ${res.access_token}`)
      history.push('/company')
    },
    onError(e) {
      console.log(e)
      handleRefreshCaptcha()
    }
  })

  return (
    <div className={styles.login}>
      <Form
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 18 }}
        style={{ maxWidth: 450 }}
        initialValues={{ remember: true }}
        onFinish={handleFinish}
        autoComplete="off"
        className={styles.form}
      >
        <h1 className={styles.title}>德兴市企业登记档案管理平台</h1>
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

        <Form.Item wrapperCol={{ offset: 5, span: 18 }}>
          <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

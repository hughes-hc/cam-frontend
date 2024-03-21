import { getCaptchaUrl } from '@/common/utils'
import { validateNoSpaces } from '@/common/validate'
import { getCaptcha } from '@/services/login'
import { updateUserPassword } from '@/services/user'
import { useRequest } from 'ahooks'
import { Form, Input, Modal, Space, message } from 'antd'

const { useForm } = Form

interface IProps {
  visible: boolean
  toggleVisible: () => void
  initialData: IUser
  setInitialData: (data: IUser) => void
}

export default ({ visible, toggleVisible, initialData, setInitialData }: IProps) => {
  const { id, username } = initialData
  const [form] = useForm<IPasswordForm>()

  const { data, run: handleRefreshCaptcha } = useRequest(getCaptcha)
  const { captcha_id, captcha_data } = data || ({} as ICaptcha)

  const { loading, run: runChangePwd } = useRequest(updateUserPassword, {
    manual: true,
    onSuccess: () => {
      message.success('密码修改成功')
      toggleVisible()
    },
    onError: () => {
      handleRefreshCaptcha()
    }
  })

  const handleSubmit = () => {
    form.validateFields().then(values => {
      runChangePwd({ ...values, captcha_id, id })
    })
  }

  const validateConfirmPassword = (_rule: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('请再次输入密码以确认'))
    } else if (value !== form.getFieldValue('new_password')) {
      return Promise.reject(new Error('两次密码不一致，请重新输入'))
    } else {
      return Promise.resolve()
    }
  }

  return (
    <Modal
      open={visible}
      width={540}
      title="修改密码"
      confirmLoading={loading}
      onOk={handleSubmit}
      onCancel={toggleVisible}
      afterClose={() => {
        form.resetFields()
        setInitialData({} as IUser)
      }}
    >
      <Form<IPasswordForm> form={form} labelCol={{ span: 5 }} wrapperCol={{ offset: 1, span: 18 }}>
        <Form.Item label="用户名">
          <span>{username}</span>
        </Form.Item>
        <Form.Item
          name="new_password"
          label="新密码"
          rules={[{ required: true }, { max: 20 }, { validator: validateNoSpaces }]}
        >
          <Input.Password placeholder="支持中英文、数字及符号" />
        </Form.Item>
        <Form.Item
          label="新密码确认"
          name="confirm"
          required
          rules={[{ validator: validateConfirmPassword }]}
          validateTrigger="onBlur"
        >
          <Input.Password placeholder="请再次输入新密码" autoComplete="new-password" />
        </Form.Item>
        <Form.Item name="password" label="密码确认" rules={[{ required: true }]}>
          <Input.Password placeholder="请输入当前登录用户的密码" />
        </Form.Item>
        <Form.Item label="验证码" required>
          <Space align="center">
            <Form.Item name="captcha_code" rules={[{ required: true, message: '请输入验证码' }]}>
              <Input placeholder="请输入验证码" />
            </Form.Item>
            <Form.Item>
              <img
                src={getCaptchaUrl(captcha_data)}
                alt="验证码"
                onClick={handleRefreshCaptcha}
                height={32}
                style={{ cursor: 'pointer' }}
              />
            </Form.Item>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}

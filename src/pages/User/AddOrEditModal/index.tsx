import { ACCOUNT_STATUS_MAP, USER_ROLE_MAP, UserRoleType } from '@/common/constant'
import { validateEmail, validateNoSpaces, validatePhone } from '@/common/validate'
import { addUser, checkUser, updateUser } from '@/services/user'
import { useRequest } from 'ahooks'
import { Form, Input, Modal, Switch, Typography, message } from 'antd'

const { useForm } = Form
const { Text } = Typography

type StatusType = keyof Pick<typeof ACCOUNT_STATUS_MAP, 'active' | 'disabled'>

interface IProps {
  visible: boolean
  toggleVisible: () => void
  initialData?: IUser
  setInitialData: (data?: IUser) => void
  refreshTable: (query?: Partial<IQuery>) => void
}

const StatusSwitch = ({ value, onChange }: ICustomComProps<StatusType>) => {
  const _val = value === 'active'

  return (
    <Switch
      checkedChildren={ACCOUNT_STATUS_MAP['active']}
      unCheckedChildren={ACCOUNT_STATUS_MAP['disabled']}
      checked={_val}
      onChange={val => onChange?.(val ? 'active' : 'disabled')}
    />
  )
}

export default ({ visible, toggleVisible, initialData, setInitialData, refreshTable }: IProps) => {
  const [form] = useForm()
  const isEdit = !!initialData

  isEdit && form.setFieldsValue({ ...initialData })

  const { loading: loadingAdd, run: runAdd } = useRequest(addUser, {
    manual: true,
    onSuccess: () => {
      message.success('新增成功')
      setInitialData()
      toggleVisible()
      refreshTable()
    }
  })

  const { loading: loadingEdit, run: runEdit } = useRequest(updateUser, {
    manual: true,
    onSuccess: () => {
      message.success('编辑成功')
      setInitialData()
      toggleVisible()
      refreshTable()
    }
  })

  const handleAddOrEdit = () => {
    return form
      .validateFields()
      .then(values => (isEdit ? runEdit({ id: initialData?.id, ...values }) : runAdd(values)))
  }

  const validateUserName = (_rule: any, value: string) => {
    if (!value) {
      Promise.reject(new Error('请输入用户名'))
    }

    return checkUser({ username: value }).then(exist => {
      if (exist) {
        return Promise.reject(new Error('用户名已存在'))
      } else {
        return Promise.resolve()
      }
    })
  }

  const validateConfirmPassword = (_rule: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('请再次输入密码以确认'))
    } else if (value !== form.getFieldValue('password')) {
      return Promise.reject(new Error('两次密码不一致，请重新输入'))
    } else {
      return Promise.resolve()
    }
  }

  return (
    <Modal
      open={visible}
      width={540}
      title={isEdit ? '编辑用户' : '新增用户'}
      onOk={handleAddOrEdit}
      onCancel={() => {
        form.resetFields()
        toggleVisible()
        setInitialData()
      }}
      confirmLoading={loadingAdd || loadingEdit}
    >
      <Form<IUserForm> form={form} labelCol={{ span: 4 }} wrapperCol={{ offset: 1, span: 19 }}>
        {isEdit ? (
          <Form.Item name="username" label="用户名">
            <Text>{initialData?.username}</Text>
          </Form.Item>
        ) : (
          <Form.Item
            name="username"
            label="用户名"
            validateTrigger="onBlur"
            required
            rules={[{ max: 20 }, { validator: validateUserName }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
        )}
        {isEdit ? null : (
          <>
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true }, { max: 20 }, { validator: validateNoSpaces }]}
            >
              <Input.Password placeholder="支持中英文、数字及符号" />
            </Form.Item>
            <Form.Item
              label="确认密码"
              name="confirm"
              required
              rules={[{ validator: validateConfirmPassword }]}
              validateTrigger="onBlur"
            >
              <Input.Password placeholder="请再次输入密码" autoComplete="new-password" />
            </Form.Item>
          </>
        )}
        <Form.Item name="role" label="角色" initialValue={'internal'}>
          <span>{USER_ROLE_MAP[(initialData?.role as UserRoleType) ?? 'internal']}</span>
        </Form.Item>
        <Form.Item name="email" label="邮箱" rules={[{ validator: validateEmail }]}>
          <Input placeholder="请输入邮箱" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="电话"
          rules={[{ required: true }, { validator: validatePhone }]}
        >
          <Input placeholder="请输入电话" />
        </Form.Item>
        <Form.Item name="status" label="状态" initialValue={'active'}>
          <StatusSwitch />
        </Form.Item>
      </Form>
    </Modal>
  )
}

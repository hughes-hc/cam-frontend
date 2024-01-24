import { validateEmail, validateNoSpaces, validatePhone } from '@/common/validate'
import { addCompany, updateCompany } from '@/services/company'
import { useRequest } from 'ahooks'
import { Form, Input, Modal, Switch, message } from 'antd'

const { useForm } = Form

interface IProps {
  visible: boolean
  toggleVisible: () => void
  initialData?: IUserForm
  setInitialData: (data?: IUserForm) => void
  refreshTable: (query?: Partial<IQuery>) => void
}

export default ({ visible, toggleVisible, initialData, setInitialData, refreshTable }: IProps) => {
  const [form] = useForm()
  const isEdit = !!initialData

  isEdit && form.setFieldsValue({ ...initialData })

  const { loading: loadingAdd, run: runAdd } = useRequest(addCompany, {
    manual: true,
    onSuccess: () => {
      message.success('新增成功')
      setInitialData()
      toggleVisible()
      refreshTable()
    }
  })

  const { loading: loadingEdit, run: runEdit } = useRequest(updateCompany, {
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

  const validateConfirmPassword = (_rule: any, value: string) => {
    if (!value) {
      Promise.reject('请再次输入密码以确认')
    } else if (value !== form.getFieldValue('password')) {
      Promise.reject('两次密码不一致，请重新输入')
    } else {
      Promise.resolve()
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
      <Form<IUserForm> form={form} labelCol={{ span: 7 }} wrapperCol={{ offset: 1, span: 16 }}>
        <Form.Item
          name="username"
          label="用户名"
          rules={[{ required: true }, { max: 50 }, { validator: validateNoSpaces }]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>
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
          <Input.Password
            placeholder="请再次输入密码"
            autoComplete="new-password"
            style={{ boxShadow: 'none' }}
          />
        </Form.Item>
        <Form.Item
          name="role"
          label="角色"
          rules={[{ required: true }, { validator: validateNoSpaces }]}
        >
          <span>{initialData?.role}</span>
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
        <Form.Item name="status" label="状态" initialValue={true}>
          <Switch checkedChildren="启用" unCheckedChildren="禁用" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

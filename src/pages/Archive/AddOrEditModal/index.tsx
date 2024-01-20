import { validateNoSpaces } from '@/common/validate'
import { addCompany, updateCompany } from '@/services/company'
import { useRequest } from 'ahooks'
import { Form, Input, Modal, Typography, message } from 'antd'

const { useForm } = Form
const { Text } = Typography

interface IProps {
  visible: boolean
  toggleVisible: () => void
  initialData?: ICompanyForm
  setInitialData: (data?: ICompanyForm) => void
  refreshTable: (query?: Partial<IQuery>) => void
}

export default ({ visible, toggleVisible, initialData, setInitialData, refreshTable }: IProps) => {
  const [form] = useForm()
  const isEdit = !!initialData

  isEdit && form.setFieldsValue({ ...initialData })

  const { loading: loadingAdd, run: runAdd } = useRequest(addCompany, {
    manual: true,
    onSuccess: companyInfo => {
      if (companyInfo.exist) {
        toggleVisible()

        Modal.confirm({
          title: '该企业已存在，是否进行更新操作',
          content: <Text type="danger">{companyInfo.name}</Text>,
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            toggleVisible()
            setInitialData(companyInfo)
          },
          onCancel: () => {
            setInitialData()
            toggleVisible()
          }
        })
      } else {
        message.success('新增成功')
        setInitialData()
        toggleVisible()
        refreshTable({ page: 1 })
      }
    }
  })

  const { loading: loadingEdit, run: runEdit } = useRequest(updateCompany, {
    manual: true,
    onSuccess: () => {
      message.success('编辑成功')
      setInitialData()
      toggleVisible()
      refreshTable({ page: 1 })
    }
  })

  const handleAddOrEdit = () => {
    return form
      .validateFields()
      .then(values => (isEdit ? runEdit({ id: initialData?.id, ...values }) : runAdd(values)))
  }

  return (
    <Modal
      open={visible}
      width={540}
      title={isEdit ? '编辑企业信息' : '新增企业信息'}
      onOk={handleAddOrEdit}
      onCancel={() => {
        setInitialData()
        toggleVisible()
        form.resetFields()
      }}
      confirmLoading={loadingAdd || loadingEdit}
    >
      <Form<ICompanyForm> form={form} labelCol={{ span: 7 }} wrapperCol={{ offset: 1, span: 16 }}>
        <Form.Item
          name="name"
          label="企业名称"
          rules={[{ required: true }, { max: 50 }, { validator: validateNoSpaces }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item
          name="reg_num"
          label="企业注册号"
          rules={[{ required: true }, { len: 15 }, { validator: validateNoSpaces }]}
        >
          <Input placeholder="请输入" disabled={isEdit} />
        </Form.Item>
        <Form.Item
          name="social_credit_code"
          label="统一社会信用代码"
          rules={[{ required: true }, { len: 18 }, { validator: validateNoSpaces }]}
        >
          <Input placeholder="请输入" disabled={isEdit} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

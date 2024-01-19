import { validateNoSpaces } from '@/common/validate'
import { addCompany, deleteCompany, getCompanies, updateCompany } from '@/services/company'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { useRequest, useSetState } from 'ahooks'
import {
  Button,
  Divider,
  Flex,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
  message
} from 'antd'
import type { ColumnsType, TableProps } from 'antd/es/table'
import { history } from 'umi'

const { Text } = Typography
const { Search } = Input
const { useForm } = Form
const { useModal } = Modal

const initialQuery = {
  page: 1,
  page_size: 10,
  pattern: '',
  pattern_by: 'name'
}

export default () => {
  const [query, setQuery] = useSetState<IQuery>(initialQuery)
  const { page, page_size, pattern, pattern_by, order } = query
  const [form] = useForm()
  const [modal, modalContext] = useModal()

  const { data, loading } = useRequest(() => getCompanies(query), {
    refreshDeps: [page, page_size, pattern, pattern_by, order]
  })
  const { total = 0, items = [] } = data || {}

  const { loading: loadingAdd, run: runAdd } = useRequest(addCompany, {
    manual: true,
    onSuccess: () => {
      message.success('新增成功')
    }
  })

  const { loading: loadingEdit, run: runEdit } = useRequest(updateCompany, {
    manual: true,
    onSuccess: () => {
      message.success('编辑成功')
    }
  })

  const { loading: loadingDelete, run: runDelete } = useRequest(deleteCompany, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功')
    }
  })

  const handleTableChange: TableProps<ICompanyItem>['onChange'] = ({ current, pageSize }, _) => {
    setQuery({ page: current ?? page, page_size: pageSize ?? page_size })
  }

  const handleViewDetail = ({ id }: ICompanyItem) => {
    history.push(`/detail/${id}`)
  }

  const handleAddOrEdit = (params?: ICompanyItem) => {
    const isEdit = !!params
    modal.confirm({
      title: isEdit ? '编辑企业信息' : '新增企业信息',
      icon: null,
      width: 540,
      content: (
        <Form<ICompanyForm> form={form} labelCol={{ span: 7 }} wrapperCol={{ offset: 1, span: 16 }}>
          <Form.Item
            name="name"
            label="企业名称"
            rules={[{ required: true }, { max: 20 }, { validator: validateNoSpaces }]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item
            name="social_credit_code"
            label="统一社会信用代码"
            rules={[{ required: true }, { max: 18 }, { validator: validateNoSpaces }]}
          >
            <Input placeholder="请输入" disabled={isEdit} />
          </Form.Item>
          <Form.Item
            name="reg_num"
            label="企业注册号"
            rules={[{ required: true }, { max: 15 }, { validator: validateNoSpaces }]}
          >
            <Input placeholder="请输入" disabled={isEdit} />
          </Form.Item>
        </Form>
      ),
      okText: '保存',
      cancelText: '取消',
      onOk: () => {
        return form.validateFields().then(values => (isEdit ? runEdit(values) : runAdd(values)))
      },
      okButtonProps: {
        loading: loadingAdd || loadingEdit
      },
      onCancel: () => {
        form.resetFields()
      }
    })
  }

  const handleDelete = ({ id, name }: ICompanyItem) => {
    Modal.confirm({
      title: '确定要删除吗?',
      content: <Text type="danger">{name}</Text>,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        return runDelete({ id })
      }
    })
  }

  const columns: ColumnsType<ICompanyItem> = [
    {
      title: '企业名称',
      dataIndex: 'name',
      width: '40%'
    },
    {
      title: '企业注册号',
      dataIndex: 'reg_num',
      width: '20%'
    },
    {
      title: '卷案号',
      dataIndex: 'volume_num',
      width: '20%'
    },
    {
      title: '统一社会信用代码',
      dataIndex: 'social_credit_code',
      width: '30%'
    },
    {
      title: '操作',
      render: (_, record) => (
        <Space size="small" split={<Divider type="vertical" />}>
          <Button type="link" onClick={() => handleViewDetail(record)}>
            详情
          </Button>
          <Button type="link" onClick={() => handleAddOrEdit(record)}>
            编辑
          </Button>
          <Button type="link" onClick={() => handleDelete(record)} loading={loadingDelete}>
            删除
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div>
      <Flex style={{ marginBottom: 20 }} justify="space-between">
        <Space.Compact>
          <Select
            value={pattern_by}
            options={[
              { label: '企业名称', value: 'name' },
              { label: '统一社会信用代码', value: 'social_credit_code' },
              { label: '企业注册号', value: 'reg_num' }
            ]}
            onChange={val => setQuery({ pattern_by: val })}
            style={{ minWidth: 150 }}
          />
          <Search
            placeholder="请输入"
            onSearch={val => setQuery({ pattern: val })}
            style={{ width: 350 }}
            enterButton
          />
        </Space.Compact>
        <Space size="large">
          <Space.Compact>
            <Tooltip title="下载模板后，按照模板格式规范填写，进行批量导入" placement="bottomLeft">
              <QuestionCircleOutlined style={{ color: '#1677ff' }} />
              <Button type="link">下载模板</Button>
            </Tooltip>
          </Space.Compact>
          <Button type="primary">批量导入</Button>
          <Button type="primary" style={{ minWidth: 80 }} onClick={() => handleAddOrEdit()}>
            新增
          </Button>
        </Space>
      </Flex>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={items}
        pagination={{
          current: page,
          pageSize: page_size,
          total
        }}
        loading={loading}
        onChange={handleTableChange}
      />
      {modalContext}
    </div>
  )
}

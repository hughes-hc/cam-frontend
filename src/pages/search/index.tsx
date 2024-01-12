import { getFileList } from '@/services/search'
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

const { Text } = Typography
const { Search } = Input
const { useForm } = Form

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

  const { data, loading } = useRequest(() => getFileList(query), {
    refreshDeps: [page, page_size, pattern, order]
  })
  const { total = 0, items = [] } = data || {}

  const { loadingAdd, run: runAdd } = useRequest(fetch, {
    manual: true,
    onSuccess: () => {
      message.success('新增成功')
    }
  })

  const { loadingEdit, run: runEdit } = useRequest(fetch, {
    manual: true,
    onSuccess: () => {
      message.success('编辑成功')
    }
  })

  const { loadingDelete, run: runDelete } = useRequest(fetch, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功')
    }
  })

  const handleTableChange: TableProps<IFileItem>['onChange'] = ({ current, pageSize }, _) => {
    setQuery({ page: current ?? page, page_size: pageSize ?? page_size })
  }

  const handleViewDetail = (id: number) => {}

  const handleAddOrEdit = (params?: any) => {
    const isEdit = !!params
    Modal.confirm({
      title: isEdit ? '编辑企业信息' : '新增企业信息',
      icon: null,
      width: 540,
      content: (
        <Form form={form} labelCol={{ span: 7 }} wrapperCol={{ offset: 1, span: 16 }}>
          <Form.Item name="name" label="企业名称" rules={[{ required: true }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item name="name" label="统一社会信用代码" rules={[{ required: true }]}>
            <Input placeholder="请输入" disabled={isEdit} />
          </Form.Item>
          <Form.Item name="name" label="企业注册号" rules={[{ required: true }]}>
            <Input placeholder="请输入" disabled={isEdit} />
          </Form.Item>
        </Form>
      ),
      okText: '保存',
      cancelText: '取消',
      onOk: () => {
        return form.validateFields().then(values => values)
      },
      // confirmLoading: loadingAdd || loadingEdit,
      onCancel: () => {
        form.resetFields()
      }
    })
  }

  const handleDelete = ({ id, name }) => {
    Modal.confirm({
      title: '确定要删除吗?',
      content: <Text type="danger">{name}123</Text>,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        return runDelete(id)
      }
    })
  }

  const columns: ColumnsType<IFileItem> = [
    {
      title: '企业名称',
      dataIndex: 'filename',
      width: '40%'
    },
    {
      title: '企业注册号',
      dataIndex: 'gender',
      width: '20%'
    },
    {
      title: '卷案号',
      dataIndex: 'gender',
      width: '20%'
    },
    {
      title: '统一社会信用代码',
      dataIndex: 'gender',
      width: '30%'
    },
    {
      title: '操作',
      render: (_: any, { id, name }: IFileItem) => (
        <Space size="small" split={<Divider type="vertical" />}>
          <Button type="link" onClick={() => handleViewDetail(id)}>
            详情
          </Button>
          <Button type="link" onClick={() => handleAddOrEdit({ id, name })}>
            编辑
          </Button>
          <Button type="link" onClick={() => handleDelete({ id, name })}>
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
    </div>
  )
}

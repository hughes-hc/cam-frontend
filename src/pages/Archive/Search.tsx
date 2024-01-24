import { computeNextPage } from '@/common/utils'
import { companyBatchImport, deleteCompany, getCompanies, getTemplate } from '@/services/company'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { useRequest, useSetState, useToggle } from 'ahooks'
import {
  Button,
  Divider,
  Flex,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
  Upload,
  UploadFile,
  UploadProps,
  message
} from 'antd'
import type { ColumnsType, TableProps } from 'antd/es/table'
import { RcFile } from 'antd/es/upload'
import fileDownload from 'js-file-download'
import { useState } from 'react'
import { history } from 'umi'
import AddOrEditModal from './AddOrEditModal'

const { Text } = Typography
const { Search } = Input

const initialQuery: IQuery = {
  page: 1,
  page_size: 10,
  pattern: '',
  pattern_by: 'name'
}

export default () => {
  const [query, setQuery] = useSetState<IQuery>(initialQuery)
  const { page, page_size, pattern, pattern_by, order } = query
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [visible, { toggle: toggleVisible }] = useToggle()
  const [initialData, setInitialData] = useState<ICompanyForm | undefined>()

  const {
    data,
    loading,
    run: refreshTable
  } = useRequest(newQuery => getCompanies({ ...query, ...newQuery }), {
    refreshDeps: [page, page_size, pattern, pattern_by, order]
  })
  const { total = 0, items = [] } = data || {}

  const { loading: loadingImport, run: runBatchImport } = useRequest(companyBatchImport, {
    manual: true,
    onSuccess: res => {
      message.success(res)
      refreshTable({ page: 1 })
    }
  })

  const { loading: loadingDelete, run: runDelete } = useRequest(deleteCompany, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功')
      refreshTable({ page: computeNextPage(page, items.length) })
    }
  })

  const handleDownloadTemplate = () => {
    getTemplate()
      .then(res => {
        message.success('模板下载成功')
        fileDownload(res, '批量导入企业信息模板.xlsx')
      })
      .catch(err => {
        console.log(err)
      })
  }

  const handleTableChange: TableProps<ICompanyItem>['onChange'] = ({ current, pageSize }, _) => {
    setQuery({ page: current ?? page, page_size: pageSize ?? page_size })
  }

  const handleViewDetail = ({ id }: ICompanyItem) => {
    history.push(`/detail/${id}`)
  }

  const handleAddOrEdit = (params?: ICompanyItem) => {
    setInitialData(params)
    toggleVisible()
  }

  const handleDelete = ({ id, name }: ICompanyItem) => {
    Modal.confirm({
      title: '是否删除?',
      content: <Text type="danger">{name}</Text>,
      okText: '确定',
      cancelText: '取消',
      okButtonProps: { loading: loadingDelete },
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
          <Button type="link" onClick={() => handleDelete(record)}>
            删除
          </Button>
        </Space>
      )
    }
  ]

  const uploadProps: UploadProps<UploadFile> = {
    name: 'file',
    multiple: false,
    maxCount: 1,
    accept: '.xlsx',
    fileList,
    showUploadList: false,
    beforeUpload() {
      // 返回false在点击上传按钮时再传递文件
      return false
    },
    onChange(info) {
      const { fileList } = info
      setFileList(fileList)

      Modal.confirm({
        title: '确定导入?',
        content: (
          <Flex>
            <Text type="success">{fileList[0]?.name}</Text>
          </Flex>
        ),
        okText: '确定',
        cancelText: '取消',
        okButtonProps: { loading: loadingImport },
        onOk: () => {
          const formData = new FormData()
          formData.append('file', fileList[0].originFileObj as RcFile)
          return runBatchImport(formData)
        }
      })
    }
  }

  return (
    <div>
      <Flex style={{ marginBottom: 20 }} justify="space-between">
        <Space.Compact>
          <Select
            value={pattern_by}
            options={[
              { label: '企业名称', value: 'name' },
              { label: '企业注册号', value: 'reg_num' },
              { label: '统一社会信用代码', value: 'social_credit_code' }
            ]}
            onChange={val => setQuery({ page: 1, pattern_by: val })}
            style={{ minWidth: 150 }}
          />
          <Search
            placeholder="请输入"
            onSearch={val => setQuery({ page: 1, pattern: val })}
            style={{ width: 350 }}
            enterButton
            allowClear
          />
        </Space.Compact>
        <Space size="large">
          <Space.Compact>
            <Tooltip
              title="下载模板后，按照模板格式规范填写企业信息，进行批量导入"
              placement="bottomLeft"
            >
              <QuestionCircleOutlined style={{ color: '#1677ff' }} />
              <Button type="link" onClick={() => handleDownloadTemplate()}>
                下载模板
              </Button>
            </Tooltip>
          </Space.Compact>
          <Upload {...uploadProps}>
            <Button type="primary">信息导入</Button>
          </Upload>
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
      <AddOrEditModal {...{ visible, toggleVisible, initialData, setInitialData, refreshTable }} />
    </div>
  )
}

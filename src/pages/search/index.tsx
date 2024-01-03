import { downloadFile, getFileList } from '@/services/search'
import { useRequest, useSetState } from 'ahooks'
import { Button, Input, Space, Table, message } from 'antd'
import type { ColumnsType, TableProps } from 'antd/es/table'

const { Search } = Input

const initialQuery = {
  page: 1,
  page_size: 10,
  pattern: ''
}

export default () => {
  const [query, setQuery] = useSetState<IQuery>(initialQuery)
  const { page, page_size, pattern } = query

  const { data, loading } = useRequest(() => getFileList(query), {
    refreshDeps: [page, page_size, pattern]
  })
  const { total = 0, items = [] } = data || {}

  const { run: handleDownload } = useRequest(downloadFile, {
    manual: true,
    onSuccess: res => {
      message.success('下载成功')
    }
  })

  const handleTableChange: TableProps<IFileItem>['onChange'] = ({ current, pageSize }) => {
    setQuery({ page: current ?? page, page_size: pageSize ?? page_size })
  }

  const columns: ColumnsType<IFileItem> = [
    {
      title: '企业档案名称',
      dataIndex: 'filename',
      sorter: true,
      width: '20%'
    },
    {
      title: '企业注册号',
      dataIndex: 'gender',
      width: '20%'
    },
    {
      title: '操作',
      render: (_: any, { id, filename }: IFileItem) => (
        <Space size="middle">
          <Button type="link" loading={loading} onClick={() => handleDownload({ id, filename })}>
            下载原始文件
          </Button>
          <Button type="link" onClick={() => handleDownload({ id, filename, is_seal: true })}>
            下载盖章文件
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div>
      <Search
        placeholder="请输入"
        onSearch={val => setQuery({ pattern: val })}
        style={{ width: '100%', marginBottom: 20 }}
      />
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

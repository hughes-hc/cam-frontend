import { getAuditList } from '@/services/audit'
import { useRequest, useSetState } from 'ahooks'
import { Input, Table } from 'antd'
import type { ColumnsType, TableProps } from 'antd/es/table'

const { Search } = Input

const initialQuery = {
  page: 1,
  page_size: 10,
  pattern: ''
}

export default () => {
  const [query, setQuery] = useSetState<IQuery>(initialQuery)
  const { page, page_size, pattern, order } = query

  const { data, loading } = useRequest(() => getAuditList(query), {
    refreshDeps: [page, page_size, pattern, order]
  })
  const { total = 0, items = [] } = data || {}

  const handleTableChange: TableProps<IFileItem>['onChange'] = (
    { current, pageSize },
    _,
    { order }
  ) => {
    setQuery({ page: current ?? page, page_size: pageSize ?? page_size, order })
  }

  const columns: ColumnsType<IFileItem> = [
    {
      title: '企业档案名称',
      dataIndex: 'filename',
      sorter: true,
      width: '30%'
    },
    {
      title: '企业注册号',
      dataIndex: 'company_reg_num',
      width: '20%'
    },
    {
      title: '操作人',
      dataIndex: 'username',
      width: '10%'
    },
    {
      title: '操作类型',
      dataIndex: 'handle_type',
      width: '20%'
    },
    {
      title: '操作时间',
      dataIndex: 'handle_time',
      width: '20%'
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

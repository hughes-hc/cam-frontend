import {
  AuditActionType,
  AuditResourceType,
  Audit_Action_Map,
  Audit_Resource_Map
} from '@/common/constant'
import CAMSelect from '@/components/CAMSelect'
import CAMTitle from '@/components/CAMTitle'
import { getAuditList } from '@/services/audit'
import { useRequest, useSetState } from 'ahooks'
import { Divider, Flex, Input, Select, Space, Table, Typography } from 'antd'
import type { ColumnsType, TableProps } from 'antd/es/table'
import { map } from 'lodash'

const { Search } = Input
const { Text, Title } = Typography

const initialQuery = {
  page: 1,
  page_size: 10,
  pattern_by: 'user_name',
  filters: {}
}

export default () => {
  const [query, setQuery] =
    useSetState<IQuery<Pick<IAuditItem, 'result' | 'resource'>>>(initialQuery)
  const { page, page_size, pattern, pattern_by, order, order_by, filters } = query

  const { data, loading } = useRequest(() => getAuditList(query), {
    refreshDeps: [page, page_size, pattern, pattern_by, order, order_by, filters]
  })
  const { total = 0, items = [] } = data || {}

  const handleTableChange: TableProps<IAuditItem>['onChange'] = (
    { current, pageSize },
    _,
    { field, order }
  ) => {
    setQuery({ page: current ?? page, page_size: pageSize ?? page_size, order, order_by: field })
  }

  const columns: ColumnsType<IAuditItem> = [
    {
      title: '操作人',
      dataIndex: 'user_name'
    },
    {
      title: '登录IP',
      dataIndex: 'ip_address'
    },
    {
      title: '操作环境',
      dataIndex: 'user_agent'
    },
    {
      title: '操作类型',
      dataIndex: 'action',
      render: (action: AuditActionType, { resource }) =>
        Audit_Action_Map[action] +
        (resource ? Audit_Resource_Map[resource as AuditResourceType] : '')
    },
    {
      title: '操作结果',
      dataIndex: 'result',
      render: (result: boolean) => (result ? '成功' : '失败')
    },
    {
      title: '操作时间',
      dataIndex: 'created_at',
      sorter: true
    }
  ]

  return (
    <div>
      <CAMTitle title="审计日志" />
      <Flex style={{ marginBottom: 20 }} justify="space-between">
        <Flex gap={20}>
          <CAMSelect
            label="操作结果"
            options={[
              { label: '成功', value: true },
              { label: '失败', value: false }
            ]}
            value={filters?.result}
            onChange={val => setQuery({ page: 1, filters: { ...filters, result: val } })}
          />
          <CAMSelect
            label="资源类型"
            options={map(Audit_Resource_Map, (label, value) => ({
              label,
              value
            }))}
            value={filters?.resource}
            onChange={val => setQuery({ page: 1, filters: { ...filters, resource: val } })}
          />
        </Flex>
        <Space.Compact>
          <Select
            value={pattern_by}
            options={[
              { label: '操作人', value: 'user_name' },
              { label: '操作类型', value: 'resource' }
            ]}
            onChange={val => setQuery({ page: 1, pattern_by: val })}
            style={{ minWidth: 100 }}
          />
          <Search
            placeholder="请输入"
            onSearch={val => setQuery({ page: 1, pattern: val })}
            style={{ width: 200 }}
            enterButton
            allowClear
          />
        </Space.Compact>
      </Flex>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={items}
        pagination={{
          position: ['bottomCenter'],
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

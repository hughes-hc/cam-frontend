import {
  ACCOUNT_STATUS_MAP,
  AccountStatusType,
  USER_ROLE_MAP,
  UserRoleType
} from '@/common/constant'
import { computeNextPage } from '@/common/utils'
import CAMSelect from '@/components/CAMSelect'
import CAMTitle from '@/components/CAMTitle'
import { deleteUser, getUsers } from '@/services/user'
import { useRequest, useSetState, useToggle } from 'ahooks'
import { Button, Divider, Flex, Input, Modal, Space, Table, Typography, message } from 'antd'
import type { ColumnsType, TableProps } from 'antd/es/table'
import { map } from 'lodash'
import { useState } from 'react'
import AddOrEditModal from './AddOrEditModal'

const { Text } = Typography
const { Search } = Input

const initialQuery: IQuery = {
  page: 1,
  page_size: 10,
  pattern: '',
  pattern_by: 'username',
  filters: {}
}

export default () => {
  const [query, setQuery] = useSetState<IQuery<Pick<IUser, 'role' | 'status'>>>(initialQuery)
  const { page, page_size, pattern, pattern_by, order, filters } = query
  const [visible, { toggle: toggleVisible }] = useToggle()
  const [initialData, setInitialData] = useState<IUserForm | undefined>()

  const {
    data,
    loading,
    run: refreshTable
  } = useRequest(newQuery => getUsers({ ...query, ...newQuery }), {
    refreshDeps: [page, page_size, pattern, pattern_by, order, filters]
  })
  const { total = 0, items = [] } = data || {}

  const { loading: loadingDelete, run: runDelete } = useRequest(deleteUser, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功')
      refreshTable({ page: computeNextPage(page, items.length) })
    }
  })

  const handleTableChange: TableProps<IUser>['onChange'] = (
    { current, pageSize },
    _,
    { field, order }
  ) => {
    setQuery({ page: current ?? page, page_size: pageSize ?? page_size, order_by: field, order })
  }

  const handleAddOrEdit = (params?: IUser) => {
    setInitialData(params)
    toggleVisible()
  }

  const handleDelete = ({ id, username }: IUser) => {
    Modal.confirm({
      title: '是否删除?',
      content: <Text type="danger">{username}</Text>,
      okText: '确定',
      cancelText: '取消',
      okButtonProps: { loading: loadingDelete },
      onOk: () => {
        return runDelete({ id })
      }
    })
  }

  const columns: ColumnsType<IUser> = [
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '角色',
      dataIndex: 'role',
      render: (role: UserRoleType) => USER_ROLE_MAP[role]
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      render: text => (text === null ? '-' : text)
    },
    {
      title: '电话',
      dataIndex: 'phone',
      render: text => (text === null ? '-' : text)
    },
    {
      title: '账户状态',
      dataIndex: 'status',
      render: (status: AccountStatusType) => ACCOUNT_STATUS_MAP[status]
    },
    {
      title: '最后登录时间',
      dataIndex: 'last_login_time',
      sorter: true,
      render: text => (text === null ? '-' : text)
    },
    {
      title: '操作',
      render: (_, record) => (
        <Space size="small" split={<Divider type="vertical" />}>
          <Button type="link" disabled={record.is_default} onClick={() => handleAddOrEdit(record)}>
            编辑
          </Button>
          {/* <Button type="link" disabled={record.is_default} onClick={() => handleAddOrEdit(record)}>
            修改密码
          </Button> */}
          <Button
            type="link"
            onClick={() => handleDelete(record)}
            loading={loadingDelete}
            disabled={record.is_default}
          >
            删除
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div>
      <CAMTitle title="用户管理" />
      <Flex style={{ marginBottom: 20 }} justify="space-between">
        <Flex gap={20}>
          <CAMSelect
            label="用户角色"
            value={filters?.role}
            options={map(USER_ROLE_MAP, (label, value) => ({ label, value }))}
            onChange={val => setQuery({ page: 1, filters: { ...filters, role: val } })}
          />
          <CAMSelect
            label="账户状态"
            value={filters?.status}
            options={map(ACCOUNT_STATUS_MAP, (label, value) => ({ label, value }))}
            onChange={val => setQuery({ page: 1, filters: { ...filters, status: val } })}
          />
        </Flex>
        <Flex gap={20}>
          <Space.Compact>
            <Search
              placeholder="请输入用户名"
              onSearch={val => setQuery({ page: 1, pattern: val })}
              style={{ width: 300 }}
              enterButton
              allowClear
            />
          </Space.Compact>
          <Space size="large">
            <Button type="primary" style={{ minWidth: 80 }} onClick={() => handleAddOrEdit()}>
              新增
            </Button>
          </Space>
        </Flex>
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

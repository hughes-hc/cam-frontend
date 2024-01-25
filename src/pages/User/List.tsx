import { computeNextPage } from '@/common/utils'
import { deleteCompany } from '@/services/company'
import { deleteUser, getUsers } from '@/services/user'
import { useRequest, useSetState, useToggle } from 'ahooks'
import { Button, Divider, Flex, Input, Modal, Space, Table, Typography, message } from 'antd'
import type { ColumnsType, TableProps } from 'antd/es/table'
import { useState } from 'react'
import AddOrEditModal from './AddOrEditModal'

const { Text } = Typography
const { Search } = Input

const initialQuery: IQuery = {
  page: 1,
  page_size: 10,
  pattern: '',
  pattern_by: 'username'
}

export default () => {
  const [query, setQuery] = useSetState<IQuery>(initialQuery)
  const { page, page_size, pattern, pattern_by, order } = query
  const [visible, { toggle: toggleVisible }] = useToggle()
  const [initialData, setInitialData] = useState<IUserForm | undefined>()

  const {
    data,
    loading,
    run: refreshTable
  } = useRequest(newQuery => getUsers({ ...query, ...newQuery }), {
    refreshDeps: [page, page_size, pattern, pattern_by, order]
  })
  const { total = 0, items = [] } = data || {}

  const { loading: loadingDelete, run: runDelete } = useRequest(deleteUser, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功')
      refreshTable({ page: computeNextPage(page, items.length) })
    }
  })

  const handleTableChange: TableProps<IUser>['onChange'] = ({ current, pageSize }, _) => {
    setQuery({ page: current ?? page, page_size: pageSize ?? page_size })
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
      dataIndex: 'role'
    },
    {
      title: '邮箱',
      dataIndex: 'email'
    },
    {
      title: '电话',
      dataIndex: 'phone'
    },
    {
      title: '账户状态',
      dataIndex: 'status'
    },
    {
      title: '最后登录时间',
      dataIndex: 'last_login_time'
    },
    {
      title: '操作',
      render: (_, record) => (
        <Space size="small" split={<Divider type="vertical" />}>
          <Button type="link" onClick={() => handleAddOrEdit(record)}>
            编辑
          </Button>
          <Button type="link" onClick={() => handleAddOrEdit(record)}>
            修改密码
          </Button>
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
      <Flex style={{ marginBottom: 20 }} justify="space-between">
        <Space.Compact>
          <Search
            placeholder="请输入用户名"
            onSearch={val => setQuery({ page: 1, pattern: val })}
            style={{ width: 350 }}
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

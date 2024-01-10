import { downloadFile, downloadSealFile, getFileList } from '@/services/search'
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
  const { page, page_size, pattern, order } = query

  const {
    data,
    loading,
    mutate: updateProgress
  } = useRequest(() => getFileList(query), {
    refreshDeps: [page, page_size, pattern, order]
  })
  const { total = 0, items = [] } = data || {}

  const { run: handleDownload } = useRequest(downloadFile, {
    manual: true,
    onSuccess: (_, [params]) => {
      message.success(`${params.filename} 下载成功`)
    }
  })

  const { run: handleDownloadSeal } = useRequest(downloadSealFile, {
    manual: true,
    onSuccess: (_, [params]) => {
      message.success(`${params.filename} (盖章文件) 下载成功`)
    }
  })

  const handleUpdateProgress = (
    { id, is_seal }: IDownloadParams,
    percent: number,
    isLoading: boolean
  ) => {
    const newItems = items.map(item => {
      if (item.id === id) {
        if (is_seal) {
          item['loadingDownloadSeal'] = isLoading
          item['downloadSealProgress'] = `${percent}%`
        } else {
          item['loadingDownload'] = isLoading
          item['downloadProgress'] = `${percent}%`
        }
      }
      return item
    })
    updateProgress({ items: newItems, total })
  }

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
      width: '50%'
    },
    {
      title: '企业注册号',
      dataIndex: 'gender',
      width: '20%'
    },
    {
      title: '操作',
      render: (
        _: any,
        {
          id,
          filename,
          loadingDownload,
          loadingDownloadSeal,
          downloadProgress,
          downloadSealProgress
        }: IFileItem
      ) => (
        <Space size="middle">
          <Button
            type="link"
            loading={loadingDownload as boolean}
            onClick={() => handleDownload({ id, filename }, handleUpdateProgress)}
          >
            {loadingDownload ? `下载中 ${downloadProgress}` : '下载原始文件'}
          </Button>
          <Button
            type="link"
            loading={loadingDownloadSeal as boolean}
            onClick={() =>
              handleDownloadSeal({ is_seal: true, id, filename }, handleUpdateProgress)
            }
          >
            {loadingDownloadSeal ? `下载中 ${downloadSealProgress}` : '下载盖章文件'}
          </Button>
        </Space>
      )
    }
  ]

  return (
    <div>
      <Search
        placeholder="请输入档案名称"
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

import { deleteArchive, getArchivesList } from '@/services/archive'
import { FilePdfTwoTone } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Badge, Button, Empty, Flex, List, ListProps, Modal, message } from 'antd'
import { useState } from 'react'
import { ArchiveModalViewer } from '../Viewer'
import { Archive_Type_Color_Map, ArchiveTypeColorMapType } from '@/common/constant'

interface IProps extends ListProps<IArchive> {
  mode: 'search' | 'detail'
  companyId: number
}

export default ({ companyId, mode, ...restProps }: IProps) => {
  const [activeId, setActiveId] = useState(0)
  const isSearch = mode === 'search'

  const {
    data: archiveInfo = [],
    loading: loadingList,
    run: refreshList
  } = useRequest(() => getArchivesList({ companyId }), {
    refreshDeps: [companyId]
  })

  const { loading: loadingDelete, run: runDelete } = useRequest(deleteArchive, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功')
      refreshList()
    }
  })

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除该档案吗？',
      content: '删除后将无法恢复',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        runDelete({ id })
      }
    })
  }

  return (
    <>
      {archiveInfo.length ? (
        <List
          {...restProps}
          loading={loadingList}
          itemLayout="horizontal"
          size="large"
          dataSource={archiveInfo}
          split={false}
          renderItem={(item, index) => (
            <Badge.Ribbon
              text={item.volume_type}
              color={Archive_Type_Color_Map[item.volume_type as ArchiveTypeColorMapType]}
              key={index}
            >
              <List.Item
                onClick={() => setActiveId(item.id)}
                style={{ background: '#fff', marginBottom: 20, borderRadius: 8, cursor: 'pointer' }}
                actions={
                  isSearch
                    ? []
                    : [
                        <Button
                          type="link"
                          loading={loadingDelete}
                          onClick={e => {
                            handleDelete(item.id)
                            e.stopPropagation()
                          }}
                        >
                          删除
                        </Button>
                      ]
                }
              >
                <List.Item.Meta
                  avatar={<FilePdfTwoTone style={{ fontSize: 48 }} />}
                  title={item.volume_part_num}
                  description={
                    <Flex justify={isSearch ? 'space-between' : 'flex-start'} gap={20}>
                      <span>{item.upload_time}</span>
                      <span>{item.pages} 页</span>
                    </Flex>
                  }
                />
              </List.Item>
            </Badge.Ribbon>
          )}
        />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无档案" />
      )}
      {!!activeId && (
        <ArchiveModalViewer list={archiveInfo} activeId={activeId} setActiveId={setActiveId} />
      )}
    </>
  )
}

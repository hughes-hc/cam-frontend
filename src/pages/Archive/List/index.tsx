import { getArchivesList } from '@/services/archive'
import { FilePdfTwoTone } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Badge, Empty, Flex, List, ListProps } from 'antd'
import { useState } from 'react'
import { ArchiveModalViewer } from '../Viewer'

interface IProps extends ListProps<IArchive> {
  companyId: number
}

export default ({ companyId, ...restProps }: IProps) => {
  const [activeId, setActiveId] = useState(0)

  const { data: archiveInfo = [], loading: loadingList } = useRequest(
    () => getArchivesList({ companyId }),
    {
      refreshDeps: [companyId]
    }
  )

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
            <Badge.Ribbon text={item.volume_type} color="volcano" key={index}>
              <List.Item
                onClick={() => setActiveId(item.id)}
                style={{ background: '#fff', marginBottom: 20, borderRadius: 8, cursor: 'pointer' }}
              >
                <List.Item.Meta
                  avatar={<FilePdfTwoTone style={{ fontSize: 48 }} />}
                  title={item.volume_part_num}
                  description={
                    <Flex justify="space-between">
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

import { getArchiveFile, getArchivesList } from '@/services/archive'
import { getCompany } from '@/services/company'
import { FilePdfOutlined, FilePdfTwoTone } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Badge, Descriptions, Flex, List, Modal, Progress, Skeleton } from 'antd'
import { useState } from 'react'
import { useParams } from 'umi'
import { Document, Page } from 'react-pdf'
import { AutoSizer, List as VirtualList } from 'react-virtualized'

export default () => {
  const { id } = useParams()
  const companyId = Number(id)
  const [activeId, setActiveId] = useState(0)
  const [progress, setProgress] = useState(0)
  const [numPages, setNumPages] = useState(0)

  const { data: companyInfo } = useRequest(() => getCompany({ id: companyId }))
  const { name, reg_num, social_credit_code, volume_num } = companyInfo || {}

  const { data: archiveInfo = [], loading: loadingList } = useRequest(() =>
    getArchivesList({ companyId: companyId })
  )

  const { data: archivePdf } = useRequest(() => getArchiveFile({ id: activeId }, setProgress), {
    ready: !!activeId,
    refreshDeps: [activeId]
  })

  const resetViewStatus = () => {
    setActiveId(0)
    setProgress(0)
    setNumPages(0)
  }

  const handleDownload = () => {}

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
  }

  return (
    <Flex vertical gap={40}>
      <Descriptions
        bordered
        column={3}
        title={name}
        items={[
          {
            label: '企业注册号',
            children: reg_num
          },
          {
            label: '统一社会信用代码',
            children: social_credit_code
          },
          {
            label: '卷案号',
            children: volume_num
          }
        ]}
      />
      <List
        loading={loadingList}
        header={<h3>档案列表</h3>}
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
      {!!activeId && (
        <Modal
          title="档案预览"
          open={!!activeId}
          width={1000}
          okText="下载"
          cancelText="关闭"
          onOk={handleDownload}
          onCancel={resetViewStatus}
        >
          {progress < 100 && (
            <>
              <Progress
                percent={progress}
                status="active"
                strokeColor={{ from: '#108ee9', to: '#87d068' }}
              />
              <Skeleton.Node active={true}>
                <FilePdfOutlined style={{ fontSize: 100, color: '#bfbfbf' }} />
              </Skeleton.Node>
            </>
          )}
          {/* <Document file={archivePdf} onLoadSuccess={onDocumentLoadSuccess}>
            <AutoSizer>
              {({ height, width }) => (
                <VirtualList
                  height={height}
                  width={width}
                  rowCount={numPages}
                  rowHeight={height}
                  rowRenderer={({ index, key, style }) => {
                    return (
                      <div key={key} style={style}>
                        <Page pageNumber={index + 1} />
                      </div>
                    )
                  }}
                />
              )}
            </AutoSizer>
          </Document> */}
        </Modal>
      )}
    </Flex>
  )
}

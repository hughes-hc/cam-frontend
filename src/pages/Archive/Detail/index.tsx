import { getArchiveFile, getArchivesList } from '@/services/archive'
import { getCompany } from '@/services/company'
import { CaretLeftFilled, CaretRightFilled, FilePdfTwoTone } from '@ant-design/icons'
import { useRequest, useToggle } from 'ahooks'
import { Badge, Button, Descriptions, Flex, List, Modal, Progress, Skeleton } from 'antd'
import fileDownload from 'js-file-download'
import { find, findIndex } from 'lodash'
import { useState } from 'react'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import { useParams } from 'umi'
import Viewer from '../Viewer'
import styles from './index.less'
import classNames from 'classnames'

export default () => {
  const { id } = useParams()
  const companyId = Number(id)
  const [activeId, setActiveId] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isFullScreen, { toggle: toggleFullScreen }] = useToggle(false)

  const { data: companyInfo } = useRequest(() => getCompany({ id: companyId }))
  const { name, reg_num, social_credit_code, volume_num } = companyInfo || {}

  const { data: archiveInfo = [], loading: loadingList } = useRequest(() =>
    getArchivesList({ companyId: companyId })
  )
  const activeArchive = find(archiveInfo, item => item.id === activeId)
  const activeArchiveIndex = findIndex(archiveInfo, item => item.id === activeId)

  const { data: archivePdf } = useRequest(() => getArchiveFile({ id: activeId }, setProgress), {
    ready: !!activeId,
    refreshDeps: [activeId]
  })
  const fileURL = archivePdf ? URL.createObjectURL(archivePdf) : null

  const resetViewStatus = () => {
    setActiveId(0)
    setProgress(0)
  }

  const handleDownload = () => {
    if (archivePdf) {
      fileDownload(archivePdf, activeArchive?.volume_part_num + '.pdf')
    }
  }

  const handlePrev = () => {
    if (activeArchiveIndex > 0) {
      setActiveId(archiveInfo[activeArchiveIndex - 1].id)
    }
  }

  const handleNext = () => {
    if (activeArchiveIndex < archiveInfo.length - 1) {
      setActiveId(archiveInfo[activeArchiveIndex + 1].id)
    }
  }

  return (
    <Flex vertical gap={40}>
      <Descriptions
        bordered
        column={2}
        title={'基本信息'}
        items={[
          {
            label: '企业名称',
            children: name
          },
          {
            label: '企业注册号',
            children: reg_num
          },
          {
            label: '卷案号',
            children: volume_num
          },
          {
            label: '统一社会信用代码',
            children: social_credit_code
          }
        ]}
      />
      <List
        loading={loadingList}
        header={
          <Flex justify="space-between" align="center">
            <h3>档案列表</h3>
            <Button type="primary">新增档案</Button>
          </Flex>
        }
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
          width={isFullScreen ? '100vw' : 1200}
          okText="下载"
          cancelText="关闭"
          onOk={handleDownload}
          onCancel={resetViewStatus}
          maskClosable={false}
        >
          <div className={styles.content}>
            {progress < 100 && (
              <>
                <Progress
                  percent={progress}
                  status="active"
                  strokeColor={{ from: '#108ee9', to: '#87d068' }}
                />
                <Skeleton active />
              </>
            )}
            <Viewer
              file={fileURL}
              filename={activeArchive?.volume_part_num || ''}
              isFullScreen={isFullScreen}
              onFullScreen={toggleFullScreen}
            />
            {!isFullScreen && (
              <Flex justify="space-between" align="center" className={styles.extra}>
                <CaretLeftFilled
                  title="上份档案"
                  className={classNames(styles.changeBtn, {
                    [styles.disabled]: activeArchiveIndex === 0
                  })}
                  onClick={handlePrev}
                />
                <CaretRightFilled
                  title="下份档案"
                  className={classNames(styles.changeBtn, {
                    [styles.disabled]: activeArchiveIndex === archiveInfo.length - 1
                  })}
                  onClick={handleNext}
                />
              </Flex>
            )}
          </div>
        </Modal>
      )}
    </Flex>
  )
}

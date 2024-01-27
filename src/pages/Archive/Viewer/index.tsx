import { getArchiveFile } from '@/services/archive'
import {
  CaretLeftFilled,
  CaretRightFilled,
  FileImageOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  OrderedListOutlined
} from '@ant-design/icons'
import { useRequest, useToggle } from 'ahooks'
import { Flex, Modal, Progress, Skeleton, Space } from 'antd'
import classNames from 'classnames'
import fileDownload from 'js-file-download'
import { find, findIndex, times } from 'lodash'
import { DocumentCallback, File } from 'node_modules/react-pdf/dist/esm/shared/types'
import { useEffect, useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import { Document, Outline, Page, Thumbnail, pdfjs } from 'react-pdf'
import styles from './index.less'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface IProps {
  file: File
  filename: string
  isFullScreen: boolean
  onFullScreen: () => void
}

const ArchiveViewer = ({ file, filename, isFullScreen, onFullScreen }: IProps) => {
  const [numPages, setNumPages] = useState(0)
  const [isExpanded, { toggle: toggleExpand }] = useToggle(false)
  const [navMode, setNavMode] = useState<'thumbnail' | 'outline'>('thumbnail')

  useEffect(() => {
    setNumPages(0)
  }, [file])

  const onDocumentLoadSuccess = ({ numPages }: DocumentCallback) => {
    setNumPages(numPages)
  }

  return (
    <div className={styles.viewer}>
      <Document file={file} onLoadSuccess={onDocumentLoadSuccess} className={styles.document}>
        <Flex justify="space-between" align="center" className={styles.toolbar}>
          <Space className={styles.left}>
            {isExpanded ? (
              <MenuFoldOutlined onClick={toggleExpand} />
            ) : (
              <MenuUnfoldOutlined onClick={toggleExpand} />
            )}
            {filename}
          </Space>
          {isFullScreen ? (
            <FullscreenExitOutlined onClick={onFullScreen} />
          ) : (
            <FullscreenOutlined onClick={onFullScreen} />
          )}
        </Flex>
        {isExpanded && (
          <Flex className={styles.outlineContainer}>
            <Flex vertical gap={20}>
              <FileImageOutlined
                className={classNames(styles.navMode, { [styles.active]: navMode === 'thumbnail' })}
                onClick={() => setNavMode('thumbnail')}
              />
              <OrderedListOutlined
                className={classNames(styles.navMode, { [styles.active]: navMode === 'outline' })}
                onClick={() => setNavMode('outline')}
              />
            </Flex>
            <Scrollbars style={{ width: 180, height: isFullScreen ? 'calc(100vh - 300px)' : 600 }}>
              {navMode === 'thumbnail' && (
                <Flex vertical align="center" gap={10}>
                  {times(numPages, i => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <Thumbnail pageNumber={i + 1} key={i} scale={0.2} />
                      {i + 1}
                    </div>
                  ))}
                </Flex>
              )}
              {navMode === 'outline' && <Outline className={styles.outline} />}
            </Scrollbars>
          </Flex>
        )}
        <Scrollbars style={{ minWidth: 850, height: isFullScreen ? 'calc(100vh - 300px)' : 600 }}>
          <Flex vertical align="center" gap={10} style={{ background: '#666' }}>
            {times(numPages, i => (
              <Page pageNumber={i + 1} key={i} />
            ))}
          </Flex>
        </Scrollbars>
      </Document>
    </div>
  )
}

interface IModalProps {
  list: IArchive[]
  activeId: number
  setActiveId: (id: number) => void
}

const ArchiveModalViewer = ({ list, activeId, setActiveId }: IModalProps) => {
  const [progress, setProgress] = useState(0)
  const [isFullScreen, { toggle: toggleFullScreen }] = useToggle(false)

  const activeArchive = find(list, item => item.id === activeId)
  const activeArchiveIndex = findIndex(list, item => item.id === activeId)

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
      setActiveId(list[activeArchiveIndex - 1].id)
    }
  }

  const handleNext = () => {
    if (activeArchiveIndex < list.length - 1) {
      setActiveId(list[activeArchiveIndex + 1].id)
    }
  }

  return (
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
        <ArchiveViewer
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
                [styles.disabled]: activeArchiveIndex === list.length - 1
              })}
              onClick={handleNext}
            />
          </Flex>
        )}
      </div>
    </Modal>
  )
}

export default ArchiveViewer
export { ArchiveModalViewer }

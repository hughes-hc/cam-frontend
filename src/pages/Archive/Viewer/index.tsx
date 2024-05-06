import { getArchiveFile, viewArchiveFile } from '@/services/archive'
import {
  BorderOutlined,
  CaretLeftFilled,
  CaretRightFilled,
  CheckSquareOutlined,
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
import { find, findIndex, isEmpty, times } from 'lodash'
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
  selectedPages: number[]
  setSelectedPages: (pages: number[]) => void
}

const renderLoading = (progress?: number) => (
  <div className={styles.loading}>
    <Progress percent={progress} status="active" strokeColor={{ from: '#108ee9', to: '#87d068' }} />
    <Skeleton active />
  </div>
)

const ArchiveViewer = ({
  file,
  filename,
  isFullScreen,
  onFullScreen,
  selectedPages,
  setSelectedPages
}: IProps) => {
  const [numPages, setNumPages] = useState(0)
  const [isExpanded, { toggle: toggleExpand, set: setExpand }] = useToggle(false)
  const [navMode, setNavMode] = useState<'thumbnail' | 'outline'>('thumbnail')
  const [isChecking, { toggle: toggleCheck }] = useToggle(false)

  const [documentLoaded, setDocumentLoaded] = useState(false)
  const [outlineLoaded, setOutlineLoaded] = useState(false)

  useEffect(() => {
    setNumPages(0)
  }, [file])

  useEffect(() => {
    if (!isChecking) {
      setSelectedPages([])
    } else {
      setExpand(true)
    }
  }, [isChecking])

  const onDocumentLoadSuccess = ({ numPages }: DocumentCallback) => {
    setNumPages(numPages)
    setDocumentLoaded(true)
  }

  const handlePageSelect = (pageNumber: number) => {
    if (isChecking) {
      if (selectedPages.includes(pageNumber)) {
        setSelectedPages(selectedPages.filter(p => p !== pageNumber))
      } else {
        setSelectedPages([...selectedPages, pageNumber])
      }
    }
  }

  return (
    <div className={styles.viewer}>
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        className={styles.document}
        loading={renderLoading()}
        noData=""
      >
        <Flex justify="space-between" align="center" className={styles.toolbar}>
          <Space className={styles.left}>
            {isExpanded ? (
              <MenuFoldOutlined onClick={toggleExpand} title="收起目录" />
            ) : (
              <MenuUnfoldOutlined onClick={toggleExpand} title="打开目录" />
            )}
            {filename}
          </Space>
          <Space className={styles.right} size="middle">
            <span
              onClick={toggleCheck}
              title={isChecking ? '关闭选择模式' : '开启选择模式'}
              className={classNames(styles.checkMode, { [styles.active]: isChecking })}
            >
              选择
            </span>
            {/* {isChecking ? (
              <CheckSquareOutlined onClick={toggleCheck} title="关闭选择模式" />
            ) : (
              <BorderOutlined onClick={toggleCheck} title="开启选择模式" />
            )} */}
            {isFullScreen ? (
              <FullscreenExitOutlined onClick={onFullScreen} title="取消全屏" />
            ) : (
              <FullscreenOutlined onClick={onFullScreen} title="全屏" />
            )}
          </Space>
        </Flex>
        {isExpanded && (
          <Flex className={styles.outlineContainer}>
            <Flex vertical gap={20}>
              <FileImageOutlined
                className={classNames(styles.navMode, { [styles.active]: navMode === 'thumbnail' })}
                onClick={() => setNavMode('thumbnail')}
                title="缩略"
              />
              <OrderedListOutlined
                className={classNames(styles.navMode, { [styles.active]: navMode === 'outline' })}
                onClick={() => setNavMode('outline')}
                title="目录"
              />
            </Flex>
            <Scrollbars style={{ width: 180, height: isFullScreen ? 'calc(100vh - 300px)' : 600 }}>
              {outlineLoaded && (
                <Flex
                  vertical
                  align="center"
                  gap={10}
                  className={classNames(styles.thumbnail, {
                    [styles.show]: navMode === 'thumbnail'
                  })}
                >
                  {times(numPages, i => {
                    const pageNumber = i + 1
                    return (
                      <div key={i} style={{ textAlign: 'center', position: 'relative' }}>
                        <Thumbnail
                          pageNumber={pageNumber}
                          key={i}
                          scale={0.2}
                          className={classNames(styles.thumbnailItem, {
                            [styles.selected]: selectedPages.includes(pageNumber)
                          })}
                          onClick={() => handlePageSelect(pageNumber)}
                        />
                        {isChecking && (
                          <div className={styles.pageCheck}>
                            {selectedPages.includes(pageNumber) ? (
                              <CheckSquareOutlined
                                onClick={() => handlePageSelect(pageNumber)}
                                title="已选择"
                              />
                            ) : (
                              <BorderOutlined
                                onClick={() => handlePageSelect(pageNumber)}
                                title="待选择"
                              />
                            )}
                          </div>
                        )}
                        {pageNumber}
                      </div>
                    )
                  })}
                </Flex>
              )}
              {documentLoaded && (
                <Outline
                  className={classNames(styles.outline, { [styles.show]: navMode === 'outline' })}
                  onLoadSuccess={() => setOutlineLoaded(true)}
                />
              )}
            </Scrollbars>
          </Flex>
        )}
        <Scrollbars style={{ minWidth: 850, height: isFullScreen ? 'calc(100vh - 300px)' : 600 }}>
          {isChecking && (
            <div className={styles.checkingInfo}>
              已进入选择模式，请在左侧目录或者缩略页面中选择指定章节或者页面，然后进行下载操作！
            </div>
          )}
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
  const [selectedPages, setSelectedPages] = useState<number[]>([])
  const [fileURL, setFileUrl] = useState<string>('')

  const activeArchive = find(list, item => item.id === activeId)
  const activeArchiveIndex = findIndex(list, item => item.id === activeId)

  const { data: archivePdf } = useRequest(() => viewArchiveFile({ id: activeId }, setProgress), {
    ready: !!activeId,
    refreshDeps: [activeId],
    onSuccess(res) {
      const url = res ? URL.createObjectURL(res) : ''
      setFileUrl(url)
    }
  })

  const { run: runGetPartialArchive } = useRequest(
    () => getArchiveFile({ id: activeId, selectedPages }),
    {
      manual: true,
      onSuccess(res) {
        fileDownload(
          res,
          activeArchive?.volume_part_num +
            (isEmpty(selectedPages) ? '' : `[${selectedPages.join('、')}]`) +
            '.pdf'
        )
      }
    }
  )

  const resetViewStatus = () => {
    setActiveId(0)
    setProgress(0)
  }

  const handleDownload = () => {
    if (archivePdf) {
      // if (selectedPages.length === 0) {
      //   fileDownload(archivePdf, activeArchive?.volume_part_num + '.pdf')
      // } else {
      //   runGetPartialArchive()
      // }
      runGetPartialArchive()
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
        {progress < 100 && renderLoading(progress)}
        <ArchiveViewer
          file={fileURL}
          filename={activeArchive?.volume_part_num || ''}
          isFullScreen={isFullScreen}
          onFullScreen={toggleFullScreen}
          selectedPages={selectedPages}
          setSelectedPages={setSelectedPages}
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

import { Document, Outline, Page, Thumbnail, pdfjs } from 'react-pdf'
import { Scrollbars } from 'react-custom-scrollbars'
import { useEffect, useState } from 'react'
import { times } from 'lodash'
import { Flex, Space } from 'antd'
import { DocumentCallback, File } from 'node_modules/react-pdf/dist/esm/shared/types'
import styles from './index.less'
import {
  FileImageOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  OrderedListOutlined
} from '@ant-design/icons'
import { useToggle } from 'ahooks'
import classNames from 'classnames'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface IProps {
  file: File
  filename: string
  isFullScreen: boolean
  onFullScreen: () => void
}

export default ({ file, filename, isFullScreen, onFullScreen }: IProps) => {
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

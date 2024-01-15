import { InboxOutlined } from '@ant-design/icons'
import type { UploadFile, UploadProps } from 'antd'
import { Alert, Button, Flex, Upload, message } from 'antd'
import { useState } from 'react'
import styles from './index.less'
import { useRequest } from 'ahooks'
import { archiveUpload } from '@/services/archive'
import { RcFile } from 'antd/es/upload'

const { Dragger } = Upload

export default () => {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [percent, setPercent] = useState(0)

  const { loading, run: runUpload } = useRequest(
    () => {
      const formData = new FormData()
      fileList.forEach(file => {
        formData.append('files', file.originFileObj as RcFile)
      })
      return archiveUpload(formData, setPercent)
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('导入成功')
        setFileList([])
      }
    }
  )

  const handleSubmit = () => {
    if (fileList.length === 0) {
      return message.warning('请先选择上传文件')
    }

    message.info('开始导入文件...')
    runUpload()
  }

  const uploadProps: UploadProps<UploadFile> = {
    name: 'file',
    multiple: true,
    maxCount: 5,
    accept: '.pdf',
    fileList,
    beforeUpload() {
      // 返回false在点击上传按钮时再传递文件
      return false
    },
    onChange(info) {
      const { fileList } = info
      console.log(fileList)

      const files = fileList.filter(file => {
        if (Number(file.size) > 50 * 1024 * 1024) {
          message.warning('文件大小不能超过50MB')
          return false
        }
        return true
      })
      setFileList(files)
    }
  }

  return (
    <div className={styles.importWrapper}>
      <Flex vertical gap={40} style={{ width: 600 }}>
        <Alert
          message="上传须知"
          description={
            <>
              <div>1. 文件格式: 仅支持PDF格式文件上传；</div>
              <div>2. 文件命名: 请规范文件上传命名规范，示例：公司名称-文件名称；</div>
              <div>3. 文件限制: 单次最多支持批量上传5个文件，单个文件大小不超过50MB；</div>
            </>
          }
          type="info"
          showIcon
        />
        <Dragger {...uploadProps} className={styles.upload} disabled={loading}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击上传</p>
        </Dragger>
        <Button
          type="primary"
          loading={loading}
          onClick={handleSubmit}
          className={styles.submitBtn}
        >
          {loading ? `导入中 ${percent}%` : '导入档案'}
        </Button>
      </Flex>
    </div>
  )
}

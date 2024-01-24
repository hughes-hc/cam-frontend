import { FilePdfTwoTone, InboxOutlined } from '@ant-design/icons'
import type { UploadFile, UploadProps } from 'antd'
import { Alert, Button, Empty, Flex, Select, Space, Upload, message } from 'antd'
import { useState } from 'react'
import styles from './index.less'
import { useRequest } from 'ahooks'
import { archiveUpload } from '@/services/archive'
import { RcFile } from 'antd/es/upload'
import { getCompaniesOptions } from '@/services/company'
import { map } from 'lodash'

const { Dragger } = Upload

interface IUploadFile extends UploadFile {
  company?: { value: string; label: string }
  archive_type?: number
}

const ArchiveUpload = () => {
  const [fileList, setFileList] = useState<IUploadFile[]>([])
  const [percent, setPercent] = useState(0)

  const { loading, run: runUpload } = useRequest(
    () => {
      const formData = new FormData()
      fileList.forEach(file => {
        console.log(file)

        formData.append('files', file.originFileObj as RcFile)
        formData.append('companyId', file.company?.value as string)
        formData.append('archiveType', String(file.archive_type) as string)
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

  const { data: companies = [], run: handleSearch } = useRequest(getCompaniesOptions, {
    manual: true,
    debounceMaxWait: 10000
  })

  const handleSubmit = () => {
    if (fileList.length === 0) {
      return message.warning('请先选择上传文件')
    }

    if (fileList.some(file => !file.company)) {
      return message.warning('请先选择企业名称')
    }

    message.info('开始导入文件...')
    runUpload()
  }

  const uploadProps: UploadProps<IUploadFile> = {
    name: 'file',
    multiple: true,
    maxCount: 5,
    accept: '.pdf',
    fileList,
    listType: 'picture',
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
    },
    iconRender: () => <FilePdfTwoTone style={{ fontSize: 20 }} />,
    itemRender(originNode, file: IUploadFile, fileList) {
      const { uid, company, archive_type } = file
      return (
        <Flex
          align="center"
          justify="space-between"
          gap={20}
          style={{ width: '100%', marginTop: 20 }}
        >
          <div className={styles.filItem}>{originNode}</div>
          <Select
            size="large"
            style={{ width: 200 }}
            allowClear
            showSearch
            labelInValue
            value={company}
            placeholder={'请输入企业名称'}
            defaultActiveFirstOption={false}
            suffixIcon={null}
            filterOption={false}
            onSearch={val => handleSearch({ name: val })}
            onChange={value => {
              setFileList(
                fileList.map(item => {
                  if (item.uid === uid) {
                    return {
                      ...item,
                      company: value
                    }
                  }
                  return item
                })
              )
            }}
            notFoundContent={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无数据" />}
            options={map(companies, ({ id, name }) => ({
              value: id,
              label: name
            }))}
          />
          <Select
            placeholder="请选择"
            size="large"
            style={{ width: 100 }}
            options={[
              { value: 'ESTABLISH', label: '设立' },
              { value: 'CHANGE', label: '变更' },
              { value: 'PLEDGE', label: '出质' },
              { value: 'CANCELLATION', label: '注销' },
              { value: 'OTHER', label: '其它' }
            ]}
            value={archive_type}
            onChange={value => {
              setFileList(
                fileList.map(item => {
                  if (item.uid === uid) {
                    return {
                      ...item,
                      archive_type: value
                    }
                  }
                  return item
                })
              )
            }}
          />
        </Flex>
      )
    }
  }

  return (
    <div className={styles.importWrapper}>
      <Flex vertical gap={40} style={{ width: 650 }}>
        <Alert
          message="上传须知"
          description={
            <>
              <div>1. 文件格式: 仅支持PDF格式文件上传；</div>
              <div>2. 文件限制: 单次最多支持批量上传5个文件，单个文件大小不超过50MB；</div>
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

const ArchiveUploadModal = () => {}

export default ArchiveUpload

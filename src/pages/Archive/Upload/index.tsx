import { archiveUpload } from '@/services/archive'
import { getCompaniesOptions } from '@/services/company'
import { FilePdfTwoTone, InboxOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import type { UploadFile, UploadProps } from 'antd'
import { Alert, Button, Empty, Flex, Modal, Select, Upload, message } from 'antd'
import { RcFile } from 'antd/es/upload'
import { map } from 'lodash'
import { useState } from 'react'
import styles from './index.less'
import CAMTitle from '@/components/CAMTitle'

const { Dragger } = Upload

interface IUploadFile extends UploadFile {
  company?: { value: string; label: string }
  archive_type?: number
}

interface IProps {
  isModal: boolean
  companyId?: string
  width?: number
  afterSubmit?: () => void
}

const ArchiveUpload = ({ isModal, companyId, afterSubmit, width = 650 }: IProps) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [fileList, setFileList] = useState<IUploadFile[]>([])
  const [percent, setPercent] = useState(0)

  const { loading, run: runUpload } = useRequest(
    () => {
      const formData = new FormData()
      fileList.forEach(file => {
        formData.append('files', file.originFileObj as RcFile)
        formData.append(
          'companyId',
          isModal ? (companyId as string) : (file.company?.value as string)
        )
        formData.append('archiveType', String(file.archive_type) as string)
      })
      return archiveUpload(formData, setPercent)
    },
    {
      manual: true,
      onSuccess: result => {
        if (isModal) {
          setModalVisible(false)
          message.success('导入成功')
          afterSubmit?.()
        } else {
          Modal.success({
            title: '导入成功',
            content: '即将跳转档案归集页面'
          })
          setTimeout(() => {
            Modal.destroyAll()
            setFileList([])
            map(result, (_, company_id) => {
              console.log(company_id)
              window.open(`/company/detail/${company_id}`, '_blank')
            })
          }, 1000)
        }
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

    if (!isModal && fileList.some(file => !file.company)) {
      return message.warning('请先选择企业名称')
    } else if (fileList.some(file => !file.archive_type)) {
      return message.warning('请先选择归档类型')
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
          {!isModal && (
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
              notFoundContent={
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <Flex vertical>
                      未查询到相关企业信息
                      <Button type="link" onClick={() => window.open('/company', '_blank')}>
                        前往新增
                      </Button>
                    </Flex>
                  }
                />
              }
              options={map(companies, ({ id, name }) => ({
                value: id,
                label: name
              }))}
            />
          )}
          <Select
            placeholder="类型"
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
          <div className={styles.filItem}>{originNode}</div>
        </Flex>
      )
    }
  }

  const commonNode = (
    <>
      <Alert
        message="上传须知"
        description={
          <>
            <div>1. 文件格式: 仅支持PDF格式文件上传；</div>
            <div>2. 文件限制: 单次最多支持批量上传5个文件，单个文件大小不超过50MB；</div>
            <div>3. 必填说明：{isModal ? '' : '企业名称和'}归档类型；</div>
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
    </>
  )

  if (isModal) {
    return (
      <>
        {modalVisible && (
          <Modal
            open={modalVisible}
            title="新增档案"
            onOk={handleSubmit}
            confirmLoading={loading}
            okText={loading ? `导入中 ${percent}%` : '确定'}
            onCancel={() => setModalVisible(false)}
          >
            <Flex vertical gap={40} className={styles.importWrapper}>
              {commonNode}
            </Flex>
          </Modal>
        )}
        <Button type="primary" onClick={() => setModalVisible(true)}>
          新增档案
        </Button>
      </>
    )
  } else {
    return (
      <Flex vertical>
        <CAMTitle title="档案导入" />
        <Flex
          vertical
          gap={40}
          justify="center"
          align="center"
          style={{ width, marginTop: 'calc(10%)' }}
          className={styles.importWrapper}
        >
          {commonNode}
          <Button
            type="primary"
            loading={loading}
            onClick={handleSubmit}
            className={styles.submitBtn}
          >
            {loading ? `导入中 ${percent}%` : '导入档案'}
          </Button>
        </Flex>
      </Flex>
    )
  }
}

export default ArchiveUpload

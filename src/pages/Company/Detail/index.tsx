import CAMTitle from '@/components/CAMTitle'
import ArchiveList from '@/pages/Archive/List'
import ArchiveUpload from '@/pages/Archive/Upload'
import { getArchivesList } from '@/services/archive'
import { getCompany } from '@/services/company'
import { useRequest } from 'ahooks'
import { Descriptions, Flex } from 'antd'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'
import { useParams } from 'umi'

export default () => {
  const { id } = useParams()
  const companyId = Number(id)

  const { data: companyInfo } = useRequest(() => getCompany({ id: companyId }))
  const { name, reg_num, social_credit_code, volume_num } = companyInfo || {}

  return (
    <Flex vertical>
      <CAMTitle title="企业信息详情" />
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
      <Flex justify="space-between" align="center" style={{ marginTop: 20 }}>
        <h3>档案列表</h3>
        <ArchiveUpload
          isModal
          companyId={String(companyId)}
          afterSubmit={() => window.location.reload()}
          width={650}
        />
      </Flex>
      <ArchiveList mode="detail" companyId={companyId} />
    </Flex>
  )
}

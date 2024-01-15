import { getCompany } from '@/services/company'
import { useRequest } from 'ahooks'
import { Descriptions, Flex } from 'antd'

export default () => {
  const { data } = useRequest(getCompany)
  const { name, reg_number, social_credit_code, volume_num } = data || {}

  return (
    <Flex>
      <Descriptions
        title={name}
        items={[
          {
            label: '企业注册号',
            children: reg_number
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
    </Flex>
  )
}

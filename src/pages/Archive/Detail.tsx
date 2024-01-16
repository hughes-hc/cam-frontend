import { getCompany } from '@/services/company'
import { useRequest } from 'ahooks'
import { Descriptions, Flex, List } from 'antd'
import { useParams } from 'umi'

export default () => {
  const { id } = useParams()
  const { data: companyInfo } = useRequest(() => getCompany({ id: Number(id) }))
  const { name, reg_num, social_credit_code, volume_num } = companyInfo || {}
  const { data: archiveInfo = [] } = useRequest(() => getCompany({ id: Number(id) }))

  return (
    <Flex vertical>
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
      {/* <List
        itemLayout="horizontal"
        dataSource={archiveInfo}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
              title={<a href="https://ant.design">{item.title}</a>}
              description="Ant Design, a design language for background applications, is refined by Ant UED Team"
            />
          </List.Item>
        )}
      /> */}
    </Flex>
  )
}

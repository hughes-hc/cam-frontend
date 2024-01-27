import { Divider, Flex, Typography } from 'antd'

interface IProps {
  title: string
}

const { Text } = Typography

export default ({ title }: IProps) => {
  return (
    <Flex vertical style={{ marginBottom: 20 }} gap={10}>
      <Text strong style={{ fontSize: 16, color: '#1677ff' }}>
        {title}
      </Text>
      <Divider type="horizontal" style={{ margin: 0, background: '#1677ff' }} />
    </Flex>
  )
}

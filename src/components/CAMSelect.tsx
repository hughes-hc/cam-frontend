import { Select, SelectProps, Space, Typography } from 'antd'
const { Text } = Typography

interface IProps extends SelectProps {
  label: string
  width?: number
  options: { label: string; value: any }[]
}

export default ({ label, width, options, value, onChange, ...restProps }: IProps) => {
  return (
    <Space>
      <Text>{label}</Text>
      <Select
        value={value ?? null}
        options={[{ label: '全部', value: null }, ...(options ?? [])]}
        onChange={onChange}
        style={{ width: width ?? 100 }}
        {...restProps}
      />
    </Space>
  )
}

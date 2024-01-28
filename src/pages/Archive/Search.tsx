import searchPng from '@/assets/images/search.png'
import CAMTitle from '@/components/CAMTitle'
import ArchiveList from '@/pages/Archive/List'
import { getCompaniesOptions } from '@/services/company'
import { useRequest } from 'ahooks'
import { AutoComplete, Empty, Flex, Image } from 'antd'
import { map } from 'lodash'
import { useState } from 'react'

export default () => {
  const [name, setName] = useState<string>('')
  const [id, setId] = useState<number>(0)

  const { data: companies } = useRequest(() => getCompaniesOptions({ name }), {
    refreshDeps: [name],
    debounceWait: 500
  })

  return (
    <Flex vertical>
      <CAMTitle title="档案查询" />
      <AutoComplete
        allowClear
        size="large"
        value={name}
        options={map(companies, ({ id, name }) => ({ value: id, label: name }))}
        onChange={value => setName(value)}
        onSelect={(id, { label }) => {
          setName(label)
          setId(Number(id))
        }}
        notFoundContent={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="未联想到数据" />}
        placeholder="请输入企业名称"
      />
      {name ? (
        <ArchiveList companyId={id} mode="search" />
      ) : (
        <Flex justify="center" align="center" style={{ marginTop: 100 }}>
          <Image src={searchPng} preview={false} />
        </Flex>
      )}
    </Flex>
  )
}

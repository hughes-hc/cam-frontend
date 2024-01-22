interface ICompanyItem {
  id: number
  name: string
  reg_num: string
  social_credit_code: string
  volume_num: number
  created_at: number
  updated_at: number
  // 当插入的数据已存在会表示为true
  exist?: boolean
}

type ICompanyForm = Partial<ICompanyItem>

interface IFilter {
  name: string
}

interface IFilterItem {
  id: number
  name: string
}

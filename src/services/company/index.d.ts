interface ICompanyItem {
  id: number
  name: string
  reg_num: string
  social_credit_code: string
  volume_num: number
  created_at: number
  updated_at: number
}

type ICompanyForm = Partial<ICompanyItem>

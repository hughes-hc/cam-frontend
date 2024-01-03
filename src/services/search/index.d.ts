interface IQuery {
  page: number
  page_size: number
  pattern: string
  order?: SortOrder
}

interface IFileItem {
  id: number
  filename: string
  company_reg_num: string
  upload_time: number
}

interface IDownloadParams {
  id: number
  filename: string
  is_seal?: boolean
}

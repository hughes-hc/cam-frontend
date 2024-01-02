interface IQuery {
  page: number
  page_size: number
  pattern: string
}

interface IFileItem {
  id: number
  filename: string
  company_reg_num: string
  upload_time: number
}

interface IDownloadParams {
  id: number
  is_seal?: boolean
}

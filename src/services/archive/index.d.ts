interface IFileItem {
  id: number
  filename: string
  company_reg_num: string
  upload_time: number
  [string: string]: string | boolean
}

interface IArchivesReq {
  companyId: number
}

interface IArchive {
  id: number
  volume_num: string
  volume_part_num: string
  reg_num: string
  volume_type: string
  pages: number
  upload_time: string
  // 归档日期
  archive_date: string
}

interface IDownloadParams {
  id: number
  filename: string
  is_seal?: boolean
}

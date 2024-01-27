interface IAuditItem {
  id: number
  action: AuditActionType
  resource: AuditResourceType
  user_id: number
  user_name: string
  ip_address: string
  user_agent: string
  result: boolean
  created_at: string
}

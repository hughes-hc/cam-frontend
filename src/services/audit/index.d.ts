interface IAuditItem {
  id: number
  action: AuditActionType
  resource: AuditResourceType
  description: string
  user_id: number
  user_name: string
  user_role: UserRoleType
  ip_address: string
  user_agent: string
  result: boolean
  created_at: string
}

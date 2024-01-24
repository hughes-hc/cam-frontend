interface IUser {
  id: number
  username: string
  password: string
  is_default: boolean
  role: User_Role
  email: string
  phone: string
  status: number
  last_login_time: Date
  created_time: Date
  updated_time: Date
}

interface IUserForm {
  id?: number
  username: string
  password: string
  role: User_Role
  email: string
  phone: string
  status: number
}

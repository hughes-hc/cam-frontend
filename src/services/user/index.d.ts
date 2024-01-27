interface IUserForm {
  username: string
  password: string
  role: string
  email: string
  phone: string
  status: string
}

interface IUser extends IUserForm {
  id: number
  is_default: boolean
  last_login_time: Date
  created_time: Date
  updated_time: Date
}
type IUserName = Pick<IUser, 'username'>

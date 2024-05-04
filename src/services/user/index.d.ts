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

interface IPasswordForm {
  id: number
  password: string // 当前登录用户密码
  new_password: string
  captcha_id: string
  captcha_code: string
}

interface IUserInfo extends IUser {}

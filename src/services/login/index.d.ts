interface ICaptcha {
  captcha_id: string
  captcha_data: string
}

interface ILoginParam {
  username: string
  password: string
  captcha_id?: ICaptcha['captcha_id']
  captcha_code: string
}

interface IUerInfo {
  access_token: string
}

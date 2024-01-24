export const validateNoSpaces = (rule: any, value: string) => {
  console.log(rule)
  if (value && value.includes(' ')) {
    return Promise.reject('输入内容不能包含空格')
  } else {
    return Promise.resolve()
  }
}

// 电话校验逻辑
export const validatePhone = (rule: any, value: string) => {
  if (
    value &&
    !/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(value)
  ) {
    return Promise.reject('请输入正确的手机号')
  } else {
    return Promise.resolve()
  }
}

// 邮箱校验逻辑
export const validateEmail = (rule: any, value: string) => {
  if (value && !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
    return Promise.reject('请输入正确的邮箱')
  } else {
    return Promise.resolve()
  }
}

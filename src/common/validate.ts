export const validateNoSpaces = (rule: any, value: string) => {
  console.log(rule)
  if (value && value.includes(' ')) {
    return Promise.reject('输入内容不能包含空格')
  } else {
    return Promise.resolve()
  }
}

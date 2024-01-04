import 'umi/typings'
declare module '*.svg' {
  const content: ReactComponent
  export default content
}

declare global {
  interface ITable<T> {
    items: T[]
    current: number
    total: number
  }

  interface IQuery {
    page: number
    page_size: number
    pattern: string
    order?: SortOrder
  }
}

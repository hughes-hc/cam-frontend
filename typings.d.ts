import 'umi/typings'
declare module '*.svg' {
  const content: ReactComponent
  export default content
}

declare global {
  interface ITable<T> {
    items: T[]
    current?: number
    total: number
  }

  interface IQuery<T = unknown> {
    page: number
    page_size: number
    pattern?: string
    pattern_by?: string
    order?: SortOrder
    order_by?: string
    filters?: Partial<T>
  }

  interface IParam {
    id: number
    selectedPages?: number[]
  }

  interface ICustomComProps<T> {
    value?: T
    onChange?: (value: T) => void
    disabled?: boolean
  }
}

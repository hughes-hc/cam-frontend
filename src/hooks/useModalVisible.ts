import { useCallback, useState } from 'react'

/**
 * 快速创建 antd 中 Modal 组件显示与隐藏的控制方法
 */
function useModalVisible<T = any>(): {
  visible: boolean
  show: (cb?: unknown, data?: T) => void
  hide: (cb?: unknown) => void
  setVisible: React.Dispatch<React.SetStateAction<boolean>>
  initialData?: T
} {
  const [visible, setVisible] = useState<boolean>(false)
  const [initialData, setInitialData] = useState<T>()

  const show = useCallback((cb?: unknown, data?: T) => {
    setVisible(true)
    setInitialData(data)
    if (typeof cb === 'function') {
      cb()
    }
  }, [])

  const hide = useCallback((cb?: unknown) => {
    setVisible(false)
    setInitialData(undefined)
    if (typeof cb === 'function') {
      cb()
    }
  }, [])

  return { visible, show, hide, setVisible, initialData }
}

export default useModalVisible

import { IRoute } from 'config/routes'

/**
 *
 * @param {number} currentPage 当前所在的页码
 * @param {number} currentItems 当前页的数据条数
 * @param {number} deleteCount 默认为1，删除的数据条数
 * @returns {number} 新的页码
 */
export const computeNextPage = (currentPage: number, currentItems: number, deleteCount = 1) => {
  const remainingItems = currentItems - deleteCount
  return remainingItems > 0 ? currentPage : Math.max(1, currentPage - 1)
}

export const getCaptchaUrl = (svgStr: string) => {
  const blob = new Blob([svgStr], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  return url
}

/**
 * 在嵌套的树形结构中搜索一个特定的值，并返回该值在树中的路径
 *
 * @param {Record<string, any>[]} items - 一个对象数组，每个对象都代表树中的一个节点，该节点可能有子节点。
 * @param {string} targetValue - 要在树中搜索的目标值
 * @param {string} pathKey - 用于标识节点路径的键名，默认为 'path'
 * @param {string} nestedKey - 用于标识子节点的键名，默认为 'children'
 * @returns {string[]} 函数返回一个字符串数组，表示从根节点到目标节点的路径
 */
export const findNestedPath = (
  items: Record<string, any>[],
  targetValue: string,
  pathKey: string = 'path',
  nestedKey: string = 'children'
): string[] => {
  const searchNestedPath = (nestedItems: Record<string, any>[], target: string): string[] =>
    nestedItems.reduce((acc: string[], item): string[] => {
      if (acc.length) return acc // 如果已找到路径，中断搜索
      if (item[pathKey] === target) return [...acc, item[pathKey]] // 找到匹配项
      if (item[nestedKey]) {
        // 如果存在嵌套项，继续递归搜索
        const nestedPath = searchNestedPath(item[nestedKey], target)
        if (nestedPath.length) return [...acc, item[pathKey], ...nestedPath]
      }
      return acc // 如果未找到，返回空数组
    }, [])

  return searchNestedPath(items, targetValue)
}

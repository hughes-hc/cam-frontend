/**
 *
 * @param {number} currentItems 当前页的数据条数
 * @param {number} currentPage 当前所在的页码
 * @param {number} deleteCount 默认为1，删除的数据条数
 * @returns {number} 新的页码
 */
export const computeNextPage = (currentPage: number, currentItems: number, deleteCount = 1) => {
  const remainingItems = currentItems - deleteCount
  return remainingItems > 0 ? currentPage : Math.max(1, currentPage - 1)
}

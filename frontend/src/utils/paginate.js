import _ from 'lodash'

export function paginage(items, currentPage, pageSize) {
  const startIndex = (currentPage - 1) * pageSize
  return _(items).slice(startIndex).take(pageSize).value()
}
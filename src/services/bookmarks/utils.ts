import { BTN } from '../bookmarks/types'

export const isDirectory = (node: BTN): boolean => node.url === undefined

export const isSimpleBookmark = (node: BTN): boolean => node.url !== undefined

export const isNonEmptyDirectory = (node: BTN): boolean => {
  return containsNonEmptyDirectories([node])
}

export const containsNonEmptyDirectories = (nodes: BTN[]): boolean => {
  return (
    nodes.find(e => e.url === undefined && e.children !== undefined && e.children.length > 0) !==
    undefined
  )
}

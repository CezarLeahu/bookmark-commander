import { BTN } from './types'

export const containsNonEmptyDirectories = (nodes: BTN[]): boolean => {
  return (
    nodes.find(e => e.url === undefined && e.children !== undefined && e.children.length > 0) !==
    undefined
  )
}

export const isDirectory = (node: BTN): boolean => node.url === undefined

export const isSimpleBookmark = (node: BTN): boolean => node.url !== undefined

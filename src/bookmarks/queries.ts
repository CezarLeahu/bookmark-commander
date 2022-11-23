import bookmarks = chrome.bookmarks
import { BTN } from './types'

export const parent = async (node: BTN): Promise<BTN> => {
  if (node === undefined || node.parentId === undefined) {
    console.log('Invalid node argument')
    throw new Error('Invalid node argument')
  }
  return (await bookmarks.get(node.parentId))[0]
}

export const parentPath = async (node?: BTN): Promise<BTN[]> => {
  if (node === undefined) {
    return []
  }
  const parents: BTN[] = []

  let n = node
  while (n?.parentId !== undefined && n.parentId !== '0') {
    n = (await bookmarks.get(n.parentId))[0]
    parents.unshift(n)
  }

  return parents
}

export const childrenAndParent = async (id: string): Promise<[BTN[], string | undefined]> => {
  const node = (await bookmarks.get(id))[0]
  if (node === undefined) {
    throw new Error('Node does not exist')
  }
  const children = await bookmarks.getChildren(id)

  return node.parentId === undefined
    ? [children, undefined]
    : [[{ title: '..', id: node.parentId }, ...children], node.parentId]
}

export const getTopNodes = async (): Promise<BTN[]> => {
  return await bookmarks.getChildren('0')
}

export const getNode = async (id: string): Promise<BTN> => {
  return (await bookmarks.get(id))[0]
}

export const getNodes = async (ids: string[]): Promise<BTN[]> => {
  return await bookmarks.get(ids)
}

export const getNodesWithImmediateChildren = async (ids: string[]): Promise<BTN[]> => {
  const nodes = await bookmarks.get(ids)
  const nodesWithChildren: BTN[] = await Promise.all(
    nodes.map(async node => {
      node.children = await bookmarks.getChildren(node.id)
      return node
    }),
  )
  return nodesWithChildren
}

export const isNonEmptyDirectory = async (id: string): Promise<boolean> => {
  return await containsNonEmptyDirectories([id])
}

export const containsNonEmptyDirectories = async (ids: string[]): Promise<boolean> => {
  const nodes = await getNodesWithImmediateChildren(ids)
  return (
    nodes.find(e => e.url === undefined && e.children !== undefined && e.children.length > 0) !==
    undefined
  )
}

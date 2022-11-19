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

export const children = async (nodeID: string): Promise<BTN[]> => {
  const node = (await bookmarks.get(nodeID))[0]
  const childNodes = await bookmarks.getChildren(nodeID)

  return node?.parentId === undefined
    ? childNodes
    : [{ title: '..', id: node.parentId }, ...childNodes]
}

export const getTopNodes = async (): Promise<BTN[]> => {
  return await bookmarks.getChildren('0')
}

export const getNode = async (id: string): Promise<BTN> => {
  return (await bookmarks.get(id))[0]
}

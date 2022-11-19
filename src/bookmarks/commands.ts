import bookmarks = chrome.bookmarks
import { BTN } from './types'

export const updateTitle = async (id: string, title: string): Promise<void> => {
  console.log(`updateTitle(id: ${id}, title: ${title})`)
  await bookmarks.update(id, { title })
}

export const update = async (node: BTN): Promise<void> => {
  console.log(`update(id: ${node.id}, title: ${node.title}, url: ${node.url ?? ''})`)
  await bookmarks.update(node.id, { title: node.title, url: node.url })
}

export const createBookmark = async (
  parentId: string,
  title: string,
  url: string,
  index?: number,
): Promise<BTN> => {
  console.log(`createBookmark(parentId: ${parentId}, title: ${title}, index: ${index ?? ''})`)
  return await bookmarks.create({ parentId, title, url, index })
}

export const createDir = async (parentId: string, title: string, index?: number): Promise<BTN> => {
  console.log(`createDir(parentId: ${parentId}, title: ${title}, index: ${index ?? ''})`)
  return await bookmarks.create({ parentId, title, index })
}

export const remove = async (id: string): Promise<void> => {
  console.log(`remove(id: ${id})`)
  return await bookmarks.remove(id)
}

export const removeAll = async (ids: string[]): Promise<void> => {
  console.log(`remove(ids: [${ids.join(', ')}])`)
  return (await Promise.all(ids.map(async id => await bookmarks.remove(id)))).reduce((a, b) => b)
}

export const move = async (id: string, parentId?: string, index?: number): Promise<BTN> => {
  console.log(`move(id: ${id}, parentId: ${parentId ?? ''}, index: ${index ?? ''})`)
  return await bookmarks.move(id, { parentId, index })
}

export const search = async (query: string): Promise<BTN[]> => {
  console.log(`search(query: ${query})`)
  return await bookmarks.search(query)
}

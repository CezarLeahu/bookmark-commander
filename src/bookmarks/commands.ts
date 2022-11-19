import bookmarks = chrome.bookmarks
import { BTN } from './types'

export const updateTitle = async (id: string, title: string): Promise<void> => {
  console.log(`updateTitle(id: ${id}, title: ${title})`)
  // bookmarks.update(id, { title })
}

export const update = async (node: BTN): Promise<void> => {
  console.log(`update(id: ${node.id}, title: ${node.title}, url: ${node.url ?? ''})`)
  // bookmarks.update(node.id, { title: node.title, url: node.url })
}

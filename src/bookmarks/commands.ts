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

export const moveAll = async (ids: string[], parentId: string): Promise<BTN[]> => {
  console.log(`move(${ids.length} items, parentId: ${parentId})`)
  if (ids.filter(id => id === parentId).length !== 0) {
    throw new Error('Cannot move directory into itself')
  }
  return await Promise.all(ids.map(async id => await bookmarks.move(id, { parentId })))
}

export const moveUp = async (ids: string[]): Promise<boolean> => {
  console.log(`moveUp(${ids.length} items)`)

  const nodes = (await bookmarks.get(ids))
    .filter(n => n.index !== undefined)
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))

  const parentIds = nodes.filter(n => n.parentId !== undefined).map<string>(n => n.parentId ?? '0')
  if (new Set(parentIds).size > 1) {
    throw new Error('moveUp(): cannot move elements from multiple directories')
  }

  if (nodes[0].index === 0) {
    console.log('moveUp(): reached the index limit')
    return false
  }

  const results: BTN[] = []
  for (const n of nodes) {
    results.push(await bookmarks.move(n.id, { index: (n.index ?? 0) - 1 }))
  }

  for (let i = 0; i < nodes.length; ++i) {
    if (nodes[i].id !== results[i].id) {
      console.log(`moveUp() failed: order mismatch on id ${nodes[i].id}`)
    }
    if (nodes[i].index === results[i].index) {
      console.log(
        `moveUp() failed on id ${nodes[i].id} - index ${nodes[i].index ?? 0} not updated (title: ${
          nodes[i].title
        })}`,
      )
    }
  }

  return true
}

export const moveDown = async (ids: string[]): Promise<boolean> => {
  console.log(`moveDown(${ids.length} items)`)

  const nodes = (await bookmarks.get(ids))
    .filter(n => n.index !== undefined)
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))

  const parentIds = nodes.filter(n => n.parentId !== undefined).map<string>(n => n.parentId ?? '0')
  if (new Set(parentIds).size > 1) {
    throw new Error('moveDown(): cannot move elements from multiple directories')
  }

  const childrenInParent = (await bookmarks.getChildren(parentIds[0]))
    .filter(n => n.index !== undefined)
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))

  if ((nodes.at(-1)?.index ?? 0) + 1 >= childrenInParent.length) {
    console.log('moveDown(): reached the index limit')
    return false
  }

  for (const n of nodes) {
    if (n.index !== undefined) {
      await bookmarks.move(childrenInParent[n.index + 1].id, { index: n.index })
    }
  }

  const results: BTN[] = (await bookmarks.get(ids))
    .filter(n => n.index !== undefined)
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
  for (let i = 0; i < nodes.length; ++i) {
    if (nodes[i].id !== results[i].id) {
      console.log(`moveDown() failed: order mismatch on id ${nodes[i].id}`)
    }
    if (nodes[i].index === results[i].index) {
      console.log(
        `moveDown() failed on id ${nodes[i].id} - index ${
          nodes[i].index ?? 0
        } not updated (title: ${nodes[i].title})}`,
      )
    }
  }

  return true
}

export const search = async (query: string): Promise<BTN[]> => {
  console.log(`search(query: ${query})`)
  return await bookmarks.search(query)
}

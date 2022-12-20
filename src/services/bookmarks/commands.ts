// import * as bookmarks from '../mocks/bookmarks'

import { BTN } from './types'
import { parentPath } from './queries'

import bookmarks = chrome.bookmarks

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

  if (parentId !== undefined) {
    await checkDestinationValid([id], parentId)
  }

  return await bookmarks.move(id, { parentId, index })
}

export const moveAll = async (ids: string[], parentId?: string, index?: number): Promise<BTN[]> => {
  console.log(`move(${ids.length} items, parentId: ${parentId ?? ''}, index: ${index ?? ''})`)

  if (parentId !== undefined) {
    await checkDestinationValid(ids, parentId)
  }

  return await Promise.all(ids.map(async id => await bookmarks.move(id, { parentId, index })))
  // const res: BTN[] = []
  // for (const id of ids) {
  //   res.push(await bookmarks.move(id, { parentId, index }))
  // }
  // return res
}

const checkDestinationValid = async (ids: string[], targetId: string): Promise<void> => {
  if (targetId === '0') {
    throw new Error('Moving items into the root directory is not supported')
  }

  if (ids.filter(id => id === targetId).length !== 0) {
    throw new Error('Target directory is same as the moved element')
  }

  const targetNode = (await bookmarks.get(targetId))[0]
  if (targetNode.url !== undefined) {
    throw new Error('Target directory is not a directory')
  }

  const nodes = (await bookmarks.get(ids)).filter(n => n.url === undefined)
  if (nodes.length === 0) {
    // no directories - following checks not needed
    return
  }

  const targetParentIds = new Set((await parentPath(targetNode)).map(n => n.id))

  if (nodes.map(n => n.id).filter(id => targetParentIds.has(id)).length !== 0) {
    throw new Error('Target directory is a child element')
  }
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

  for (const n of nodes) {
    await bookmarks.move(n.id, { index: (n.index ?? 0) - 1 })
  }

  return true
}

export const moveDown = async (ids: string[]): Promise<boolean> => {
  console.log(`moveDown(${ids.length} items)`)

  const nodes = (await bookmarks.get(ids))
    .filter(n => n.index !== undefined)
    .sort((a, b) => (b.index ?? 0) - (a.index ?? 0))

  const parentIds = nodes.filter(n => n.parentId !== undefined).map<string>(n => n.parentId ?? '0')
  if (new Set(parentIds).size > 1) {
    throw new Error('moveDown(): cannot move elements from multiple directories')
  }

  const childrenInParent = await bookmarks.getChildren(parentIds[0])

  if ((nodes[0].index ?? childrenInParent.length) + 1 >= childrenInParent.length) {
    console.log('moveDown(): reached the index limit')
    return false
  }

  for (const n of nodes) {
    if (n.index !== undefined) {
      const childBelow = childrenInParent[n.index + 1]
      await bookmarks.move(childBelow.id, { index: n.index })

      childrenInParent[n.index + 1] = childrenInParent[n.index]
      childrenInParent[n.index] = childBelow
    }
  }

  return true
}

export const search = async (query: string): Promise<BTN[]> => {
  console.log(`search(query: ${query})`)
  return await bookmarks.search(query)
}

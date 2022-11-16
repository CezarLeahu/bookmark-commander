export const parent = async (
  node: chrome.bookmarks.BookmarkTreeNode,
): Promise<chrome.bookmarks.BookmarkTreeNode> => {
  if (node === undefined || node.parentId === undefined) {
    console.log('Invalid node argument')
    throw new Error('Invalid node argument')
  }
  return (await chrome.bookmarks.get(node.parentId))[0]
}

export const parentPath = async (
  node?: chrome.bookmarks.BookmarkTreeNode,
): Promise<chrome.bookmarks.BookmarkTreeNode[]> => {
  if (node === undefined) {
    return []
  }
  const parents: chrome.bookmarks.BookmarkTreeNode[] = []

  let n = node
  while (n?.parentId !== undefined && n.parentId !== '0') {
    n = (await chrome.bookmarks.get(n.parentId))[0]
    parents.push(n)
  }

  return parents
}

export const children = async (nodeID: string): Promise<chrome.bookmarks.BookmarkTreeNode[]> => {
  const node = (await chrome.bookmarks.get(nodeID))[0]
  const childrenNodes = await chrome.bookmarks.getChildren(nodeID)

  return [
    {
      title: '..',
      id: node.parentId ?? '0',
    },
    ...childrenNodes,
  ]
}

import { RowDragEndEvent, RowDragLeaveEvent, RowDragMoveEvent, RowNode } from 'ag-grid-community'
import { dropInfo, moveInfo } from './utils'

import { BTN } from '../../services/bookmarks/types'
import { FolderPanelMetadata } from './metadata'
import { moveAll } from '../../services/bookmarks/commands'

export const handleRowDragMove = (
  e: RowDragMoveEvent<BTN>,
  meta: FolderPanelMetadata,
  currentNodeId: string,
  rows: chrome.bookmarks.BookmarkTreeNode[],
): void => {
  // if current panel is in the root dir: skip (not supported) // todo enable for DND
  if (currentNodeId === '0') {
    return
  }

  // if any of the draged rows are the '..' (parent dir) row: skip
  if (e.nodes.filter(n => n.childIndex === 0).length > 0) {
    return
  }

  // if the dragged rows are immediatelly under the root
  if (e.node.data?.parentId === '0') {
    return
  }

  if (e.nodes.filter(n => n === e.overNode).length !== 0) {
    meta.resetPotentialParentAndRefresh(e.api)
    return
  }

  const info = moveInfo(e, rows.length)
  if (info === undefined) {
    meta.resetPotentialParentAndRefresh(e.api)
    return
  }

  e.api.forEachNode(n => n.setHighlighted(null))

  const overNode: RowNode<BTN> | undefined =
    e.overNode ?? e.api.getRowNode(rows[info.highlightedRowIndex].id)

  if (overNode === undefined) {
    meta.resetPotentialParentAndRefresh(e.api)
    return
  }

  overNode.setHighlighted(info.position)

  if (info.position !== null) {
    meta.resetPotentialParentAndRefresh(e.api)
    return
  }

  if (overNode !== meta.potentialParent) {
    meta.setPotentialParentAndRefresh(e.api, overNode)
  }
}

export const handleRowDragLeave = (e: RowDragLeaveEvent<BTN>, meta: FolderPanelMetadata): void => {
  meta.resetPotentialParentAndRefresh(e.api)
  e.api.forEachNode(n => n.setHighlighted(null))
}

export const handleRowDragEnd = (
  e: RowDragEndEvent<BTN>,
  meta: FolderPanelMetadata,
  currentNodeId: string,
  rows: chrome.bookmarks.BookmarkTreeNode[],
  setSelectionModel: (model: string[]) => void,
  refreshRows: () => void,
): void => {
  meta.resetPotentialParentAndRefresh(e.api)
  e.api.forEachNode(n => n.setHighlighted(null))

  // if current panel is in the root dir: skip (not supported) // todo enable for DND
  if (currentNodeId === '0') {
    return
  }

  // if any of the draged rows are the '..' (parent dir) row: skip
  if (e.nodes.filter(n => n.childIndex === 0).length > 0) {
    return
  }

  // if the dragged rows are immediatelly under the root
  if (e.node.data?.parentId === '0') {
    return
  }

  // if moving rows over themselves: skip
  if (e.nodes.filter(n => n === e.overNode).length !== 0) {
    return
  }

  // if e.node is missing, there's nothing to move
  if (e.node === undefined || e.node.data === undefined) {
    return
  }

  const nodeData: BTN = e.node.data
  const ids = e.nodes.map(n => n.data?.id ?? undefined).filter(e => e !== undefined) as string[]

  const { dropIntoDir, dropAtIndex } = dropInfo(e, rows.length)

  // when moving items into a child folder...
  if (dropIntoDir) {
    const targetDir = e.overNode?.data
    // if target node not found: skip
    if (targetDir === undefined) {
      console.log('Target node not available')
      return
    }

    // if source items location is the same as the target directory, skip
    if (targetDir.id === nodeData.parentId) {
      console.log('The source and target directories are the same')
      return
    }

    // if any of the draged items (dirs) are the same as the target dir, skip
    if (ids.filter(id => id === targetDir.id).length > 0) {
      console.log('A directory cannot be moved into itself')
      return
    }

    moveAll(ids, targetDir.id)
      .then(() => {
        console.log('Moved elements (into child dir)')
        refreshRows()
      })
      .catch(e => console.log(e))
    return
  }

  // when moving item into the same directory...
  if (currentNodeId === nodeData.parentId) {
    const directionUp: boolean =
      dropAtIndex !== undefined &&
      e.nodes.filter(n => n.childIndex < (dropAtIndex ?? 0) + 1).length === 0

    moveAll(directionUp ? ids.reverse() : ids, undefined, dropAtIndex)
      .then(() => {
        console.log('Moved elements (same directory)')
        setSelectionModel(ids)
        refreshRows()
      })
      .catch(e => console.log(e))
    return
  }

  // when moving item into a different directory...
  moveAll(ids.reverse(), currentNodeId, dropAtIndex)
    .then(() => {
      console.log('Moved elements (into dir)')
      setSelectionModel(ids)
      refreshRows()
    })
    .catch(e => console.log(e))
}

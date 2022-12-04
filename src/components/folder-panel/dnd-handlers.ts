import { RowDragEndEvent, RowDragLeaveEvent, RowDragMoveEvent, RowNode } from 'ag-grid-community'
import { dropInfo, moveInfo } from './utils'

import { BTN } from '../../services/bookmarks/types'
import { FolderPanelMetadata } from './metadata'
import { RowDropZoneEvents } from 'ag-grid-community/dist/lib/gridBodyComp/rowDragFeature'
import { moveAll } from '../../services/bookmarks/commands'
import { useCallback } from 'react'

export function useRowDropZoneEvents(
  meta: FolderPanelMetadata,
  currentNodeId: string,
  forceUpdate: () => void,
  rows: chrome.bookmarks.BookmarkTreeNode[],
): RowDropZoneEvents {
  const handleRowDragMove = useCallback(
    (e: RowDragMoveEvent<BTN>): void => {
      if (currentNodeId === '0' || e.node.childIndex === 0) {
        meta.resetPotentialParentAndRefresh(e.api)
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

      const node: RowNode<BTN> | undefined =
        e.overNode ?? e.api.getRowNode(rows[info.highlightedRowIndex].id)

      if (node === undefined) {
        meta.resetPotentialParentAndRefresh(e.api)
        return
      }

      node.setHighlighted(info.position)

      if (info.position !== null) {
        meta.resetPotentialParentAndRefresh(e.api)
        return
      }

      if (node !== meta.potentialParent) {
        meta.setPotentialParentAndRefresh(e.api, node)
      }
    },
    [meta, currentNodeId, rows],
  )

  const handleRowDragLeave = useCallback(
    (e: RowDragLeaveEvent<BTN>) => {
      meta.resetPotentialParentAndRefresh(e.api)
      e.api.forEachNode(n => n.setHighlighted(null))
    },
    [meta],
  )

  const handleRowDragEnd = useCallback(
    (e: RowDragEndEvent<BTN>) => {
      meta.resetPotentialParentAndRefresh(e.api)
      e.api.forEachNode(n => n.setHighlighted(null))

      if (currentNodeId === '0' || e.node.childIndex === 0) {
        return
      }

      if (e.nodes.filter(n => n === e.overNode).length !== 0) {
        return
      }

      const info = dropInfo(e, rows.length)
      if (info === undefined) {
        return
      }

      if (info.isDir && e.overNode === undefined) {
        console.log('Target node not available')
        return
      }

      console.log('handleRowDragEnd()', info)

      const parentId: string | undefined = info.isDir
        ? e.overNode?.data?.id ?? undefined
        : undefined

      const ids = e.nodes.map(n => n.data?.id ?? undefined).filter(e => e !== undefined) as string[]
      const directionUp: boolean =
        info.index !== undefined &&
        e.nodes.filter(n => n.childIndex < (info.index ?? 0) + 1).length === 0 // todo check if the target dir is the current dir (when enabling the second dnd zone)
      moveAll(directionUp ? ids.reverse() : ids, parentId, info.index)
        .then(() => {
          console.log('Moved elements')
          forceUpdate()
        })
        .catch(e => console.log(e))
    },
    [meta, currentNodeId, rows, forceUpdate],
  )

  return {
    onDragging: handleRowDragMove,
    onDragLeave: handleRowDragLeave,
    onDragStop: handleRowDragEnd,
  }
}

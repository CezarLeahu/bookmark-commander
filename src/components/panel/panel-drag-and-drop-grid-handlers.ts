import { RowDragEndEvent, RowDragLeaveEvent, RowDragMoveEvent, RowNode } from 'ag-grid-community'
import { dropInfo, moveInfo } from './panel-drag-and-drop-calculations'
import { useSelectNodeId, useSelectRows } from '../../store/panel-state-hooks'

import { BTN } from '../../services/bookmarks/types'
import { FolderPanelMetadata } from './panel-metadata'
import { Side } from '../../services/utils/types'
import { moveAll } from '../../services/bookmarks/commands'
import { refreshApp } from '../../store/app-state-reducers'
import { useAppDispatch } from '../../store/hooks'
import { useCallback } from 'react'

export interface DragAndDropHandlers {
  handleRowDragMove: (e: RowDragMoveEvent<BTN>) => void
  handleRowDragLeave: (e: RowDragLeaveEvent<BTN>) => void
  handleRowDragEnd: (e: RowDragEndEvent<BTN>) => void
}

export function useDragAndDropHandlers(side: Side, meta: FolderPanelMetadata): DragAndDropHandlers {
  const dispatch = useAppDispatch()
  const currentNodeId = useSelectNodeId(side)
  const rows = useSelectRows(side)

  return {
    handleRowDragMove: useCallback(
      (e: RowDragMoveEvent<BTN>): void => {
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

        if (!meta.sameAsPotentialParent(overNode)) {
          meta.setPotentialParentAndRefresh(e.api, overNode)
        }
      },
      [meta, currentNodeId, rows],
    ),

    handleRowDragLeave: useCallback(
      (e: RowDragLeaveEvent<BTN>): void => {
        meta.resetPotentialParentAndRefresh(e.api)
        e.api.forEachNode(n => n.setHighlighted(null))
      },
      [meta],
    ),

    handleRowDragEnd: useCallback(
      (e: RowDragEndEvent<BTN>): void => {
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
        const ids = e.nodes
          .map(n => n.data?.id ?? undefined)
          .filter(e => e !== undefined) as string[]

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
              dispatch(refreshApp())
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
              ids
                .map(id => e.api.getRowNode(id))
                .filter(n => n !== undefined)
                .forEach(n => n?.setSelected(true))
              dispatch(refreshApp())
            })
            .catch(e => console.log(e))
          return
        }

        // when moving item into a different directory...
        moveAll(ids.reverse(), currentNodeId, dropAtIndex)
          .then(() => {
            console.log('Moved elements (into dir)')
            ids
              .map(id => e.api.getRowNode(id))
              .filter(n => n !== undefined)
              .forEach(n => n?.setSelected(true))
            dispatch(refreshApp())
          })
          .catch(e => console.log(e))
      },
      [dispatch, meta, currentNodeId, rows],
    ),
  }
}
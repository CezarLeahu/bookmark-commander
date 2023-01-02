import { ComponentStateChangedEvent, GridApi, RowNode } from 'ag-grid-community'
import { childrenAndParent, getNode, parentPath } from '../../services/bookmarks/queries'
import { updateBreadcrumbs, updateNode, updateRows } from '../../store/panel-state-reducers'
import { useCallback, useEffect } from 'react'
import {
  useSearchResultSelection,
  useSelectAppOutdated,
  useSelectIsHighlighted,
} from '../../store/app-state-hooks'
import { useSelectNode, useSelectNodeId } from '../../store/panel-state-hooks'

import { BTN } from '../../services/bookmarks/types'
import { Side } from '../../services/utils/types'
import { TITLE_COLUMN } from './panel-metadata'
import { clearSearchResultSelection } from '../../store/app-state-reducers'
import { useAppDispatch } from '../../store/hooks'

export function useLoadPanelContentEffect(side: Side): void {
  const dispatch = useAppDispatch()

  const appOutdated = useSelectAppOutdated()
  const nodeId = useSelectNodeId(side)

  const node = useSelectNode(side)

  useEffect(() => {
    getNode(nodeId).then(
      node => dispatch(updateNode({ side, node })),
      e => console.log(e),
    )
  }, [dispatch, side, nodeId])

  useEffect(() => {
    parentPath(node).then(
      nodes => dispatch(updateBreadcrumbs({ side, nodes })),
      e => console.log(e),
    )
  }, [dispatch, side, node])

  useEffect(() => {
    childrenAndParent(nodeId).then(
      ([nodes]) => dispatch(updateRows({ side, nodes })),
      e => console.log(e),
    )
  }, [dispatch, side, nodeId, appOutdated])
}

export function useComponenetStateChangedHandler(
  side: Side,
): (event: ComponentStateChangedEvent<BTN>) => void {
  const dispatch = useAppDispatch()
  const highlighted = useSelectIsHighlighted(side)
  const searchResultSelection = useSearchResultSelection()

  return useCallback(
    (event: ComponentStateChangedEvent<BTN>) => {
      if (!highlighted) {
        event.api.clearFocusedCell()
        return
      }
      if (event.api.getDisplayedRowCount() === 0) {
        return
      }

      if (searchResultSelection.current !== undefined) {
        setTimeout(() => {
          if (searchResultSelection.current === undefined) {
            return
          }
          dispatch(clearSearchResultSelection())
          const row = event.api.getRowNode(searchResultSelection.current.id)
          if (row === undefined) {
            return
          }
          focusRow(event.api, row)
          row.setSelected(true, true)
        }, 100)
        return
      }

      const oldFocusedIndex = retrieveFocusedIndexOrZero(event.api)
      focusIndex(event.api, oldFocusedIndex)
    },
    [dispatch, highlighted, searchResultSelection],
  )
}

function retrieveFocusedIndexOrZero(api: GridApi<chrome.bookmarks.BookmarkTreeNode>): number {
  const index = api.getFocusedCell()?.rowIndex ?? -1
  return index >= 0 && index < api.getModel().getRowCount() ? index : 0
}

function focusIndex(api: GridApi<chrome.bookmarks.BookmarkTreeNode>, index: number): void {
  api.setFocusedCell(index, TITLE_COLUMN)
  api.ensureIndexVisible(index)
}

function focusRow(api: GridApi<chrome.bookmarks.BookmarkTreeNode>, row: RowNode<BTN>): void {
  api.setFocusedCell(row.rowIndex ?? 0, TITLE_COLUMN)
  api.ensureNodeVisible(row)
}

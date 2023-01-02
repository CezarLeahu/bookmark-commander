import { GridApi, RowDoubleClickedEvent, RowSelectedEvent } from 'ag-grid-community'
import { useSelectNode, useSelectSelectionIds } from '../../store/panel-state-hooks'

import { BTN } from '../../services/bookmarks/types'
import { Side } from '../../services/utils/types'
import { TITLE_COLUMN } from './panel-metadata'
import { openInNewTab } from '../../services/tabs/tabs'
import { updateNodeId } from '../../store/panel-state-reducers'
import { useAppDispatch } from '../../store/hooks'
import { useCallback } from 'react'

interface ClickHandlers {
  handleRowClick: (event: RowSelectedEvent<BTN>) => void
  handleRowDoubleClick: (event: RowDoubleClickedEvent<BTN>) => void
}

export function useGridClickHandlers(side: Side, api: GridApi<BTN> | undefined): ClickHandlers {
  const dispatch = useAppDispatch()
  const currentNode = useSelectNode(side)

  const oldSelectionIds: string[] = useSelectSelectionIds(side)

  return {
    handleRowClick: useCallback(
      (event: RowSelectedEvent<BTN>): void => {
        const id = event.node.id
        if (id === undefined) {
          return
        }
        const oldIds = new Set<string>(oldSelectionIds)
        if (oldIds.has(id)) {
          event.node.setSelected(false)
        }
      },
      [oldSelectionIds],
    ),

    handleRowDoubleClick: useCallback(
      (event: RowDoubleClickedEvent<BTN>): void => {
        const node = event.data
        if (node === undefined) {
          return
        }
        switch (node.url) {
          case undefined: // folder
            dispatch(updateNodeId({ side, id: String(node.id) }))
            if (node.id === currentNode?.parentId) {
              setTimeout(() => {
                if (api === undefined) {
                  return
                }
                const index = api.getRowNode(currentNode.id)?.rowIndex ?? undefined
                if (index !== undefined) {
                  api.setFocusedCell(index, TITLE_COLUMN)
                }
              }, 100)
            }
            break
          default: // actual bookmark - open in new tab
            openInNewTab(node.url, true)
        }
      },
      [dispatch, side, api, currentNode],
    ),
  }
}

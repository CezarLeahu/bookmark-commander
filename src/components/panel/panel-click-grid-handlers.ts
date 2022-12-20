import { RowDoubleClickedEvent, RowSelectedEvent } from 'ag-grid-community'

import { BTN } from '../../services/bookmarks/types'
import { Side } from '../../services/utils/types'
import { openInNewTab } from '../../services/tabs/tabs'
import { updateNodeId } from '../../store/panel-state-reducers'
import { useAppDispatch } from '../../store/hooks'
import { useCallback } from 'react'
import { useSelectSelectionIds } from '../../store/panel-state-hooks'

interface ClickHandlers {
  handleRowClick: (event: RowSelectedEvent<BTN>) => void
  handleRowDoubleClick: (event: RowDoubleClickedEvent<BTN>) => void
}

export function useGridClickHandlers(side: Side): ClickHandlers {
  const dispatch = useAppDispatch()

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
            break
          default: // actual bookmark - open in new tab
            openInNewTab(node.url, true)
        }
      },
      [dispatch, side],
    ),
  }
}

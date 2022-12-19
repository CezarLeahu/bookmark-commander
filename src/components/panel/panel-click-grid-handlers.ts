import { RowDoubleClickedEvent, RowSelectedEvent } from 'ag-grid-community'

import { BTN } from '../../services/bookmarks/types'
import { Side } from '../../services/utils/types'
import { openInNewTab } from '../../services/tabs/tabs'
import { updateNodeId } from '../../store/panel-state-reducers'
import { useAppDispatch } from '../../store/hooks'
import { useCallback } from 'react'

interface ClickHandlers {
  handleRowClick: (event: RowSelectedEvent<BTN>) => void
  handleRowDoubleClick: (event: RowDoubleClickedEvent<BTN>) => void
}

export function useGridClickHandlers(side: Side): ClickHandlers {
  const dispatch = useAppDispatch()

  return {
    handleRowClick: useCallback((event: RowSelectedEvent<BTN>): void => {
      // TODO remove
      if (event.node === undefined) {
        console.log('Clicked into the void...')
      }
    }, []),

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

import { GridApi, RowDoubleClickedEvent, RowSelectedEvent } from 'ag-grid-community'

import { BTN } from '../../services/bookmarks/types'
import { openInNewTab } from '../../services/tabs/tabs'
import { useCallback } from 'react'

interface ClickHandlers {
  handleRowClick: (event: RowSelectedEvent<BTN>) => void
  handleRowDoubleClick: (event: RowDoubleClickedEvent<BTN>) => void
  handleEmptySpaceClick: () => void
}

export function useGridClickHandlers(
  highlightSide: () => void,
  currentNode: BTN | undefined,
  setCurrentNodeId: (id: string) => void,

  api?: GridApi,
): ClickHandlers {
  return {
    handleRowClick: useCallback(
      (event: RowSelectedEvent<BTN>): void => {
        highlightSide()
        const node = event.node
        if (node.id === currentNode?.parentId) {
          node.setSelected(false)
          return
        }
        node.setSelected(true)
      },
      [highlightSide, currentNode],
    ),

    handleRowDoubleClick: useCallback(
      (event: RowDoubleClickedEvent<BTN>): void => {
        const node = event.data
        if (node === undefined) {
          return
        }
        switch (node.url) {
          case undefined: // folder
            setCurrentNodeId(String(node.id))
            break
          default: // actual bookmark - open in new tab
            openInNewTab(node.url, true)
        }
      },
      [setCurrentNodeId],
    ),

    handleEmptySpaceClick: useCallback((): void => {
      if (api === undefined) {
        return
      }
      highlightSide()
    }, [highlightSide, api]),
  }
}

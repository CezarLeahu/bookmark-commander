import { GridApi, RowDoubleClickedEvent, RowSelectedEvent } from 'ag-grid-community'

import { BTN } from '../../services/bookmarks/types'
import { useCallback } from 'react'

interface ClickHandlers {
  handleRowClick: (event: RowSelectedEvent<BTN>) => void
  handleRowDoubleClick: (event: RowDoubleClickedEvent<BTN>) => void
  handleEmptySpaceClick: () => void
}

export function useGridClickHandlers(
  highlightSide: () => void,
  setCurrentNodeId: (id: string) => void,
  setSelectionModel: (model: string[]) => void,

  api?: GridApi,
): ClickHandlers {
  return {
    handleRowClick: useCallback(
      (event: RowSelectedEvent<BTN>): void => {
        highlightSide()
        setSelectionModel(event.api.getSelectedRows().map(n => n.id))
      },
      [highlightSide, setSelectionModel],
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
            chrome.tabs.create({ url: node.url }).catch(e => console.log(e))
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

import { Dispatch, SetStateAction, useCallback } from 'react'
import {
  GridApi,
  RowDoubleClickedEvent,
  RowSelectedEvent,
  SelectionChangedEvent,
} from 'ag-grid-community'

import { BTN } from '../../services/bookmarks/types'

interface ClickHandlers {
  handleRowClick: (event: RowSelectedEvent<BTN>) => void

  handleRowDoubleClick: (event: RowDoubleClickedEvent<BTN>) => void

  handleSelectionChanged: (event: SelectionChangedEvent<BTN>) => void

  handleMouseUpOnEmptySpace: () => void
}

export function useClickHandlers(
  onSelect: (node?: BTN) => void,
  setCurrentNodeId: (id: string) => void,
  setSelectionModel: (model: string[]) => void,
  setError: Dispatch<SetStateAction<string | undefined>>,
  api?: GridApi,
): ClickHandlers {
  return {
    handleRowClick: useCallback(
      (event: RowSelectedEvent<BTN>): void => {
        const node = event.data
        if (node !== undefined) {
          onSelect(node)
        }
      },
      [onSelect],
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
            chrome.tabs.create({ url: node.url }).catch(e => setError(e))
        }
      },
      [setCurrentNodeId, setError],
    ),

    handleSelectionChanged: useCallback(
      (event: SelectionChangedEvent<BTN>): void => {
        setSelectionModel(event.api.getSelectedRows().map(n => n.id))
      },
      [setSelectionModel],
    ),

    handleMouseUpOnEmptySpace: useCallback((): void => {
      if (api === undefined) {
        return
      }
      setSelectionModel([])
      onSelect()
      api.deselectAll()
    }, [onSelect, setSelectionModel, api]),
  }
}

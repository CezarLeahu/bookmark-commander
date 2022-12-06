import {
  GridApi,
  RowDoubleClickedEvent,
  RowSelectedEvent,
  SelectionChangedEvent,
} from 'ag-grid-community'

import { BTN } from '../../services/bookmarks/types'
import { useCallback } from 'react'

interface ClickHandlers {
  handleRowClick: (event: RowSelectedEvent<BTN>) => void

  handleRowDoubleClick: (event: RowDoubleClickedEvent<BTN>) => void

  handleSelectionChanged: (event: SelectionChangedEvent<BTN>) => void

  handleMouseUpOnEmptySpace: () => void
}

export function useClickHandlers(
  highlightSide: () => void,
  setCurrentNodeId: (id: string) => void,
  setSelectionModel: (model: string[]) => void,

  api?: GridApi,
): ClickHandlers {
  return {
    handleRowClick: useCallback(
      (event: RowSelectedEvent<BTN>): void => {
        const node = event.data
        if (node !== undefined) {
          highlightSide()
          setSelectionModel(
            event.api
              .getSelectedNodes()
              .map(n => n.id)
              .filter(id => id !== undefined) as string[],
          )
        }
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
      // TODO this doesn't work properly - it disables multiple select
      setSelectionModel([])
      highlightSide()
      api.deselectAll()
    }, [highlightSide, setSelectionModel, api]),
  }
}

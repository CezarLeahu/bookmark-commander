import * as keys from '../../services/utils/keys'

import {
  GridApi,
  GridReadyEvent,
  SuppressHeaderKeyboardEventParams,
  SuppressKeyboardEventParams,
} from 'ag-grid-community'
import { useCallback, useEffect } from 'react'

import { BTN } from '../../services/bookmarks/types'
import { KEYUP } from '../../services/utils/events'
import { OpenDialogActions } from './panel'
import { useOpenHighlightedRow } from './panel-commands'

export function suppressHeaderKeys(params: SuppressHeaderKeyboardEventParams): boolean {
  return true
}

const KeysToPermit = new Set<string>([
  keys.PAGE_UP,
  keys.PAGE_DOWN,
  keys.LEFT,
  keys.UP,
  keys.RIGHT,
  keys.DOWN,
  keys.ESCAPE,
  keys.PAGE_HOME,
  keys.PAGE_END,
])

export function suppressKeys(params: SuppressKeyboardEventParams): boolean {
  const key = params.event.key
  return !KeysToPermit.has(key)
}

export function usePanelKeyListener(
  containerRef: React.RefObject<HTMLDivElement>,
  gridApi: GridApi | undefined,
  highlightOtherSide: () => void,
  setCurrentNodeId: (id: string) => void,
  currentNode: BTN | undefined,
  notifyGridReady: (params: GridReadyEvent) => void,
  setSelectionModel: (model: string[]) => void,
  openDialogActions: OpenDialogActions,
): void {
  const openHighlightedRow = useOpenHighlightedRow(gridApi, setCurrentNodeId, setSelectionModel)

  const selectHighlightedRow: () => boolean = useCallback((): boolean => {
    const rowIndex = gridApi?.getFocusedCell()?.rowIndex
    if (rowIndex === undefined || rowIndex === 0) {
      return false
    }
    const rowId = gridApi?.getModel().getRow(rowIndex)?.data.id
    if (rowId === undefined) {
      return false
    }
    setSelectionModel([rowId])
    return true
  }, [gridApi, setSelectionModel])

  const handleKeyUp = useCallback(
    (e: KeyboardEvent): void => {
      e.stopImmediatePropagation()
      switch (e.key) {
        case keys.BACKSPACE: {
          if (currentNode?.parentId !== undefined) {
            setCurrentNodeId(currentNode.parentId)
          }
          break
        }
        case keys.F2: {
          if (selectHighlightedRow()) {
            openDialogActions.openEdit()
          }
          break
        }
        case keys.DELETE: {
          if (selectHighlightedRow()) {
            openDialogActions.openDelete()
          }
          break
        }
        case keys.TAB: {
          highlightOtherSide()
          break
        }
        case keys.ENTER: {
          openHighlightedRow()
          break
        }
      }
    },
    [
      currentNode,
      setCurrentNodeId,
      openDialogActions,
      highlightOtherSide,
      openHighlightedRow,
      selectHighlightedRow,
    ],
  )

  useEffect(() => {
    if (containerRef.current === undefined || containerRef.current === null) {
      return
    }
    const elem = containerRef.current
    elem.addEventListener(KEYUP, handleKeyUp)
    return () => {
      elem.removeEventListener(KEYUP, handleKeyUp)
    }
  }, [containerRef, handleKeyUp, notifyGridReady])
}

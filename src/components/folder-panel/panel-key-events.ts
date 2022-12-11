import * as keys from '../../services/utils/keys'

import {
  GridApi,
  GridReadyEvent,
  SuppressHeaderKeyboardEventParams,
  SuppressKeyboardEventParams,
} from 'ag-grid-community'
import { useCallback, useEffect } from 'react'

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
  keys.F2,
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
  notifyGridReady: (params: GridReadyEvent) => void,
  selectionModel: string[],
  setSelectionModel: (model: string[]) => void,
  openDialogActions: OpenDialogActions,
): void {
  const openHighlightedRow = useOpenHighlightedRow(gridApi, setCurrentNodeId, setSelectionModel)

  const handleKeyUp = useCallback(
    (e: KeyboardEvent): void => {
      switch (e.key) {
        case keys.BACKSPACE:
        case keys.DELETE: {
          if (selectionModel.length === 0) {
            const rowIndex = gridApi?.getFocusedCell()?.rowIndex
            if (rowIndex === undefined || rowIndex === 0) {
              return
            }
            const rowId = gridApi?.getModel().getRow(rowIndex)?.data.id
            if (rowId === undefined) {
              return
            }
            setSelectionModel([rowId])
          }
          openDialogActions.openDelete()
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
      gridApi,
      selectionModel,
      setSelectionModel,
      openDialogActions,
      highlightOtherSide,
      openHighlightedRow,
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

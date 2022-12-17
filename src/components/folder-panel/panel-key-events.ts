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
import { TITLE_COLUMN } from './panel-metadata'
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
  gridApi: GridApi<BTN> | undefined,
  highlightOtherSide: () => void,
  setCurrentNodeId: (id: string) => void,
  currentNode: BTN | undefined,
  notifyGridReady: (params: GridReadyEvent) => void,
  openDialogActions: OpenDialogActions,
): void {
  const openHighlightedRow = useOpenHighlightedRow(gridApi, setCurrentNodeId)

  const selectHighlightedRow: () => boolean = useCallback((): boolean => {
    // TODO replace with actually getting the FocusedRow
    if (gridApi === undefined) {
      return false
    }
    const rowIndex = gridApi.getFocusedCell()?.rowIndex
    if (rowIndex === undefined || rowIndex === 0) {
      return false
    }

    const row = gridApi?.getModel().getRow(rowIndex)
    if (row === undefined || row.id === undefined) {
      return false
    }

    row.setSelected(true)
    return true
  }, [gridApi])

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
        default: {
          if (KeysToPermit.has(e.key) && gridApi?.getFocusedCell() === null) {
            // TODO this block is never reached, doesn't do nothin'
            console.log('[handleKeyUp(): Focusing on the first row')
            gridApi.setFocusedCell(0, TITLE_COLUMN)
            gridApi.ensureIndexVisible(0)
          }
        }
      }
    },
    [
      gridApi,
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

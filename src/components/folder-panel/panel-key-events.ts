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
  container: HTMLDivElement | null,
  api: GridApi<BTN> | undefined,
  highlightOtherSide: () => void,
  setCurrentNodeId: (id: string) => void,
  highlighted: boolean,
  currentNode: BTN | undefined,
  notifyGridReady: (params: GridReadyEvent) => void,
  openDialogActions: OpenDialogActions,
): void {
  const openHighlightedRow = useOpenHighlightedRow(api, setCurrentNodeId)

  const selectHighlightedRow: () => boolean = useCallback((): boolean => {
    // TODO replace with actually getting the FocusedRow
    if (api === undefined) {
      return false
    }
    const rowIndex = api.getFocusedCell()?.rowIndex
    if (rowIndex === undefined || rowIndex === 0) {
      return false
    }

    const row = api?.getModel().getRow(rowIndex)
    if (row === undefined || row.id === undefined) {
      return false
    }

    row.setSelected(true)
    return true
  }, [api])

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
          api?.clearFocusedCell()
          highlightOtherSide()
          break
        }
        case keys.ENTER: {
          openHighlightedRow()
          break
        }
        // default: {
        //   if (highlighted && KeysToPermit.has(e.key) && api?.getFocusedCell() === null) {
        //     // TODO this block is never reached, doesn't do nothin'
        //     console.log('[handleKeyUp(): Focusing on the first row')
        //     api.setFocusedCell(0, TITLE_COLUMN)
        //     api.ensureIndexVisible(0)
        //   }
        // }
      }
    },
    [
      api,
      currentNode,
      setCurrentNodeId,
      openDialogActions,
      highlightOtherSide,
      openHighlightedRow,
      selectHighlightedRow,
    ],
  )

  useEffect(() => {
    if (container === null) {
      return
    }
    container.addEventListener(KEYUP, handleKeyUp)
    return () => {
      container.removeEventListener(KEYUP, handleKeyUp)
    }
  }, [container, handleKeyUp, notifyGridReady])
}

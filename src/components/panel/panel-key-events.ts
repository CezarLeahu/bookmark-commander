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
import { Side } from '../../services/utils/types'
import { TITLE_COLUMN } from './panel-metadata'
import { updateNodeId } from '../../store/panel-state-reducers'
import { useAppDispatch } from '../../store/hooks'
import { useOpenHighlightedRow } from './panel-commands'
import { useSelectNode } from '../../store/panel-state-hooks'

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
  side: Side,
  container: HTMLDivElement | null,
  api: GridApi<BTN> | undefined,
  highlightOtherSide: () => void,
  notifyGridReady: (params: GridReadyEvent) => void,
  openDialogActions: OpenDialogActions,
): void {
  const dispatch = useAppDispatch()
  const currentNode = useSelectNode(side)

  const openHighlightedRow = useOpenHighlightedRow(api, side)

  const selectHighlightedRow: () => boolean = useCallback((): boolean => {
    if (api === undefined || currentNode?.parentId === undefined) {
      return false
    }
    const rowIndex = api.getFocusedCell()?.rowIndex
    if (rowIndex === undefined || rowIndex === 0 || rowIndex < 0) {
      return false
    }

    const row = api?.getModel().getRow(rowIndex)
    if (row === undefined || row.id === undefined) {
      return false
    }

    if (row.id === currentNode?.parentId) {
      return false
    }

    row.setSelected(true)
    return true
  }, [api, currentNode])

  const toggleHighlightedRowSelection: () => void = useCallback((): void => {
    if (api === undefined || currentNode?.parentId === undefined) {
      return
    }
    const rowIndex = api.getFocusedCell()?.rowIndex
    if (rowIndex === undefined || rowIndex === 0 || rowIndex < 0) {
      return
    }

    const row = api?.getModel().getRow(rowIndex)
    if (row === undefined || row.id === undefined || row.id === currentNode?.parentId) {
      return
    }
    const selected = row.isSelected()
    if (selected === undefined) {
      return
    }

    row.setSelected(!selected)
  }, [api, currentNode])

  const handleKeyUpCapture = useCallback(
    (e: KeyboardEvent): void => {
      switch (e.key) {
        case keys.UP: {
          const index = api?.getFocusedCell()?.rowIndex ?? -1
          if (index <= 0 && api !== undefined) {
            e.stopImmediatePropagation()
            api.setFocusedCell(0, TITLE_COLUMN)
          }
        }
      }
    },
    [api],
  )

  const handleKeyUp = useCallback(
    (e: KeyboardEvent): void => {
      e.stopImmediatePropagation()
      switch (e.key) {
        case keys.BACKSPACE: {
          if (currentNode?.parentId !== undefined) {
            dispatch(updateNodeId({ side, id: currentNode.parentId }))
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
        case keys.SPACE: {
          toggleHighlightedRowSelection()
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
      dispatch,
      side,
      currentNode,
      openDialogActions,
      highlightOtherSide,
      openHighlightedRow,
      selectHighlightedRow,
      toggleHighlightedRowSelection,
    ],
  )

  useEffect(() => {
    if (container === null) {
      return
    }
    container.addEventListener(KEYUP, handleKeyUpCapture, { capture: true })
    container.addEventListener(KEYUP, handleKeyUp)
    return () => {
      container.removeEventListener(KEYUP, handleKeyUp)
      container.removeEventListener(KEYUP, handleKeyUpCapture, { capture: true })
    }
  }, [container, handleKeyUpCapture, handleKeyUp, notifyGridReady])
}

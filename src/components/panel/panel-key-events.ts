import * as keys from '../../services/utils/keys'

import {
  GridApi,
  GridReadyEvent,
  SuppressHeaderKeyboardEventParams,
  SuppressKeyboardEventParams,
} from 'ag-grid-community'
import { Side, other } from '../../services/utils/types'
import { useCallback, useEffect } from 'react'

import { BTN } from '../../services/bookmarks/types'
import { KEYUP } from '../../services/utils/events'
import { OpenDialogActions } from './panel'
import { TITLE_COLUMN } from './panel-metadata'
import { focusSide } from '../../store/app-state-reducers'
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
  notifyGridReady: (params: GridReadyEvent) => void,
  openDialogActions: OpenDialogActions,
  moveItemsBetweenPanels: () => void,
): void {
  const dispatch = useAppDispatch()
  const currentNode = useSelectNode(side)

  const openHighlightedRow = useOpenHighlightedRow(api, side)

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
      if (e.metaKey || e.altKey || e.shiftKey) {
        return
      }
      if (e.ctrlKey) {
        if (e.key === keys.A || e.key === keys.a) {
          api?.selectAll()
        }
        return
      }
      switch (e.key) {
        case keys.BACKSPACE: {
          if (currentNode?.parentId !== undefined) {
            dispatch(updateNodeId({ side, id: currentNode.parentId }))
          }
          break
        }
        case keys.F1: {
          openDialogActions.openNewDirectory()
          break
        }
        case keys.F2: {
          openDialogActions.openEdit()
          break
        }
        case keys.F5:
        case keys.F6: {
          moveItemsBetweenPanels()
          break
        }
        case keys.F8:
        case keys.DELETE: {
          openDialogActions.openDelete()
          break
        }
        case keys.SPACE: {
          toggleHighlightedRowSelection()
          break
        }
        case keys.TAB: {
          dispatch(focusSide(other(side)))
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
      api,
      side,
      currentNode,
      openDialogActions,
      openHighlightedRow,
      toggleHighlightedRowSelection,
      moveItemsBetweenPanels,
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

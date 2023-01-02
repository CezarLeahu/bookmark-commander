import { CellEditRequestEvent, GridApi, GridReadyEvent, RowNode } from 'ag-grid-community'
import { focusSide, refreshApp } from '../../store/app-state-reducers'
import { useCallback, useEffect, useImperativeHandle } from 'react'

import { BTN } from '../../services/bookmarks/types'
import { MOUSEUP } from '../../services/utils/events'
import { Side } from '../../services/utils/types'
import { TITLE_COLUMN } from './panel-metadata'
import { openInNewTab } from '../../services/tabs/tabs'
import { updateNodeId } from '../../store/panel-state-reducers'
import { updateTitle } from '../../services/bookmarks/commands'
import { useAppDispatch } from '../../store/hooks'
import { useSelectNode } from '../../store/panel-state-hooks'

export interface FolderPanelHandle {
  readonly clearFocus: () => void
  readonly focus: (id?: string | undefined) => void
  readonly clearSelection: () => void
  readonly select: (ids: string[]) => void
}

const startCellEdit = (api: GridApi<BTN>, id: string): void => {
  const rowIndex = api.getRowNode(id)?.rowIndex
  if (rowIndex === undefined || rowIndex === null) {
    return
  }
  api.startEditingCell({
    rowIndex,
    colKey: TITLE_COLUMN,
  })
}

export function usePanelHandlers(
  side: Side,
  ref: React.ForwardedRef<FolderPanelHandle>,
  api: GridApi<BTN> | undefined,
): void {
  const currentNode = useSelectNode(side)

  useImperativeHandle<FolderPanelHandle, FolderPanelHandle>(
    ref,
    () => ({
      renameCell: (id: string | undefined): void => {
        if (id !== undefined && api !== undefined) {
          startCellEdit(api, id)
        }
      },

      clearFocus: (): void => api?.clearFocusedCell(),

      // only called after Move or after Drag&Drop between panels
      focus: (id: string | undefined = undefined): void => {
        if (api === undefined) {
          return
        }
        if (id !== undefined) {
          const row = api.getRowNode(id)
          if (row === undefined || row.rowIndex === null) {
            return
          }
          api.setFocusedCell(row.rowIndex, TITLE_COLUMN)
          return
        }

        const cell = api.getFocusedCell()
        if (
          cell !== undefined &&
          cell !== null &&
          cell.rowIndex >= 0 &&
          cell.rowIndex < api.getModel().getRowCount()
        ) {
          api.setFocusedCell(cell.rowIndex, TITLE_COLUMN)
          return
        }

        const rows = api.getSelectedNodes()
        const index = rows.length === 0 ? 0 : rows[0].rowIndex ?? 0
        api.setFocusedCell(index, TITLE_COLUMN)
      },

      clearSelection: (): void => {
        api?.deselectAll()
      },

      select: (ids: string[]): void => {
        if (api === undefined || currentNode?.parentId === undefined) {
          return
        }
        api.deselectAll()

        ids
          .map(id => api.getRowNode(id))
          .filter(n => n !== undefined && n.id !== currentNode.parentId)
          .map(n => n as RowNode<BTN>)
          .forEach(n => n.setSelected(true))
      },
    }),
    [api, currentNode],
  )
}

export function useOpenHighlightedRow(api: GridApi | undefined, side: Side): () => void {
  const dispatch = useAppDispatch()

  return useCallback(() => {
    if (api === undefined) {
      return
    }
    const cell = api.getFocusedCell()
    if (cell === undefined || cell === null || cell.rowIndex < 0) {
      return
    }

    const node = api.getModel().getRow(cell.rowIndex)?.data
    if (node === undefined) {
      return
    }

    switch (node.url) {
      case undefined: // folder
        dispatch(updateNodeId({ side, id: String(node.id) }))
        api.clearFocusedCell()
        api.deselectAll()
        break
      default: // actual bookmark - open in new tab
        openInNewTab(node.url, false)
    }
  }, [dispatch, api, side])
}

export function useCellEditingHandler(): (event: CellEditRequestEvent<BTN, string>) => void {
  const dispatch = useAppDispatch()

  return useCallback(
    (event: CellEditRequestEvent<BTN, string>) => {
      if (event.colDef.field !== TITLE_COLUMN || event.newValue === undefined) {
        return
      }

      const newVal = event.newValue
      if (newVal === event.oldValue || String(newVal).trim() === String(event.oldValue)) {
        return
      }

      updateTitle(event.data.id, newVal)
        .then(() => {
          console.log('Updated one title')
          dispatch(refreshApp())
        })
        .catch(e => console.log(e))
    },
    [dispatch],
  )
}

export function useGridReadyHandle(
  notifyGridReady: (params: GridReadyEvent) => void,
  gridApi: React.MutableRefObject<GridApi<BTN> | undefined>,
): (params: GridReadyEvent) => void {
  return useCallback(
    (params: GridReadyEvent): void => {
      gridApi.current = params.api
      notifyGridReady(params)
    },
    [gridApi, notifyGridReady],
  )
}

export function useHighlightPanelOnClick(
  side: Side,
  container: HTMLDivElement | null,
  notifyGridReady: (params: GridReadyEvent) => void,
): void {
  const dispatch = useAppDispatch()
  const highlightSide = useCallback(() => dispatch(focusSide(side)), [dispatch, side])

  useEffect(() => {
    if (container === null) {
      return
    }
    container.addEventListener(MOUSEUP, highlightSide)
    return () => {
      container.removeEventListener(MOUSEUP, highlightSide)
    }
  }, [container, highlightSide, notifyGridReady])
}

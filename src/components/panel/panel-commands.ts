import { CellEditRequestEvent, GridApi, GridReadyEvent, RowNode } from 'ag-grid-community'
import { useCallback, useEffect, useImperativeHandle } from 'react'
import { useSelectLastHighlightId, useSelectNode } from '../../store/panel-state-hooks'

import { BTN } from '../../services/bookmarks/types'
import { MOUSEUP } from '../../services/utils/events'
import { Side } from '../../services/utils/types'
import { TITLE_COLUMN } from './panel-metadata'
import { openInNewTab } from '../../services/tabs/tabs'
import { refreshApp } from '../../store/app-state-reducers'
import { updateNodeId } from '../../store/panel-state-reducers'
import { updateTitle } from '../../services/bookmarks/commands'
import { useAppDispatch } from '../../store/hooks'
import { useSelectIsHighlighted } from '../../store/app-state-hooks'

export interface FolderPanelHandle {
  readonly renameCell: (id: string | undefined) => void
  readonly getSelectedNodeIds: () => string[]
  readonly clearFocus: () => void
  readonly focus: () => void
  readonly clearSelection: () => void
  readonly setSelection: (ids: string[]) => void
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
  const highlighted = useSelectIsHighlighted(side)
  const lastHighlightId = useSelectLastHighlightId(side)

  const getSelectedNodeIds = selectedNodeIdsProvider(api, currentNode)

  useImperativeHandle<FolderPanelHandle, FolderPanelHandle>(
    ref,
    () => ({
      renameCell: (id: string | undefined): void => {
        if (id !== undefined && api !== undefined) {
          startCellEdit(api, id)
        }
      },

      getSelectedNodeIds,

      clearFocus: (): void => api?.clearFocusedCell(),

      focus: (): void => {
        if (api === undefined) {
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
          api.ensureIndexVisible(cell.rowIndex)
          return
        }

        if (lastHighlightId !== undefined) {
          const index = api.getRowNode(lastHighlightId)?.rowIndex ?? 0
          api.setFocusedCell(index, TITLE_COLUMN)
          api.ensureIndexVisible(index)
          return
        }

        const rows = api.getSelectedNodes()
        const index = rows.length === 0 ? 0 : rows[0].rowIndex ?? 0
        api.setFocusedCell(index, TITLE_COLUMN)
        api.ensureIndexVisible(index)
      },

      clearSelection: (): void => {
        api?.clearFocusedCell()
        api?.deselectAll()
      },

      setSelection: (ids: string[]): void => {
        if (api === undefined || currentNode?.parentId === undefined) {
          return
        }
        api.deselectAll()

        const rows = ids
          .map(id => api.getRowNode(id))
          .filter(n => n !== undefined && n.id !== currentNode.parentId)
          .map(n => n as RowNode<BTN>)

        rows.forEach(n => n.setSelected(true))

        if (rows.length === 0 || !highlighted) {
          return
        }

        api.setFocusedCell(rows[0].rowIndex ?? 0, TITLE_COLUMN)
        api.ensureNodeVisible(rows[0])
      },
    }),
    [api, highlighted, lastHighlightId, currentNode, getSelectedNodeIds],
  )
}

export function selectedNodeIdsProvider(
  api: GridApi<BTN> | undefined,
  currentNode: BTN | undefined,
): () => string[] {
  return (): string[] => {
    if (currentNode?.parentId === undefined) {
      return []
    }
    return (
      api
        ?.getSelectedRows()
        .filter(r => r.index !== 0)
        .map(r => r.id) ?? []
    )
  }
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
  container: HTMLDivElement | null,
  highlightSide: () => void,
  notifyGridReady: (params: GridReadyEvent) => void,
): void {
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

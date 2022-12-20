import { CellEditRequestEvent, GridApi, GridReadyEvent, RowNode } from 'ag-grid-community'
import { useCallback, useEffect, useImperativeHandle } from 'react'

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
import { useSelectNode } from '../../store/panel-state-hooks'

export interface FolderPanelHandle {
  readonly renameCell: (id: string | undefined) => void
  readonly getSelectedNodeIds: () => string[]
  readonly clearFocus: () => void
  readonly clearSelection: () => void
  readonly setSelection: (ids: string[]) => void
  readonly singleRowSelectedOrFocused: () => boolean
  readonly rowsSelectedOrFocused: () => boolean
  readonly ensureAtLeastOneRowSelected: () => void
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

  const getSelectedNodeIds = selectedNodeIdsProvider(api, currentNode)
  const getFocusedNodeId = focusedNodeIdProvider(api, currentNode)

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

      singleRowSelectedOrFocused: (): boolean => {
        if (currentNode?.parentId === undefined) {
          return false
        }

        const selectedIds = getSelectedNodeIds()
        if (selectedIds.length === 1) {
          return true
        }
        if (selectedIds.length > 1) {
          return false
        }

        return getFocusedNodeId() !== undefined
      },

      rowsSelectedOrFocused: (): boolean => {
        if (currentNode?.parentId === undefined) {
          return false
        }
        const selectedIds = getSelectedNodeIds()
        if (selectedIds.length > 0) {
          return true
        }

        return getFocusedNodeId() !== undefined
      },

      ensureAtLeastOneRowSelected: (): void => {
        if (getSelectedNodeIds().length !== 0) {
          return
        }
        const focusedId = getFocusedNodeId()
        if (focusedId === undefined) {
          return
        }
        api?.getRowNode(focusedId)?.setSelected(true)
      },
    }),
    [api, highlighted, currentNode, getSelectedNodeIds, getFocusedNodeId],
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

export function focusedNodeIdProvider(
  api: GridApi<BTN> | undefined,
  currentNode: BTN | undefined,
): () => string | undefined {
  return (): string | undefined => {
    if (currentNode?.parentId === undefined) {
      return undefined
    }

    const rowIndex = api?.getFocusedCell()?.rowIndex ?? 0
    if (rowIndex === 0) {
      return undefined
    }

    return api?.getModel().getRow(rowIndex)?.id
  }
}

export function useOpenHighlightedRow(api: GridApi | undefined, side: Side): () => void {
  const dispatch = useAppDispatch()

  return useCallback(() => {
    if (api === undefined) {
      return
    }
    const cell = api.getFocusedCell()
    if (cell === undefined || cell === null) {
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
    console.log('[useHighlightPanelOnClick Effect / notifyGridReadyEffect]')
    if (container === null) {
      return
    }
    container.addEventListener(MOUSEUP, highlightSide)
    return () => {
      container.removeEventListener(MOUSEUP, highlightSide)
    }
  }, [container, highlightSide, notifyGridReady])
}

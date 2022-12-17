import { CellEditRequestEvent, GridApi, GridReadyEvent, RowNode } from 'ag-grid-community'
import { useCallback, useEffect, useImperativeHandle } from 'react'

import { BTN } from '../../services/bookmarks/types'
import { MOUSEUP } from '../../services/utils/events'
import { TITLE_COLUMN } from './panel-metadata'
import { openInNewTab } from '../../services/tabs/tabs'
import { updateTitle } from '../../services/bookmarks/commands'

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

export function usePanelHandlers(
  ref: React.ForwardedRef<FolderPanelHandle>,
  api: GridApi<BTN> | undefined,
  highlighted: boolean,
  currentNode: BTN | undefined,
): void {
  const startCellEdit = useCallback((api: GridApi<BTN>, id: string): void => {
    const rowIndex = api.getRowNode(id)?.rowIndex
    if (rowIndex === undefined || rowIndex === null) {
      return
    }
    api.startEditingCell({
      rowIndex,
      colKey: TITLE_COLUMN,
    })
  }, [])

  const getSelectedNodeIds = useSelectedNodeIds(api, currentNode)
  const getFocusedNodeId = useFocusedNodeId(api, currentNode)
  const setSelection = useSetSelection(api, highlighted, currentNode)
  const clearFocus = useCallback((): void => api?.clearFocusedCell(), [api])
  const clearSelection = useCallback((): void => {
    api?.clearFocusedCell()
    api?.deselectAll()
  }, [api])

  useImperativeHandle<FolderPanelHandle, FolderPanelHandle>(
    ref,
    () => ({
      renameCell: (id: string | undefined): void => {
        if (id !== undefined && api !== undefined) {
          startCellEdit(api, id)
        }
      },

      getSelectedNodeIds,

      clearFocus,

      clearSelection,

      setSelection,

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
    [
      api,
      currentNode,
      startCellEdit,
      getSelectedNodeIds,
      getFocusedNodeId,
      setSelection,
      clearFocus,
      clearSelection,
    ],
  )
}

export function useSelectedNodeIds(
  api: GridApi<BTN> | undefined,
  currentNode: BTN | undefined,
): () => string[] {
  return useCallback((): string[] => {
    if (currentNode?.parentId === undefined) {
      return []
    }
    return (
      api
        ?.getSelectedRows()
        .filter(r => r.index !== 0)
        .map(r => r.id) ?? []
    )
  }, [api, currentNode])
}

export function useFocusedNodeId(
  api: GridApi<BTN> | undefined,
  currentNode: BTN | undefined,
): () => string | undefined {
  return useCallback((): string | undefined => {
    if (currentNode?.parentId === undefined) {
      return undefined
    }

    const rowIndex = api?.getFocusedCell()?.rowIndex ?? 0
    if (rowIndex === 0) {
      return undefined
    }

    return api?.getModel().getRow(rowIndex)?.id
  }, [api, currentNode])
}

export function useSetSelection(
  api: GridApi<BTN> | undefined,
  highlighted: boolean,
  currentNode: BTN | undefined,
): (ids: string[]) => void {
  return useCallback(
    (ids: string[]) => {
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
    [api, highlighted, currentNode],
  )
}

export function useOpenHighlightedRow(
  api: GridApi | undefined,
  setCurrentNodeId: (id: string) => void,
): () => void {
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
        setCurrentNodeId(String(node.id))
        api.clearFocusedCell()
        api.deselectAll()
        break
      default: // actual bookmark - open in new tab
        openInNewTab(node.url, false)
    }
  }, [api, setCurrentNodeId])
}

export function useCellEditingHandler(
  refreshRows: () => void,
): (event: CellEditRequestEvent<BTN, string>) => void {
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
          refreshRows()
        })
        .catch(e => console.log(e))
    },
    [refreshRows],
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

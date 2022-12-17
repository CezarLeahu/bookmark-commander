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
  gridApi: GridApi<BTN> | undefined,
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

  const getSelectedNodeIds = useSelectedNodeIds(gridApi, currentNode)
  const getFocusedNodeId = useFocusedNodeId(gridApi, currentNode)
  const setSelection = useSetSelection(gridApi, currentNode)
  const clearFocus = useCallback((): void => gridApi?.clearFocusedCell(), [gridApi])
  const clearSelection = useCallback((): void => {
    gridApi?.clearFocusedCell()
    gridApi?.deselectAll()
  }, [gridApi])

  useImperativeHandle<FolderPanelHandle, FolderPanelHandle>(
    ref,
    () => ({
      renameCell: (id: string | undefined): void => {
        if (id !== undefined && gridApi !== undefined) {
          startCellEdit(gridApi, id)
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
        gridApi?.getRowNode(focusedId)?.setSelected(true)
      },
    }),
    [
      gridApi,
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
  gridApi: GridApi<BTN> | undefined,
  currentNode: BTN | undefined,
): () => string[] {
  return useCallback((): string[] => {
    if (currentNode?.parentId === undefined) {
      return []
    }
    return (
      gridApi
        ?.getSelectedRows()
        .filter(r => r.index !== 0)
        .map(r => r.id) ?? []
    )
  }, [gridApi, currentNode])
}

export function useFocusedNodeId(
  gridApi: GridApi<BTN> | undefined,
  currentNode: BTN | undefined,
): () => string | undefined {
  return useCallback((): string | undefined => {
    if (currentNode?.parentId === undefined) {
      return undefined
    }

    const rowIndex = gridApi?.getFocusedCell()?.rowIndex ?? 0
    if (rowIndex === 0) {
      return undefined
    }

    return gridApi?.getModel().getRow(rowIndex)?.id
  }, [gridApi, currentNode])
}

export function useSetSelection(
  gridApi: GridApi<BTN> | undefined,
  currentNode: BTN | undefined,
): (ids: string[]) => void {
  return useCallback(
    (ids: string[]) => {
      if (gridApi === undefined || currentNode?.parentId === undefined) {
        return
      }
      gridApi.deselectAll()

      const rows = ids
        .map(id => gridApi.getRowNode(id))
        .filter(n => n !== undefined && n.id !== currentNode.parentId)
        .map(n => n as RowNode<BTN>)

      rows.forEach(n => n.setSelected(true))

      if (rows.length === 0) {
        return
      }

      gridApi.setFocusedCell(rows[0].rowIndex ?? 0, TITLE_COLUMN)
      gridApi.ensureNodeVisible(rows[0])
    },
    [gridApi, currentNode],
  )
}

export function useOpenHighlightedRow(
  gridApi: GridApi | undefined,
  setCurrentNodeId: (id: string) => void,
): () => void {
  return useCallback(() => {
    if (gridApi === undefined) {
      return
    }
    const cell = gridApi.getFocusedCell()
    if (cell === undefined || cell === null) {
      return
    }

    const node = gridApi.getModel().getRow(cell.rowIndex)?.data
    if (node === undefined) {
      return
    }

    switch (node.url) {
      case undefined: // folder
        setCurrentNodeId(String(node.id))
        gridApi.clearFocusedCell()
        gridApi.deselectAll()
        break
      default: // actual bookmark - open in new tab
        openInNewTab(node.url, false)
    }
  }, [gridApi, setCurrentNodeId])
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
  containerRef: React.RefObject<HTMLDivElement>,
  highlightSide: () => void,
  notifyGridReady: (params: GridReadyEvent) => void,
): void {
  useEffect(() => {
    console.log('[useHighlightPanelOnClick Effect / notifyGridReadyEffect]')
    if (containerRef.current === undefined || containerRef.current === null) {
      return
    }
    const elem = containerRef.current
    elem.addEventListener(MOUSEUP, highlightSide)
    return () => {
      elem.removeEventListener(MOUSEUP, highlightSide)
    }
  }, [containerRef, highlightSide, notifyGridReady])
}

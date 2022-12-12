import { CellEditRequestEvent, GridApi, GridReadyEvent } from 'ag-grid-community'
import { useCallback, useEffect, useImperativeHandle } from 'react'

import { BTN } from '../../services/bookmarks/types'
import { MOUSEUP } from '../../services/utils/events'
import { TITLE_COLUMN } from './panel-metadata'
import { openInNewTab } from '../../services/tabs/tabs'
import { updateTitle } from '../../services/bookmarks/commands'

export interface FolderPanelHandle {
  readonly renameCell: (id: string | undefined) => void
  readonly clearFocus: () => void
  readonly singleRowSelectedOrFocused: () => boolean
  readonly rowsSelectedOrFocused: () => boolean
  readonly ensureAtLeastOneRowSelected: () => void
}

export function usePanelHandlers(
  ref: React.ForwardedRef<FolderPanelHandle>,
  gridApi: GridApi<BTN> | undefined,
  currentNode: BTN | undefined,
  selectionModel: string[],
  setSelectionModel: (model: string[]) => void,
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

  useImperativeHandle<FolderPanelHandle, FolderPanelHandle>(
    ref,
    () => ({
      renameCell: (id: string | undefined): void => {
        if (id !== undefined && gridApi !== undefined) {
          startCellEdit(gridApi, id)
        }
      },

      clearFocus: (): void => gridApi?.clearFocusedCell(),

      singleRowSelectedOrFocused: (): boolean => {
        if (currentNode?.parentId === undefined || selectionModel.length > 1) {
          return false
        }
        if (selectionModel.length === 1) {
          return true
        }
        return (gridApi?.getFocusedCell()?.rowIndex ?? 0) > 0
        // TODO check if selectionModel can be retrieved from the gridApi (and maybe account for index 0)
      },

      rowsSelectedOrFocused: (): boolean => {
        if (currentNode?.parentId === undefined) {
          return false
        }
        return selectionModel.length > 0 || (gridApi?.getFocusedCell()?.rowIndex ?? 0) > 0
        // TODO check if selectionModel can be retrieved from the gridApi (and maybe account for index 0)
      },

      ensureAtLeastOneRowSelected: (): void => {
        if (selectionModel.length !== 0) {
          return
        }
        const rowIndex = gridApi?.getFocusedCell()?.rowIndex ?? 0
        if (rowIndex === 0) {
          return
        }

        const id = gridApi?.getModel().getRow(rowIndex)?.id
        if (id === undefined) {
          return
        }

        setSelectionModel([id])
        // gridApi?.clearFocusedCell()
      },
    }),
    [gridApi, startCellEdit, currentNode, selectionModel, setSelectionModel],
  )
}

export function useOpenHighlightedRow(
  gridApi: GridApi | undefined,
  setCurrentNodeId: (id: string) => void,
  setSelectionModel: (model: string[]) => void,
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
        setSelectionModel([])
        break
      default: // actual bookmark - open in new tab
        openInNewTab(node.url, false)
    }
  }, [gridApi, setCurrentNodeId, setSelectionModel])
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

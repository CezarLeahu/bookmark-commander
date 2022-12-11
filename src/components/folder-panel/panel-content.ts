import { GridApi, SelectionChangedEvent } from 'ag-grid-community'
import {
  childrenAndParent,
  getNode,
  getTopNodes,
  parentPath,
} from '../../services/bookmarks/queries'
import { useCallback, useEffect, useState } from 'react'

import { BTN } from '../../services/bookmarks/types'
import { TITLE_COLUMN } from './panel-metadata'

interface FolderActiveContent {
  topNodes: BTN[]
  currentNode: BTN | undefined
  breadcrumbs: BTN[]
  rows: BTN[]
}

export function useFolderContentEffect(
  currentNodeId: string,
  rowsOutdated: object,
): FolderActiveContent {
  const [topNodes, setTopNodes] = useState<BTN[]>([])
  const [currentNode, setCurrentNode] = useState<BTN>()
  const [breadcrumbs, setBreadcrumbs] = useState<BTN[]>([])
  const [rows, setRows] = useState<BTN[]>([])

  useEffect(() => {
    getTopNodes().then(
      r => setTopNodes(r),
      e => console.log(e),
    )
  }, [])

  useEffect(() => {
    getNode(currentNodeId).then(
      r => setCurrentNode(r),
      e => console.log(e),
    )
  }, [currentNodeId])

  useEffect(() => {
    parentPath(currentNode).then(
      r => setBreadcrumbs(r),
      e => console.log(e),
    )
  }, [currentNode])

  useEffect(() => {
    childrenAndParent(currentNodeId).then(
      ([r]) => setRows(r),
      e => console.log(e),
    )
  }, [currentNodeId, rowsOutdated])

  return {
    topNodes,
    currentNode,
    breadcrumbs,
    rows,
  }
}

export function useGridSelectionEffect(
  gridApi: React.MutableRefObject<GridApi<BTN> | undefined>,
  selectionModel: string[],
  rows: BTN[],
): (event: SelectionChangedEvent<BTN>) => void {
  useEffect(() => {
    if (gridApi.current === undefined) {
      return
    }
    if (selectionModel.length === 0) {
      gridApi.current.deselectAll()
      return
    }
    const ids = new Set<string>(selectionModel)
    gridApi.current.forEachNode(n =>
      n.setSelected(n.data?.id !== undefined && ids.has(n.data.id), false, true),
    )
  }, [gridApi, selectionModel, rows])

  return useCallback((event: SelectionChangedEvent<BTN>): void => {
    const selectedRows = event.api.getSelectedNodes()
    if (selectedRows.length === 1) {
      event.api.ensureNodeVisible(selectedRows[0])
      event.api.setFocusedCell(selectedRows[0].rowIndex ?? 0, TITLE_COLUMN)
      return
    }
    if (selectedRows.length > 1) {
      return
    }
    if (event.api.getDisplayedRowCount() !== 0) {
      event.api.ensureIndexVisible(0)
      event.api.setFocusedCell(0, TITLE_COLUMN)
    }
  }, [])
}

export function useGridHighlightEffect(
  gridApi: React.MutableRefObject<GridApi<BTN> | undefined>,
  highlighted: boolean,
  rows: BTN[],
): void {
  useEffect(() => {
    if (!highlighted || gridApi.current === undefined) {
      return
    }
    if (gridApi.current.getDisplayedRowAtIndex(0) === undefined) {
      return
    }
    gridApi.current.ensureIndexVisible(0)
    gridApi.current.setFocusedCell(0, TITLE_COLUMN)
  }, [gridApi, highlighted, rows])
}

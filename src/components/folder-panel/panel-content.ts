import {
  childrenAndParent,
  getNode,
  getTopNodes,
  parentPath,
} from '../../services/bookmarks/queries'
import { useEffect, useState } from 'react'

import { BTN } from '../../services/bookmarks/types'
import { GridApi } from 'ag-grid-community'

interface FolderActiveContent {
  topNodes: BTN[]
  currentNode: chrome.bookmarks.BookmarkTreeNode | undefined
  breadcrumbs: chrome.bookmarks.BookmarkTreeNode[]
  rows: chrome.bookmarks.BookmarkTreeNode[]
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
): void {
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
    if (selectionModel.length === 1) {
      gridApi.current.ensureNodeVisible(n => n.id === selectionModel[0])
    }
  }, [gridApi, selectionModel, rows])
}

import {
  childrenAndParent,
  getNode,
  getTopNodes,
  parentPath,
} from '../../services/bookmarks/queries'
import { useEffect, useRef, useState } from 'react'

import { BTN } from '../../services/bookmarks/types'
import { useFolderPanelContext } from './folder-panel-context'

interface FolderActiveContent {
  topNodes: BTN[]
  currentNode: chrome.bookmarks.BookmarkTreeNode | undefined
  breadcrumbs: chrome.bookmarks.BookmarkTreeNode[]
  rows: chrome.bookmarks.BookmarkTreeNode[]
  parentId: React.MutableRefObject<string | undefined>
}

export function useFolderActiveContent(): FolderActiveContent {
  const { currentNodeId, selectionModel, refreshContent } = useFolderPanelContext()

  const [topNodes, setTopNodes] = useState<BTN[]>([])
  const [currentNode, setCurrentNode] = useState<BTN>()
  const [breadcrumbs, setBreadcrumbs] = useState<BTN[]>([])
  const [rows, setRows] = useState<BTN[]>([])
  const parentId = useRef<string>()

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
      ([r, pId]) => {
        setRows(r)
        parentId.current = pId
      },
      e => console.log(e),
    )
  }, [currentNodeId, refreshContent, selectionModel])

  return {
    topNodes,
    currentNode,
    breadcrumbs,
    rows,
    parentId,
  }
}

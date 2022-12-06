import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import {
  childrenAndParent,
  getNode,
  getTopNodes,
  parentPath,
} from '../../services/bookmarks/queries'

import { BTN } from '../../services/bookmarks/types'
import { useFolderPanelContext } from './folder-panel-context'

interface FolderActiveContent {
  topNodes: BTN[]
  error: string | undefined
  setError: Dispatch<SetStateAction<string | undefined>>
  currentNode: chrome.bookmarks.BookmarkTreeNode | undefined
  breadcrumbs: chrome.bookmarks.BookmarkTreeNode[]
  rows: chrome.bookmarks.BookmarkTreeNode[]
  parentId: React.MutableRefObject<string | undefined>
}

export function useFolderActiveContent(): FolderActiveContent {
  const { currentNodeId, selectionModel, refreshContent } = useFolderPanelContext()

  const [topNodes, setTopNodes] = useState<BTN[]>([])
  const [error, setError] = useState<string>()
  const [currentNode, setCurrentNode] = useState<BTN>()
  const [breadcrumbs, setBreadcrumbs] = useState<BTN[]>([])
  const [rows, setRows] = useState<BTN[]>([])
  const parentId = useRef<string>()

  useEffect(() => {
    getTopNodes().then(
      r => setTopNodes(r),
      e => setError(e),
    )
  }, [])

  useEffect(() => {
    getNode(currentNodeId).then(
      r => setCurrentNode(r),
      e => setError(e),
    )
  }, [currentNodeId])

  useEffect(() => {
    parentPath(currentNode).then(
      r => setBreadcrumbs(r),
      e => setError(e),
    )
  }, [currentNode])

  useEffect(() => {
    childrenAndParent(currentNodeId).then(
      ([r, pId]) => {
        setRows(r)
        parentId.current = pId
      },
      e => setError(e),
    )
  }, [currentNodeId, refreshContent, selectionModel])

  return {
    topNodes,
    error,
    setError,
    currentNode,
    breadcrumbs,
    rows,
    parentId,
  }
}

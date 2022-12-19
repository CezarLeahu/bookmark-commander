import {
  childrenAndParent,
  getNode,
  getTopNodes,
  parentPath,
} from '../../services/bookmarks/queries'
import { useCallback, useEffect, useState } from 'react'

import { BTN } from '../../services/bookmarks/types'
import { ComponentStateChangedEvent } from 'ag-grid-community'
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

export function useComponenetStateChangedHandler(
  highlighted: boolean,
): (event: ComponentStateChangedEvent<BTN>) => void {
  return useCallback(
    (event: ComponentStateChangedEvent<BTN>) => {
      console.log('[onComponentStateChanged]')

      if (!highlighted) {
        event.api.clearFocusedCell()
        return
      }
      if (event.api.getDisplayedRowCount() !== 0) {
        return
      }

      if (event.api.getFocusedCell() !== null) {
        event.api.ensureIndexVisible(event.api.getFocusedCell()?.rowIndex ?? 0)
        return
      }

      if (!highlighted) {
        return
      }

      // TODO hopefully not  really needed - we might need to set a current focused cell as a Ref
      console.log('[onComponentStateChanged(): Focusing on the first row')
      event.api.setFocusedCell(0, TITLE_COLUMN)
      event.api.ensureIndexVisible(0)
    },
    [highlighted],
  )
}

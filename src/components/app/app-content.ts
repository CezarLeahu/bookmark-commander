import { Side, other } from '../../services/utils/types'
import { getNode, getTopNodes } from '../../services/bookmarks/queries'
import { updateSearchResultSelection, updateTopNodes } from '../../store/app-state-reducers'
import { useCallback, useEffect } from 'react'
import { useSelectFocusedNodeId, useSelectOtherNodeId } from '../../store/panel-state-hooks'

import { BTN } from '../../services/bookmarks/types'
import { FolderPanelHandle } from '../panel/panel-commands'
import { PairRef } from '../../services/utils/hooks'
import { updateNodeId } from '../../store/panel-state-reducers'
import { useAppDispatch } from '../../store/hooks'
import { useSelectFocusedSide } from '../../store/app-state-hooks'

export function useLoadAppCommonStateEffect(): void {
  const dispatch = useAppDispatch()

  useEffect(() => {
    getTopNodes().then(
      nodes => dispatch(updateTopNodes({ nodes })),
      e => console.log(e),
    )
  }, [dispatch])
}

export function useSelectionReset(panelRefs: PairRef<FolderPanelHandle | null>): () => void {
  const focusedSide = useSelectFocusedSide()
  const otherSide: Side = other(focusedSide)
  const focusedNodeId = useSelectFocusedNodeId()
  const otherNodeId = useSelectOtherNodeId()

  return useCallback((): void => {
    panelRefs[focusedSide].current?.clearSelection()
    if (focusedNodeId === otherNodeId) {
      panelRefs[otherSide].current?.clearSelection()
      panelRefs[otherSide].current?.clearFocus()
    }
  }, [panelRefs, focusedSide, otherSide, focusedNodeId, otherNodeId])
}

export function useUpdateCurrentPathsIfNeeded(): (idsToBeDeleted: string[]) => void {
  const dispatch = useAppDispatch()
  const focusedSide = useSelectFocusedSide()
  const focusedNodeId = useSelectFocusedNodeId()
  const otherNodeId = useSelectOtherNodeId()

  return useCallback(
    (idsToBeDeleted: string[]): void => {
      if (idsToBeDeleted.length === 0) {
        return
      }

      const ids = new Set<string>(idsToBeDeleted)
      const otherSide: Side = other(focusedSide)

      const checkSide = (side: Side, nodeId: string): void => {
        if (ids.has(nodeId)) {
          getNode(nodeId)
            .then(n => {
              dispatch(updateNodeId({ side, id: n.parentId ?? '0' }))
            })
            .catch(e => {
              console.log(e)
              dispatch(updateNodeId({ side, id: '0' }))
            })
        }
      }

      checkSide(focusedSide, focusedNodeId)
      checkSide(otherSide, otherNodeId)
    },
    [dispatch, focusedSide, focusedNodeId, otherNodeId],
  )
}

export function useJumpToParent(): (node: BTN) => void {
  const dispatch = useAppDispatch()
  const focusedSide = useSelectFocusedSide()

  return useCallback(
    (node: BTN): void => {
      dispatch(updateNodeId({ side: focusedSide, id: node.parentId ?? '0' }))
      dispatch(updateSearchResultSelection(node))
    },
    [dispatch, focusedSide],
  )
}

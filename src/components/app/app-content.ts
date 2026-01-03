import { Side, other } from '../../services/utils/types'
import {
  focusSide,
  updateSearchResultSelection,
  updateTopNodes,
} from '../../store/app-state-reducers'
import { getNode, getTopNodes } from '../../services/bookmarks/queries'
import { useCallback, useEffect } from 'react'
import { useSelectFocusedNodeId, useSelectOtherNodeId } from '../../store/panel-state-hooks'

import { BTN } from '../../services/bookmarks/types'
import { updateNodeId } from '../../store/panel-state-reducers'
import { useAppDispatch } from '../../store/hooks'
import { useSelectFocusedSide } from '../../store/app-state-hooks'

export function useLoadAppCommonStateEffect(): void {
  const dispatch = useAppDispatch()

  useEffect(() => {
    getTopNodes().then(
      nodes => {
        console.debug('app-content: useLoadAppCommonStateEffect')
        dispatch(updateTopNodes({ nodes }))
      },
      e => console.log(e),
    )
  }, [dispatch])
}

export function useUpdateCurrentPathsIfNeeded(): (idsToBeDeleted: string[]) => void {
  const dispatch = useAppDispatch()
  const focusedSide = useSelectFocusedSide()
  const focusedNodeId = useSelectFocusedNodeId()
  const otherNodeId = useSelectOtherNodeId()

  return useCallback(
    (idsToBeDeleted: string[]): void => {
      if (focusedSide === undefined) {
        console.debug('app-content: useUpdateCurrentPathsIfNeeded: focusedSide is undefined')
        return
      }

      if (idsToBeDeleted.length === 0) {
        return
      }

      const ids = new Set<string>(idsToBeDeleted)
      const otherSide: Side = other(focusedSide)

      // ideally this should check more than just one level, but we only allow empty folder deletion
      // we can't delete an ancestor, just the current dir
      const checkSide = (side: Side, nodeId: string): void => {
        if (ids.has(nodeId)) {
          getNode(nodeId)
            .then(n => {
              console.debug('app-content: useUpdateCurrentPathsIfNeeded')
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
      if (focusedSide === undefined) {
        console.debug('app-content: useJumpToParent: focusedSide is undefined')
        dispatch(focusSide('left'))
      }
      dispatch(updateNodeId({ side: focusedSide ?? 'left', id: node.parentId ?? '0' }))
      dispatch(updateSearchResultSelection(node))
    },
    [dispatch, focusedSide],
  )
}

import { PairCallback, PairRef, usePairCallbacks } from '../../services/utils/hooks'
import { Side, other } from '../../services/utils/types'
import { focusLeft, focusRight, selectFocusedSide } from '../../store/app-state-reducers'
import { selectNodeIds, updateNodeId } from '../../store/panel-state-reducers'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

import { BTN } from '../../services/bookmarks/types'
import { FolderPanelHandle } from '../panel/panel-commands'
import { getNode } from '../../services/bookmarks/queries'
import { useCallback } from 'react'

export function useLastSelectedIds(panelRefs: PairRef<FolderPanelHandle | null>): () => string[] {
  const selectedSide = useAppSelector(selectFocusedSide)

  return useCallback(
    (): string[] => panelRefs[selectedSide].current?.getSelectedNodeIds() ?? [],
    [selectedSide, panelRefs],
  )
}

export function useSelectionReset(panelRefs: PairRef<FolderPanelHandle | null>): () => void {
  const focusedSide = useAppSelector(selectFocusedSide)
  const nodeIds = useAppSelector(selectNodeIds)

  return useCallback((): void => {
    panelRefs[focusedSide].current?.clearSelection()
    const otherSide: Side = other(focusedSide)
    if (nodeIds[otherSide] === nodeIds[focusedSide]) {
      panelRefs[otherSide].current?.clearSelection()
    }
  }, [panelRefs, focusedSide, nodeIds])
}

export function useUpdateCurrentPathsIfNeeded(): (idsToBeDeleted: string[]) => void {
  const dispatch = useAppDispatch()
  const focusedSide = useAppSelector(selectFocusedSide)

  const currentNodeIds = useAppSelector(selectNodeIds)

  return useCallback(
    (idsToBeDeleted: string[]): void => {
      if (idsToBeDeleted.length === 0) {
        return
      }

      const ids = new Set<string>(idsToBeDeleted)
      const otherSide: Side = other(focusedSide)

      const checkSide = (side: Side): void => {
        if (ids.has(currentNodeIds[side])) {
          getNode(currentNodeIds[side])
            .then(n => {
              dispatch(updateNodeId({ side, id: n.parentId ?? '0' }))
            })
            .catch(e => {
              console.log(e)
              dispatch(updateNodeId({ side, id: '0' }))
            })
        }
      }

      checkSide(otherSide)
      checkSide(focusedSide)
    },
    [dispatch, focusedSide, currentNodeIds],
  )
}

export function useJumpToParent(panelRefs: PairRef<FolderPanelHandle | null>): (node: BTN) => void {
  const dispatch = useAppDispatch()
  const focusedSide = useAppSelector(selectFocusedSide)

  return useCallback(
    (node: BTN): void => {
      console.log(`jump to directory ${node.parentId ?? '0'}`)
      panelRefs[focusedSide].current?.setSelection([node.id])
      dispatch(updateNodeId({ side: focusedSide, id: node.parentId ?? '0' }))
    },
    [dispatch, panelRefs, focusedSide],
  )
}

export function usePanelHighlight(
  panelRefs: PairRef<FolderPanelHandle | null>,
): PairCallback<() => void> {
  const dispatch = useAppDispatch()

  return usePairCallbacks(
    () => {
      panelRefs.right.current?.clearFocus()
      dispatch(focusLeft())
    },
    () => {
      panelRefs.left.current?.clearFocus()
      dispatch(focusRight())
    },
    [panelRefs.left, panelRefs.right],
  )
}

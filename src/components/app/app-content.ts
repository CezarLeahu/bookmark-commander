import { PairCallback, PairRef, usePairCallbacks } from '../../services/utils/hooks'
import { Side, other } from '../../services/utils/types'
import { focusLeft, focusRight } from '../../store/sideReducer'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useCallback, useState } from 'react'

import { BTN } from '../../services/bookmarks/types'
import { FolderPanelHandle } from '../folder-panel/panel-commands'
import { getNode } from '../../services/bookmarks/queries'
import { updateCurrentNodeId } from '../../store/currentNodeIdsReducer'

export function useRefresh(): [object, () => void] {
  const [refresh, setRefresh] = useState({})
  return [refresh, useCallback(() => setRefresh({}), [])]
}

export function useLastSelectedIds(panelRefs: PairRef<FolderPanelHandle | null>): () => string[] {
  const selectedSide = useAppSelector(state => state.side)

  return useCallback(
    (): string[] => panelRefs[selectedSide].current?.getSelectedNodeIds() ?? [],
    [selectedSide, panelRefs],
  )
}

export function useSelectionReset(panelRefs: PairRef<FolderPanelHandle | null>): () => void {
  const selectedSide = useAppSelector(state => state.side)
  const currentNodeIds = useAppSelector(state => state.currentNodeIds)

  return useCallback((): void => {
    panelRefs[selectedSide].current?.clearSelection()
    const otherSide: Side = other(selectedSide)
    if (currentNodeIds[otherSide] === currentNodeIds[selectedSide]) {
      panelRefs[otherSide].current?.clearSelection()
    }
  }, [panelRefs, selectedSide, currentNodeIds])
}

export function useUpdateCurrentPathsIfNeeded(): (idsToBeDeleted: string[]) => void {
  const dispatch = useAppDispatch()
  const selectedSide = useAppSelector(state => state.side)
  const currentNodeIds = useAppSelector(state => state.currentNodeIds)

  return useCallback(
    (idsToBeDeleted: string[]): void => {
      if (idsToBeDeleted.length === 0) {
        return
      }

      const ids = new Set<string>(idsToBeDeleted)
      const otherSide: Side = other(selectedSide)

      const checkSide = (side: Side): void => {
        if (ids.has(currentNodeIds[side])) {
          getNode(currentNodeIds[side])
            .then(n => {
              dispatch(updateCurrentNodeId({ side, id: n.parentId ?? '0' }))
            })
            .catch(e => {
              console.log(e)
              dispatch(updateCurrentNodeId({ side, id: '0' }))
            })
        }
      }

      checkSide(otherSide)
      checkSide(selectedSide)
    },
    [dispatch, selectedSide, currentNodeIds],
  )
}

export function useJumpToParent(panelRefs: PairRef<FolderPanelHandle | null>): (node: BTN) => void {
  const dispatch = useAppDispatch()
  const selectedSide = useAppSelector(state => state.side)

  return useCallback(
    (node: BTN): void => {
      console.log(`jump to directory ${node.parentId ?? '0'}`)
      panelRefs[selectedSide].current?.setSelection([node.id])
      dispatch(updateCurrentNodeId({ side: selectedSide, id: node.parentId ?? '0' }))
    },
    [dispatch, panelRefs, selectedSide],
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

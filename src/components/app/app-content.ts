import { PairCallback, PairRef, PairState, usePairCallbacks } from '../../services/utils/hooks'
import { Side, other } from '../../services/utils/types'
import { focusLeft, focusRight } from '../../store/sideReducers'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useCallback, useState } from 'react'

import { BTN } from '../../services/bookmarks/types'
import { FolderPanelHandle } from '../folder-panel/panel-commands'
import { getNode } from '../../services/bookmarks/queries'

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

export function useSelectionReset(
  panelRefs: PairRef<FolderPanelHandle | null>,
  currentNodeIds: PairState<string>,
): () => void {
  const selectedSide = useAppSelector(state => state.side)

  return useCallback((): void => {
    panelRefs[selectedSide].current?.clearSelection()
    const otherSide: Side = other(selectedSide)
    if (currentNodeIds[otherSide] === currentNodeIds[selectedSide]) {
      panelRefs[otherSide].current?.clearSelection()
    }
  }, [panelRefs, selectedSide, currentNodeIds])
}

export function useUpdateCurrentPathsIfNeeded(
  currentNodeIds: PairState<string>,
): (idsToBeDeleted: string[]) => void {
  const selectedSide = useAppSelector(state => state.side)

  return useCallback(
    (idsToBeDeleted: string[]): void => {
      if (idsToBeDeleted.length === 0) {
        return
      }

      const ids = new Set<string>(idsToBeDeleted)
      const otherSide: Side = other(selectedSide)

      const checkSide = (side: Side): void => {
        if (ids.has(currentNodeIds[side].state)) {
          getNode(currentNodeIds[side].state)
            .then(n => {
              currentNodeIds[side].setState(n.parentId ?? '0')
            })
            .catch(e => {
              console.log(e)
              currentNodeIds[side].setState('0')
            })
        }
      }

      checkSide(otherSide)
      checkSide(selectedSide)
    },
    [selectedSide, currentNodeIds],
  )
}

export function useJumpToParent(
  panelRefs: PairRef<FolderPanelHandle | null>,
  currentNodeIds: PairState<string>,
): (node: BTN) => void {
  const selectedSide = useAppSelector(state => state.side)

  return useCallback(
    (node: BTN): void => {
      console.log(`jump to directory ${node.parentId ?? '0'}`)
      panelRefs[selectedSide].current?.setSelection([node.id])
      currentNodeIds[selectedSide].setState(node.parentId ?? '0')
    },
    [panelRefs, selectedSide, currentNodeIds],
  )
}

export function usePanelHighlight(
  panelRefs: PairRef<FolderPanelHandle | null>,
): PairCallback<() => void> {
  const dispatch = useAppDispatch()

  return usePairCallbacks(
    () => {
      panelRefs.right.current?.clearFocus()
      dispatch(focusLeft(''))
    },
    () => {
      panelRefs.left.current?.clearFocus()
      dispatch(focusRight(''))
    },
    [panelRefs.left, panelRefs.right],
  )
}

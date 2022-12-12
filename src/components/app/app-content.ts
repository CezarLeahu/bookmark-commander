import { PairCallback, PairRef, PairState, usePairCallbacks } from '../../services/utils/hooks'
import { Side, other } from '../../services/utils/types'
import { useCallback, useState } from 'react'

import { BTN } from '../../services/bookmarks/types'
import { FolderPanelHandle } from '../folder-panel/panel-commands'
import { getNode } from '../../services/bookmarks/queries'

export function useRefresh(): [object, () => void] {
  const [refresh, setRefresh] = useState({})
  return [refresh, useCallback(() => setRefresh({}), [])]
}

export function useLastSelectedIds(
  selectedSide: Side,
  selectionModels: PairState<string[]>,
): () => string[] {
  return useCallback(
    (): string[] => selectionModels[selectedSide].state,
    [selectedSide, selectionModels],
  )
}

export function useSelectionReset(
  selectedSide: Side,
  currentNodeIds: PairState<string>,
  selectionModels: PairState<string[]>,
): () => void {
  return useCallback((): void => {
    selectionModels[selectedSide].setState([])
    const otherSide: Side = other(selectedSide)
    if (currentNodeIds[otherSide] === currentNodeIds[selectedSide]) {
      selectionModels[otherSide].setState([])
    }
  }, [selectedSide, currentNodeIds, selectionModels])
}

export function useUpdateCurrentPathsIfNeeded(
  selectedSide: Side,
  currentNodeIds: PairState<string>,
): (idsToBeDeleted: string[]) => void {
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
  selectedSide: Side,
  currentNodeIds: PairState<string>,
  selectionModels: PairState<string[]>,
): (node: BTN) => void {
  return useCallback(
    (node: BTN): void => {
      console.log(`jump to directory ${node.parentId ?? '0'}`)
      selectionModels[selectedSide].setState([node.id])
      currentNodeIds[selectedSide].setState(node.parentId ?? '0')
    },
    [selectedSide, currentNodeIds, selectionModels],
  )
}

export function usePanelHighlight(
  panelRefs: PairRef<FolderPanelHandle | null>,
  setSelectedSide: React.Dispatch<React.SetStateAction<Side>>,
): PairCallback<() => void> {
  return usePairCallbacks(
    () => {
      panelRefs.right.current?.clearFocus()
      setSelectedSide('left')
    },
    () => {
      panelRefs.left.current?.clearFocus()
      setSelectedSide('right')
    },
    [panelRefs.left, panelRefs.right],
  )
}

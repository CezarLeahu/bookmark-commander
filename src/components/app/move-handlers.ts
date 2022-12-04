import { Dispatch, SetStateAction } from 'react'
import { Side, other } from '../../services/utils/types'
import { moveAll, moveDown, moveUp } from '../../services/bookmarks/commands'

import { PairState } from '../../services/utils/hooks'

interface MoveHandlers {
  handleMove: () => void
  handleMoveUp: () => void
  handleMoveDown: () => void
}

export function useMoveHandlers(
  selectedSide: Side,
  setSelectedSide: Dispatch<SetStateAction<Side>>,
  currentNodeIds: PairState<string>,
  selectionModels: PairState<string[]>,
  lastSelectedIds: () => string[],
  resetCurrentSelection: () => void,
  closeAllDialogs: () => void,
): MoveHandlers {
  return {
    handleMove: (): void => {
      const nodeIds = lastSelectedIds()
      if (nodeIds === undefined || nodeIds.length === 0) {
        return
      }

      if (currentNodeIds.left.state === currentNodeIds.right.state) {
        console.log('Source directory is the same as the target directory')
        return
      }

      const otherSide: Side = other(selectedSide)

      moveAll(nodeIds, currentNodeIds[otherSide].state)
        .then(() => {
          resetCurrentSelection()
          selectionModels[otherSide].setState(nodeIds)
          setSelectedSide(otherSide)
        })
        .catch(e => console.log(e))
    },

    handleMoveUp: (): void => {
      const nodeIds = lastSelectedIds()
      if (nodeIds === undefined || nodeIds.length === 0) {
        return
      }
      moveUp(nodeIds)
        .then(() => {
          closeAllDialogs()
          selectionModels[selectedSide].setState(nodeIds)
        })
        .catch(e => console.log(e))
    },

    handleMoveDown: (): void => {
      const nodeIds = lastSelectedIds()
      if (nodeIds === undefined || nodeIds.length === 0) {
        return
      }
      moveDown(nodeIds)
        .then(() => {
          closeAllDialogs()
          selectionModels[selectedSide].setState(nodeIds)
        })
        .catch(e => console.log(e))
    },
  }
}

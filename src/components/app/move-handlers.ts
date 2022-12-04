import { Dispatch, SetStateAction } from 'react'
import { moveAll, moveDown, moveUp } from '../../services/bookmarks/commands'

import { PairState } from '../../services/utils/hooks'
import { Side } from '../../services/utils/types'

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
  const handleMove = (): void => {
    const nodeIds = lastSelectedIds()
    if (nodeIds === undefined || nodeIds.length === 0) {
      return
    }

    if (currentNodeIds.left.state === currentNodeIds.right.state) {
      console.log('Source directory is the same as the target directory')
    }

    const otherSide: Side = selectedSide === 'left' ? 'right' : 'left'

    moveAll(nodeIds, currentNodeIds[otherSide].state)
      .then(() => {
        resetCurrentSelection()
        selectionModels[otherSide].setState(nodeIds)
        setSelectedSide(otherSide)
      })
      .catch(e => console.log(e))
  }

  const handleMoveUp = (): void => {
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
  }

  const handleMoveDown = (): void => {
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
  }

  return {
    handleMove,
    handleMoveUp,
    handleMoveDown,
  }
}

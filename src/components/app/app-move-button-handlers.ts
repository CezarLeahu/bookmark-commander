import { PairCallback, PairState } from '../../services/utils/hooks'
import { Side, other } from '../../services/utils/types'
import { moveAll, moveDown, moveUp } from '../../services/bookmarks/commands'

import { useLastSelectedIds } from './app-content'

interface MoveHandlers {
  handleMoveBetweenPanels: () => void
  handleMoveUp: () => void
  handleMoveDown: () => void
}

export function useMoveHandlers(
  selectedSide: Side,
  highlight: PairCallback<() => void>,
  currentNodeIds: PairState<string>,
  selectionModels: PairState<string[]>,
  refreshRows: () => void,
): MoveHandlers {
  const lastSelectedIds = useLastSelectedIds(selectedSide, selectionModels)

  return {
    handleMoveBetweenPanels: (): void => {
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
          selectionModels[selectedSide].setState([])
          selectionModels[otherSide].setState(nodeIds)
          highlight[otherSide]()
          refreshRows()
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
          selectionModels[selectedSide].setState(nodeIds)
          refreshRows()
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
          selectionModels[selectedSide].setState(nodeIds)
          refreshRows()
        })
        .catch(e => console.log(e))
    },
  }
}

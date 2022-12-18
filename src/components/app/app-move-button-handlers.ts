import { PairCallback, PairRef, PairState } from '../../services/utils/hooks'
import { Side, other } from '../../services/utils/types'
import { moveAll, moveDown, moveUp } from '../../services/bookmarks/commands'

import { FolderPanelHandle } from '../folder-panel/panel-commands'
import { useAppSelector } from '../../store/hooks'
import { useLastSelectedIds } from './app-content'

interface MoveHandlers {
  handleMoveBetweenPanels: () => void
  handleMoveUp: () => void
  handleMoveDown: () => void
}

export function useMoveHandlers(
  panelRefs: PairRef<FolderPanelHandle | null>,
  highlight: PairCallback<() => void>,
  currentNodeIds: PairState<string>,
  refreshRows: () => void,
): MoveHandlers {
  const selectedSide = useAppSelector(state => state.side)

  const lastSelectedIds = useLastSelectedIds(panelRefs)

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
          panelRefs[selectedSide].current?.clearSelection()
          panelRefs[otherSide].current?.setSelection(nodeIds)
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
          panelRefs[selectedSide].current?.setSelection(nodeIds)
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
          panelRefs[selectedSide].current?.setSelection(nodeIds)
          refreshRows()
        })
        .catch(e => console.log(e))
    },
  }
}

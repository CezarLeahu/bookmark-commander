import { PairCallback, PairRef } from '../../services/utils/hooks'
import { Side, other } from '../../services/utils/types'
import { moveAll, moveDown, moveUp } from '../../services/bookmarks/commands'
import { refreshRows, selectFocusedSide } from '../../store/app-state-reducers'
import { selectNodeIds, selectSameNodeIds } from '../../store/panel-state-reducers'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

import { FolderPanelHandle } from '../panel/panel-commands'
import { useLastSelectedIds } from './app-content'

interface MoveHandlers {
  handleMoveBetweenPanels: () => void
  handleMoveUp: () => void
  handleMoveDown: () => void
}

export function useMoveHandlers(
  panelRefs: PairRef<FolderPanelHandle | null>,
  highlight: PairCallback<() => void>,
): MoveHandlers {
  const dispatch = useAppDispatch()
  const focusedSide = useAppSelector(selectFocusedSide)
  const currentNodeIds = useAppSelector(selectNodeIds)
  const sameNodeIds = useAppSelector(selectSameNodeIds)

  const lastSelectedIds = useLastSelectedIds(panelRefs)

  return {
    handleMoveBetweenPanels: (): void => {
      const nodeIds = lastSelectedIds()
      if (nodeIds === undefined || nodeIds.length === 0) {
        return
      }

      if (sameNodeIds) {
        console.log('Source directory is the same as the target directory')
        return
      }

      const otherSide: Side = other(focusedSide)

      moveAll(nodeIds, currentNodeIds[otherSide])
        .then(() => {
          panelRefs[focusedSide].current?.clearSelection()
          panelRefs[otherSide].current?.setSelection(nodeIds)
          highlight[otherSide]()
          dispatch(refreshRows())
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
          panelRefs[focusedSide].current?.setSelection(nodeIds)
          dispatch(refreshRows())
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
          panelRefs[focusedSide].current?.setSelection(nodeIds)
          dispatch(refreshRows())
        })
        .catch(e => console.log(e))
    },
  }
}

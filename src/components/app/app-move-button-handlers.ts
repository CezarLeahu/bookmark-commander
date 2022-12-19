import { PairCallback, PairRef } from '../../services/utils/hooks'
import { Side, other } from '../../services/utils/types'
import { moveAll, moveDown, moveUp } from '../../services/bookmarks/commands'
import { refreshRows, selectFocusedSide } from '../../store/app-state-reducers'
import { selectFocusedNodeId, selectOtherNodeId } from '../../store/panel-state-reducers'
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
  const otherSide: Side = other(focusedSide)
  const focusedNodeId = useAppSelector(selectFocusedNodeId)
  const otherNodeId = useAppSelector(selectOtherNodeId)

  const lastSelectedIds = useLastSelectedIds(panelRefs)

  return {
    handleMoveBetweenPanels: (): void => {
      if (focusedNodeId === otherNodeId) {
        console.log('Source directory is the same as the target directory')
        return
      }

      const selectedIds = lastSelectedIds()
      if (selectedIds === undefined || selectedIds.length === 0) {
        return
      }

      moveAll(selectedIds, otherNodeId)
        .then(() => {
          panelRefs[focusedSide].current?.clearSelection()
          panelRefs[otherSide].current?.setSelection(selectedIds)
          highlight[otherSide]()
          dispatch(refreshRows())
        })
        .catch(e => console.log(e))
    },

    handleMoveUp: (): void => {
      const selectedIds = lastSelectedIds()
      if (selectedIds === undefined || selectedIds.length === 0) {
        return
      }
      moveUp(selectedIds)
        .then(() => {
          panelRefs[focusedSide].current?.setSelection(selectedIds)
          dispatch(refreshRows())
        })
        .catch(e => console.log(e))
    },

    handleMoveDown: (): void => {
      const selectedIds = lastSelectedIds()
      if (selectedIds === undefined || selectedIds.length === 0) {
        return
      }
      moveDown(selectedIds)
        .then(() => {
          panelRefs[focusedSide].current?.setSelection(selectedIds)
          dispatch(refreshRows())
        })
        .catch(e => console.log(e))
    },
  }
}

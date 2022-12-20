import { PairCallback, PairRef } from '../../services/utils/hooks'
import { Side, other } from '../../services/utils/types'
import { moveAll, moveDown, moveUp } from '../../services/bookmarks/commands'
import {
  useSelectFocusedNodeId,
  useSelectFocusedPanelSelectionIds,
  useSelectOtherNodeId,
} from '../../store/panel-state-hooks'

import { FolderPanelHandle } from '../panel/panel-commands'
import { refreshApp } from '../../store/app-state-reducers'
import { useAppDispatch } from '../../store/hooks'
import { useCallback } from 'react'
import { useSelectFocusedSide } from '../../store/app-state-hooks'

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
  const focusedSide = useSelectFocusedSide()
  const otherSide: Side = other(focusedSide)
  const focusedNodeId = useSelectFocusedNodeId()
  const otherNodeId = useSelectOtherNodeId()
  const focusedIds = useSelectFocusedPanelSelectionIds()

  return {
    handleMoveBetweenPanels: (): void => {
      if (focusedNodeId === otherNodeId) {
        console.log('Source directory is the same as the target directory')
        return
      }

      if (focusedIds.length === 0) {
        return
      }

      moveAll(focusedIds, otherNodeId)
        .then(() => {
          panelRefs[focusedSide].current?.clearSelection()
          panelRefs[otherSide].current?.setSelection(focusedIds)
          highlight[otherSide]()
          dispatch(refreshApp())
        })
        .catch(e => console.log(e))
    },

    handleMoveUp: useCallback((): void => {
      if (focusedIds.length === 0) {
        return
      }
      moveUp(focusedIds)
        .then(() => {
          panelRefs[focusedSide].current?.setSelection(focusedIds)
          dispatch(refreshApp())
        })
        .catch(e => console.log(e))
    }, [dispatch, focusedSide, focusedIds, panelRefs]),

    handleMoveDown: useCallback((): void => {
      if (focusedIds === undefined || focusedIds.length === 0) {
        return
      }
      moveDown(focusedIds)
        .then(() => {
          panelRefs[focusedSide].current?.setSelection(focusedIds)
          dispatch(refreshApp())
        })
        .catch(e => console.log(e))
    }, [dispatch, focusedSide, focusedIds, panelRefs]),
  }
}

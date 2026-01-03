import { Side, other } from '../../services/utils/types'
import { focusSide, refreshApp } from '../../store/app-state-reducers'
import { moveAll, moveDown, moveUp } from '../../services/bookmarks/commands'
import {
  useSelectFocusedNodeId,
  useSelectFocusedPanelSelectionIds,
  useSelectOtherNodeId,
} from '../../store/panel-state-hooks'

import { FolderPanelHandle } from '../panel/panel-commands'
import { PairRef } from '../../services/utils/hooks'
import { useAppDispatch } from '../../store/hooks'
import { useCallback } from 'react'
import { useSelectFocusedSide } from '../../store/app-state-hooks'

interface MoveHandlers {
  handleMoveBetweenPanels: () => void
  handleMoveUp: () => void
  handleMoveDown: () => void
}

export function useMoveHandlers(panelRefs: PairRef<FolderPanelHandle | null>): MoveHandlers {
  const dispatch = useAppDispatch()
  const focusedSide = useSelectFocusedSide()
  const otherSide: Side = other(focusedSide)
  const focusedNodeId = useSelectFocusedNodeId()
  const otherNodeId = useSelectOtherNodeId()
  const focusedIds = useSelectFocusedPanelSelectionIds()

  return {
    handleMoveBetweenPanels: (): void => {
      if (focusedSide === undefined) {
        console.log('app-move-button-handlers: handleMoveBetweenPanels: focusedSide is undefined')
        return
      }

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
          panelRefs[focusedSide].current?.clearFocus()
          // no point in actually clearing the value since it gets immediately updated anyway
          // dispatch(updateLastHighlight({ side: focusedSide, id: undefined }))
          dispatch(focusSide(otherSide))
          dispatch(refreshApp())
          setTimeout(() => {
            panelRefs[otherSide].current?.select(focusedIds)
            panelRefs[otherSide].current?.focus(focusedIds[0])
          }, 100)
        })
        .catch(e => console.log(e))
    },

    handleMoveUp: useCallback((): void => {
      if (focusedSide === undefined) {
        console.log('app-move-button-handlers: handleMoveUp: focusedSide is undefined')
        return
      }

      if (focusedIds.length === 0) {
        return
      }

      moveUp(focusedIds)
        .then(() => {
          panelRefs[focusedSide].current?.select(focusedIds)
          setTimeout(() => panelRefs[focusedSide].current?.focus(focusedIds[0]), 100)
          dispatch(refreshApp())
        })
        .catch(e => console.log(e))
    }, [dispatch, focusedSide, focusedIds, panelRefs]),

    handleMoveDown: useCallback((): void => {
      if (focusedSide === undefined) {
        console.log('app-move-button-handlers: handleMoveDown: focusedSide is undefined')
        return
      }

      if (focusedIds.length === 0) {
        return
      }

      moveDown(focusedIds)
        .then(() => {
          panelRefs[focusedSide].current?.select(focusedIds)
          setTimeout(() => panelRefs[focusedSide].current?.focus(focusedIds[0]), 100)
          dispatch(refreshApp())
        })
        .catch(e => console.log(e))
    }, [dispatch, focusedSide, focusedIds, panelRefs]),
  }
}

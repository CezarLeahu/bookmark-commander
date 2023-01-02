import { focusSide, refreshApp } from '../../store/app-state-reducers'
import { useCallback, useState } from 'react'
import {
  useSelectFocusedNodeId,
  useSelectFocusedPanelSelectionIds,
  useSelectOtherNodeId,
} from '../../store/panel-state-hooks'

import { FolderPanelHandle } from '../panel/panel-commands'
import { PairRef } from '../../services/utils/hooks'
import { containsNonEmptyDirectories } from '../../services/bookmarks/queries'
import { other } from '../../services/utils/types'
import { removeAll } from '../../services/bookmarks/commands'
import { useAppDispatch } from '../../store/hooks'
import { useSelectFocusedSide } from '../../store/app-state-hooks'
import { useUpdateCurrentPathsIfNeeded } from '../app/app-content'

interface DeleteDialogState {
  open: boolean
  handleOpen: () => void
  handleConfirm: () => void
  handleClose: () => void
}

export function useDeleteDialogState(
  panelRefs: PairRef<FolderPanelHandle | null>,
): DeleteDialogState {
  const dispatch = useAppDispatch()
  const focusedSide = useSelectFocusedSide()
  const nodeId = useSelectFocusedNodeId()
  const otherNodeId = useSelectOtherNodeId()
  const selectedIds = useSelectFocusedPanelSelectionIds()

  const [open, setOpen] = useState(false)
  const [nearbyRowId, setNearbyRowId] = useState<string>()

  const updateCurrentPathsIfNeeded = useUpdateCurrentPathsIfNeeded()

  return {
    open,

    handleOpen: useCallback((): void => {
      if (selectedIds.length > 0) {
        setOpen(true)
        setNearbyRowId(panelRefs[focusedSide].current?.retrieveRowIdNearSelection())
      }
    }, [panelRefs, selectedIds, focusedSide]),

    handleConfirm: useCallback((): void => {
      if (selectedIds.length === 0) {
        setOpen(false)
        return
      }
      updateCurrentPathsIfNeeded(selectedIds)

      containsNonEmptyDirectories(selectedIds)
        .then(nonEmptyDirsExist => {
          if (nonEmptyDirsExist) {
            console.log('Cannot delete non-empty folders!')
            setOpen(false)
            return
          }
          removeAll(selectedIds)
            .then(() => {
              setOpen(false)
              dispatch(focusSide(focusedSide))
              dispatch(refreshApp())
              panelRefs[focusedSide].current?.clearSelection()
              if (nearbyRowId !== undefined) {
                panelRefs[focusedSide].current?.focus(nearbyRowId)
              } else {
                panelRefs[focusedSide].current?.clearFocus()
              }

              if (nodeId === otherNodeId) {
                panelRefs[other(focusedSide)].current?.clearSelection()
                panelRefs[other(focusedSide)].current?.clearFocus()
              }
            })
            .catch(e => console.log(e))
        })
        .catch(e => console.log(e))
    }, [
      dispatch,
      panelRefs,
      focusedSide,
      nodeId,
      otherNodeId,
      selectedIds,
      updateCurrentPathsIfNeeded,
      nearbyRowId,
    ]),

    handleClose: useCallback((): void => setOpen(false), []),
  }
}

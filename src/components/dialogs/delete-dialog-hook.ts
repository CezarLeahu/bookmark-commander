import { useCallback, useState } from 'react'

import { FolderPanelHandle } from '../panel/panel-commands'
import { PairRef } from '../../services/utils/hooks'
import { containsNonEmptyDirectories } from '../../services/bookmarks/queries'
import { refreshApp } from '../../store/app-state-reducers'
import { removeAll } from '../../services/bookmarks/commands'
import { useAppDispatch } from '../../store/hooks'
import { useSelectFocusedPanelSelectionIds } from '../../store/panel-state-hooks'
import { useUpdateCurrentPathsIfNeeded } from '../app/app-content'

interface DeleteDialogState {
  open: boolean
  handleOpen: () => void
  handleConfirm: () => void
  handleClose: () => void
}

export function useDeleteDialogState(
  resetCurrentSelection: () => void,
  panelRefs: PairRef<FolderPanelHandle | null>,
): DeleteDialogState {
  const dispatch = useAppDispatch()
  const focusedIds = useSelectFocusedPanelSelectionIds()

  const [open, setOpen] = useState(false)

  const updateCurrentPathsIfNeeded = useUpdateCurrentPathsIfNeeded()

  return {
    open,

    handleOpen: useCallback((): void => {
      if (focusedIds.length > 0) {
        panelRefs.left.current?.clearFocus()
        panelRefs.right.current?.clearFocus()
        setOpen(true)
      }
    }, [focusedIds, panelRefs]),

    handleConfirm: useCallback((): void => {
      if (focusedIds.length === 0) {
        setOpen(false)
        return
      }
      updateCurrentPathsIfNeeded(focusedIds)

      containsNonEmptyDirectories(focusedIds)
        .then(nonEmptyDirsExist => {
          if (nonEmptyDirsExist) {
            console.log('Cannot delete non-empty folders!')
            setOpen(false)
            return
          }
          removeAll(focusedIds)
            .then(() => {
              setOpen(false)
              dispatch(refreshApp())
              resetCurrentSelection()
            })
            .catch(e => console.log(e))
        })
        .catch(e => console.log(e))
    }, [dispatch, focusedIds, updateCurrentPathsIfNeeded, resetCurrentSelection]),

    handleClose: useCallback((): void => setOpen(false), []),
  }
}

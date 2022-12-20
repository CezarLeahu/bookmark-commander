import { useCallback, useState } from 'react'

import { FolderPanelHandle } from '../panel/panel-commands'
import { PairRef } from '../../services/utils/hooks'
import { containsNonEmptyDirectories } from '../../services/bookmarks/queries'
import { refreshApp } from '../../store/app-state-reducers'
import { removeAll } from '../../services/bookmarks/commands'
import { useAppDispatch } from '../../store/hooks'
import { useLastSelectedIds } from '../app/app-content'
import { useSelectFocusedSide } from '../../store/app-state-hooks'

interface DeleteDialogState {
  open: boolean
  handleOpen: () => void
  handleConfirm: () => void
  handleClose: () => void
}

export function useDeleteDialogState(
  updateCurrentPathsIfNeeded: (idsToBeDeleted: string[]) => void,
  resetCurrentSelection: () => void,
  panelRefs: PairRef<FolderPanelHandle | null>,
): DeleteDialogState {
  const dispatch = useAppDispatch()
  const focusedSide = useSelectFocusedSide()
  const lastSelectedIds = useLastSelectedIds()

  const [open, setOpen] = useState(false)

  return {
    open,

    handleOpen: useCallback((): void => {
      panelRefs[focusedSide].current?.ensureAtLeastOneRowSelected()
      panelRefs.left.current?.clearFocus()
      panelRefs.right.current?.clearFocus()
      setOpen(true)
    }, [focusedSide, panelRefs]),

    handleConfirm: useCallback((): void => {
      const ids: string[] = lastSelectedIds()
      if (ids.length === 0) {
        setOpen(false)
        return
      }
      updateCurrentPathsIfNeeded(ids)

      containsNonEmptyDirectories(ids)
        .then(nonEmptyDirsExist => {
          if (nonEmptyDirsExist) {
            console.log('Cannot delete non-empty folders!')
            setOpen(false)
            return
          }
          removeAll(ids)
            .then(() => {
              setOpen(false)
              dispatch(refreshApp())
              resetCurrentSelection()
            })
            .catch(e => console.log(e))
        })
        .catch(e => console.log(e))
    }, [dispatch, lastSelectedIds, updateCurrentPathsIfNeeded, resetCurrentSelection]),

    handleClose: useCallback((): void => setOpen(false), []),
  }
}

import { useCallback, useState } from 'react'

import { containsNonEmptyDirectories } from '../../services/bookmarks/queries'
import { removeAll } from '../../services/bookmarks/commands'

interface DeleteDialogState {
  open: boolean
  handleOpen: () => void
  handleConfirm: () => void
  handleClose: () => void
}

export function useDeleteDialogState(
  lastSelectedIds: () => string[],
  updateCurrentPathsIfNeeded: (idsToBeDeleted: string[]) => void,
  resetCurrentSelection: () => void,
  refreshRows: () => void,
): DeleteDialogState {
  const [open, setOpen] = useState(false)

  return {
    open,
    handleOpen: useCallback((): void => setOpen(true), []),
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
              refreshRows()
              resetCurrentSelection()
            })
            .catch(e => console.log(e))
        })
        .catch(e => console.log(e))
    }, [lastSelectedIds, updateCurrentPathsIfNeeded, resetCurrentSelection, refreshRows]),

    handleClose: useCallback((): void => setOpen(false), []),
  }
}

import { Dispatch, SetStateAction, useCallback, useState } from 'react'

import { containsNonEmptyDirectories } from '../../services/bookmarks/queries'
import { removeAll } from '../../services/bookmarks/commands'

interface DeleteDialogState {
  deleteDialogOpen: boolean
  handleDeleteDialogOpen: () => void
  handleDeleteDialogConfirm: () => void
  handleDeleteDialogClose: () => void
}

export function useDeleteDialogState(
  lastSelectedIds: () => string[],
  resetCurrentSelection: () => void,
  setError: Dispatch<SetStateAction<string | undefined>>,
): DeleteDialogState {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  return {
    deleteDialogOpen,
    handleDeleteDialogOpen: useCallback((): void => setDeleteDialogOpen(true), []),
    handleDeleteDialogConfirm: useCallback((): void => {
      const ids: string[] = lastSelectedIds()
      if (ids.length === 0) {
        setDeleteDialogOpen(false)
        return
      }

      containsNonEmptyDirectories(ids)
        .then(nonEmptyDirsExist => {
          if (nonEmptyDirsExist) {
            setError('Cannot delete non-empty folders!')
            setDeleteDialogOpen(false)
            return
          }
          removeAll(ids)
            .then(() => {
              setDeleteDialogOpen(false)
              resetCurrentSelection()
            })
            .catch(e => console.log(e))
        })
        .catch(e => console.log(e))
    }, [lastSelectedIds, resetCurrentSelection, setError]),

    handleDeleteDialogClose: useCallback((): void => setDeleteDialogOpen(false), []),
  }
}

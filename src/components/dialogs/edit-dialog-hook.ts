import { Dispatch, SetStateAction, useCallback, useState } from 'react'

import { BTN } from '../../services/bookmarks/types'
import { update } from '../../services/bookmarks/commands'

interface EditDialogState {
  editDialogOpen: boolean
  handleEditDialogOpen: () => void
  handleEditDialogConfirm: (node: BTN) => void
  handleEditDialogClose: () => void
}

export function useEditDialogState(
  resetCurrentSelection: () => void,
  setError: Dispatch<SetStateAction<string | undefined>>,
): EditDialogState {
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  return {
    editDialogOpen,
    handleEditDialogOpen: useCallback((): void => setEditDialogOpen(true), []),
    handleEditDialogConfirm: useCallback(
      (node: BTN): void => {
        update(node)
          .then(() => {
            setEditDialogOpen(false)
            resetCurrentSelection()
          })
          .catch(e => setError(e))
      },
      [resetCurrentSelection, setError],
    ),
    handleEditDialogClose: useCallback((): void => setEditDialogOpen(false), []),
  }
}

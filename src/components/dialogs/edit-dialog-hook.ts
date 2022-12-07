import { useCallback, useState } from 'react'

import { BTN } from '../../services/bookmarks/types'
import { update } from '../../services/bookmarks/commands'

interface EditDialogState {
  open: boolean
  handleOpen: () => void
  handleConfirm: (node: BTN) => void
  handleClose: () => void
}

export function useEditDialogState(
  resetCurrentSelection: () => void,
  refreshRows: () => void,
): EditDialogState {
  const [open, setOpen] = useState(false)

  return {
    open,
    handleOpen: useCallback((): void => setOpen(true), []),
    handleConfirm: useCallback(
      (node: BTN): void => {
        update(node)
          .then(() => {
            setOpen(false)
            refreshRows()
            resetCurrentSelection()
          })
          .catch(e => console.log(e))
      },
      [resetCurrentSelection, refreshRows],
    ),
    handleClose: useCallback((): void => setOpen(false), []),
  }
}

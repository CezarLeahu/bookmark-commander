import { useCallback, useState } from 'react'

import { BTN } from '../../services/bookmarks/types'
import { FolderPanelHandle } from '../folder-panel/panel-commands'
import { PairRef } from '../../services/utils/hooks'
import { Side } from '../../services/utils/types'
import { update } from '../../services/bookmarks/commands'

interface EditDialogState {
  open: boolean
  handleOpen: () => void
  handleConfirm: (node: BTN) => void
  handleClose: () => void
}

export function useEditDialogState(
  selectedSide: Side,
  resetCurrentSelection: () => void,
  refreshRows: () => void,
  panelRefs: PairRef<FolderPanelHandle | null>,
): EditDialogState {
  const [open, setOpen] = useState(false)

  return {
    open,

    handleOpen: useCallback((): void => {
      panelRefs[selectedSide].current?.ensureAtLeastOneRowSelected()
      panelRefs.left.current?.clearFocus()
      panelRefs.right.current?.clearFocus()
      setOpen(true)
    }, [selectedSide, panelRefs]),

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

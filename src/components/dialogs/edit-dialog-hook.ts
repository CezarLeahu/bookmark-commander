import { useCallback, useState } from 'react'

import { BTN } from '../../services/bookmarks/types'
import { FolderPanelHandle } from '../panel/panel-commands'
import { PairRef } from '../../services/utils/hooks'
import { update } from '../../services/bookmarks/commands'
import { useAppSelector } from '../../store/hooks'

interface EditDialogState {
  open: boolean
  handleOpen: () => void
  handleConfirm: (node: BTN) => void
  handleClose: () => void
}

export function useEditDialogState(
  resetCurrentSelection: () => void,
  refreshRows: () => void,
  panelRefs: PairRef<FolderPanelHandle | null>,
): EditDialogState {
  const selectedSide = useAppSelector(state => state.side)

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

import { useCallback, useState } from 'react'

import { BTN } from '../../services/bookmarks/types'
import { FolderPanelHandle } from '../panel/panel-commands'
import { PairRef } from '../../services/utils/hooks'
import { refreshApp } from '../../store/app-state-reducers'
import { update } from '../../services/bookmarks/commands'
import { useAppDispatch } from '../../store/hooks'
import { useSelectFocusedSide } from '../../store/app-state-hooks'

interface EditDialogState {
  open: boolean
  handleOpen: () => void
  handleConfirm: (node: BTN) => void
  handleClose: () => void
}

export function useEditDialogState(
  resetCurrentSelection: () => void,
  panelRefs: PairRef<FolderPanelHandle | null>,
): EditDialogState {
  const dispatch = useAppDispatch()
  const focusedSide = useSelectFocusedSide()

  const [open, setOpen] = useState(false)

  return {
    open,

    handleOpen: useCallback((): void => {
      panelRefs[focusedSide].current?.ensureAtLeastOneRowSelected()
      panelRefs.left.current?.clearFocus()
      panelRefs.right.current?.clearFocus()
      setOpen(true)
    }, [focusedSide, panelRefs]),

    handleConfirm: useCallback(
      (node: BTN): void => {
        update(node)
          .then(() => {
            setOpen(false)
            dispatch(refreshApp())
            resetCurrentSelection()
          })
          .catch(e => console.log(e))
      },
      [dispatch, resetCurrentSelection],
    ),

    handleClose: useCallback((): void => setOpen(false), []),
  }
}

import { focusSide, refreshApp } from '../../store/app-state-reducers'
import { useCallback, useState } from 'react'

import { BTN } from '../../services/bookmarks/types'
import { FolderPanelHandle } from '../panel/panel-commands'
import { PairRef } from '../../services/utils/hooks'
import { update } from '../../services/bookmarks/commands'
import { useAppDispatch } from '../../store/hooks'
import { useSelectFocusedSide } from '../../store/app-state-hooks'

interface EditDialogState {
  open: boolean
  handleOpen: () => void
  handleConfirm: (node: BTN) => void
  handleClose: () => void
}

export function useEditDialogState(panelRefs: PairRef<FolderPanelHandle | null>): EditDialogState {
  const dispatch = useAppDispatch()
  const focusedSide = useSelectFocusedSide()

  const [open, setOpen] = useState(false)

  return {
    open,

    handleOpen: useCallback((): void => setOpen(true), []),

    handleConfirm: useCallback(
      (node: BTN): void => {
        update(node)
          .then(() => {
            setOpen(false)
            dispatch(focusSide(focusedSide))
            dispatch(refreshApp())
            panelRefs[focusedSide].current?.focus(node.id)
          })
          .catch(e => console.log(e))
      },
      [dispatch, panelRefs, focusedSide],
    ),

    handleClose: useCallback((): void => setOpen(false), []),
  }
}

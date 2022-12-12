import { useCallback, useState } from 'react'

import { FolderPanelHandle } from '../folder-panel/panel-commands'
import { PairRef } from '../../services/utils/hooks'
import { Side } from '../../services/utils/types'
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
  selectedSide: Side,
  updateCurrentPathsIfNeeded: (idsToBeDeleted: string[]) => void,
  resetCurrentSelection: () => void,
  refreshRows: () => void,
  panelRefs: PairRef<FolderPanelHandle | null>,
): DeleteDialogState {
  const [open, setOpen] = useState(false)

  return {
    open,

    handleOpen: useCallback((): void => {
      panelRefs[selectedSide].current?.ensureAtLeastOneRowSelected()
      panelRefs.left.current?.clearFocus()
      panelRefs.right.current?.clearFocus()
      setOpen(true)
    }, [selectedSide, panelRefs]),

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

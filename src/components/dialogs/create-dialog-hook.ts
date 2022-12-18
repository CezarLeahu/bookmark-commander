import { PairRef, PairState } from '../../services/utils/hooks'
import { createBookmark, createDir } from '../../services/bookmarks/commands'
import { useCallback, useState } from 'react'

import { FolderPanelHandle } from '../folder-panel/panel-commands'
import { useAppSelector } from '../../store/hooks'

interface CreateDialogState {
  bookmarkOpen: boolean
  directoryOpen: boolean
  isOpen: () => boolean
  handleBookmarkOpen: () => void
  handleDirectoryOpen: () => void
  handleConfirm: (title: string, url?: string) => void
  handleClose: () => void
}

export function useCreateDialogState(
  currentNodeIds: PairState<string>,
  resetCurrentSelection: () => void,
  refreshRows: () => void,
  panelRefs: PairRef<FolderPanelHandle | null>,
): CreateDialogState {
  const selectedSide = useAppSelector(state => state.side)

  const [bookmarkOpen, setBookmarkOpen] = useState(false)
  const [directoryOpen, setDirectoryOpen] = useState(false)

  return {
    bookmarkOpen,
    directoryOpen,

    isOpen: useCallback(
      (): boolean => bookmarkOpen || directoryOpen,
      [bookmarkOpen, directoryOpen],
    ),

    handleBookmarkOpen: useCallback((): void => {
      panelRefs.left.current?.clearFocus()
      panelRefs.right.current?.clearFocus()
      setBookmarkOpen(true)
    }, [panelRefs.left, panelRefs.right]),

    handleDirectoryOpen: useCallback((): void => {
      panelRefs.left.current?.clearFocus()
      panelRefs.right.current?.clearFocus()
      setDirectoryOpen(true)
    }, [panelRefs.left, panelRefs.right]),

    handleConfirm: useCallback(
      (title: string, url?: string): void => {
        const parentId = currentNodeIds[selectedSide].state
        if (parentId === undefined) {
          console.log('The current panel current node id is unknown (undefined).')
          setBookmarkOpen(false)
          setDirectoryOpen(false)
          return
        }

        if (url === undefined) {
          createDir(parentId, title)
            .then(() => {
              setBookmarkOpen(false)
              setDirectoryOpen(false)
              refreshRows()
              resetCurrentSelection()
            })
            .catch(e => console.log(e))
        } else {
          createBookmark(parentId, title, url)
            .then(() => {
              setBookmarkOpen(false)
              setDirectoryOpen(false)
              refreshRows()
              resetCurrentSelection()
            })
            .catch(e => console.log(e))
        }
      },
      [currentNodeIds, selectedSide, resetCurrentSelection, refreshRows],
    ),

    handleClose: useCallback((): void => {
      setBookmarkOpen(false)
      setDirectoryOpen(false)
    }, []),
  }
}

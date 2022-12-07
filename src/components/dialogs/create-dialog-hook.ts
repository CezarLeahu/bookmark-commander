import { createBookmark, createDir } from '../../services/bookmarks/commands'
import { useCallback, useState } from 'react'

import { PairState } from '../../services/utils/hooks'
import { Side } from '../../services/utils/types'

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
  selectedSide: Side,
  currentNodeIds: PairState<string>,
  resetCurrentSelection: () => void,
): CreateDialogState {
  const [bookmarkOpen, setBookmarkOpen] = useState(false)
  const [directoryOpen, setDirectoryOpen] = useState(false)

  return {
    bookmarkOpen,
    directoryOpen,
    isOpen: useCallback(
      (): boolean => bookmarkOpen || directoryOpen,
      [bookmarkOpen, directoryOpen],
    ),
    handleBookmarkOpen: useCallback((): void => setBookmarkOpen(true), []),
    handleDirectoryOpen: useCallback((): void => setDirectoryOpen(true), []),
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
              resetCurrentSelection()
            })
            .catch(e => console.log(e))
        } else {
          createBookmark(parentId, title, url)
            .then(() => {
              setBookmarkOpen(false)
              setDirectoryOpen(false)
              resetCurrentSelection()
            })
            .catch(e => console.log(e))
        }
      },
      [currentNodeIds, selectedSide, resetCurrentSelection],
    ),
    handleClose: useCallback((): void => {
      setBookmarkOpen(false)
      setDirectoryOpen(false)
    }, []),
  }
}

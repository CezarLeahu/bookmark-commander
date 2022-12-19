import { createBookmark, createDir } from '../../services/bookmarks/commands'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useCallback, useState } from 'react'

import { FolderPanelHandle } from '../panel/panel-commands'
import { PairRef } from '../../services/utils/hooks'
import { refreshRows } from '../../store/app-state-reducers'
import { selectFocusedNodeId } from '../../store/panel-state-reducers'

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
  resetCurrentSelection: () => void,
  panelRefs: PairRef<FolderPanelHandle | null>,
): CreateDialogState {
  const dispatch = useAppDispatch()
  const focusedNodeId = useAppSelector(selectFocusedNodeId)

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
        const parentId = focusedNodeId
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
              dispatch(refreshRows())
              resetCurrentSelection()
            })
            .catch(e => console.log(e))
        } else {
          createBookmark(parentId, title, url)
            .then(() => {
              setBookmarkOpen(false)
              setDirectoryOpen(false)
              dispatch(refreshRows())
              resetCurrentSelection()
            })
            .catch(e => console.log(e))
        }
      },
      [dispatch, focusedNodeId, resetCurrentSelection],
    ),

    handleClose: useCallback((): void => {
      setBookmarkOpen(false)
      setDirectoryOpen(false)
    }, []),
  }
}

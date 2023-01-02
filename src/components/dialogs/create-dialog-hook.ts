import { createBookmark, createDir } from '../../services/bookmarks/commands'
import { focusSide, refreshApp } from '../../store/app-state-reducers'
import { useCallback, useState } from 'react'

import { FolderPanelHandle } from '../panel/panel-commands'
import { PairRef } from '../../services/utils/hooks'
import { useAppDispatch } from '../../store/hooks'
import { useSelectFocusedNodeId } from '../../store/panel-state-hooks'
import { useSelectFocusedSide } from '../../store/app-state-hooks'

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
  panelRefs: PairRef<FolderPanelHandle | null>,
): CreateDialogState {
  const dispatch = useAppDispatch()
  const focusedSide = useSelectFocusedSide()
  const focusedNodeId = useSelectFocusedNodeId()

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
        const parentId = focusedNodeId
        if (parentId === undefined) {
          console.log('The current panel current node id is unknown (undefined).')
          setBookmarkOpen(false)
          setDirectoryOpen(false)
          return
        }

        if (url === undefined) {
          createDir(parentId, title)
            .then(node => {
              setBookmarkOpen(false)
              setDirectoryOpen(false)
              dispatch(focusSide(focusedSide))
              dispatch(refreshApp())
              panelRefs[focusedSide].current?.clearSelection()
              setTimeout(() => {
                panelRefs[focusedSide].current?.focus(node.id)
              }, 100)
            })
            .catch(e => console.log(e))
        } else {
          createBookmark(parentId, title, url)
            .then(node => {
              setBookmarkOpen(false)
              setDirectoryOpen(false)
              dispatch(focusSide(focusedSide))
              dispatch(refreshApp())
              panelRefs[focusedSide].current?.clearSelection()
              setTimeout(() => {
                panelRefs[focusedSide].current?.focus(node.id)
              }, 100)
            })
            .catch(e => console.log(e))
        }
      },
      [dispatch, panelRefs, focusedSide, focusedNodeId],
    ),

    handleClose: useCallback((): void => {
      setBookmarkOpen(false)
      setDirectoryOpen(false)
    }, []),
  }
}

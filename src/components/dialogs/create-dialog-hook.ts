import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { createBookmark, createDir } from '../../services/bookmarks/commands'

import { PairState } from '../../services/utils/hooks'
import { Side } from '../../services/utils/types'

interface CreateDialogState {
  createBookmarkDialogOpen: boolean
  createDirectoryDialogOpen: boolean
  handleCreateBookmarkDialogOpen: () => void
  handleCreateDirectoryDialogOpen: () => void
  handleCreateDialogConfirm: (title: string, url?: string) => void
  handleCreateDialogClose: () => void
}

export function useCreateDialogState(
  selectedSide: Side,
  currentNodeIds: PairState<string>,
  resetCurrentSelection: () => void,
  setError: Dispatch<SetStateAction<string | undefined>>,
): CreateDialogState {
  const [createBookmarkDialogOpen, setCreateBookmarkDialogOpen] = useState(false)
  const [createDirectoryDialogOpen, setCreateDirectoryDialogOpen] = useState(false)

  return {
    createBookmarkDialogOpen,
    createDirectoryDialogOpen,
    handleCreateBookmarkDialogOpen: useCallback((): void => setCreateBookmarkDialogOpen(true), []),
    handleCreateDirectoryDialogOpen: useCallback(
      (): void => setCreateDirectoryDialogOpen(true),
      [],
    ),
    handleCreateDialogConfirm: useCallback(
      (title: string, url?: string): void => {
        const parentId = currentNodeIds[selectedSide].state
        if (parentId === undefined) {
          console.log('The current panel current node id is unknown (undefined).')
          setCreateBookmarkDialogOpen(false)
          setCreateDirectoryDialogOpen(false)
          return
        }

        if (url === undefined) {
          createDir(parentId, title)
            .then(() => {
              setCreateBookmarkDialogOpen(false)
              setCreateDirectoryDialogOpen(false)
              resetCurrentSelection()
            })
            .catch(e => setError(e))
        } else {
          createBookmark(parentId, title, url)
            .then(() => {
              setCreateBookmarkDialogOpen(false)
              setCreateDirectoryDialogOpen(false)
              resetCurrentSelection()
            })
            .catch(e => setError(e))
        }
      },
      [currentNodeIds, selectedSide, resetCurrentSelection, setError],
    ),
    handleCreateDialogClose: useCallback((): void => {
      setCreateBookmarkDialogOpen(false)
      setCreateDirectoryDialogOpen(false)
    }, []),
  }
}

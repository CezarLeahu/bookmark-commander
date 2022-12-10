import * as keys from '../../services/utils/keys'

import { Dispatch, SetStateAction, useCallback, useEffect } from 'react'
import { KEYDOWN, KEYUP } from '../../services/utils/events'
import { PairRef, PairState } from '../../services/utils/hooks'
import { Side, other } from '../../services/utils/types'

import { FolderPanelHandle } from '../folder-panel/panel-commands'

export function useDocumentKeyListener(
  selectedSide: Side,
  setSelectedSide: Dispatch<SetStateAction<Side>>,
  selectionModels: PairState<string[]>,
  panelRefs: PairRef<FolderPanelHandle | null>,
  lastSelectedIds: () => string[],
  handleDeleteDialogOpen: () => void,
): void {
  const handleKeyUp = useCallback(
    (e: KeyboardEvent): void => {
      switch (e.key) {
        case keys.BACKSPACE:
        case keys.DELETE: {
          if (lastSelectedIds().length === 0) {
            const highlightedRowId = panelRefs[selectedSide].current?.highlightedRowId()
            if (highlightedRowId === undefined) {
              return
            }
            selectionModels[selectedSide].setState([highlightedRowId])
          }
          handleDeleteDialogOpen()
          break
        }
        case keys.TAB: {
          setSelectedSide(other(selectedSide))
          break
        }
        case keys.ENTER: {
          panelRefs[selectedSide].current?.openHighlightedRow()
          break
        }
      }
    },
    [
      handleDeleteDialogOpen,
      lastSelectedIds,
      selectedSide,
      setSelectedSide,
      panelRefs,
      selectionModels,
    ],
  )

  const handleKeyDown = useCallback((e: KeyboardEvent): void => {
    if (e.key === keys.TAB) {
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()
    }
  }, [])

  useEffect(() => {
    document.addEventListener(KEYDOWN, handleKeyDown)
    document.addEventListener(KEYUP, handleKeyUp)
    return () => {
      document.removeEventListener(KEYDOWN, handleKeyDown)
      document.removeEventListener(KEYUP, handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])
}

import * as keys from '../../services/utils/keys'

import { KEYDOWN, KEYUP } from '../../services/utils/events'
import { Side, other } from '../../services/utils/types'
import { useCallback, useEffect } from 'react'

import { PairCallback } from '../../services/utils/hooks'
import { selectFocusedSide } from '../../store/app-state-reducers'
import { useAppSelector } from '../../store/hooks'

const handleKeyUp = (
  e: KeyboardEvent,
  selectedSide: Side,
  highlight: PairCallback<() => void>,
): void => {
  if (e.key === keys.TAB) {
    e.preventDefault()
    e.stopImmediatePropagation()
    highlight[other(selectedSide)]()
  }
}

const handleKeyDown = (e: KeyboardEvent): void => {
  if (e.key === keys.TAB) {
    e.stopImmediatePropagation()
    e.preventDefault()
  }
}

export function useDocumentKeyListener(
  area: HTMLDivElement | null,
  highlight: PairCallback<() => void>,
): void {
  const focusedSide = useAppSelector(selectFocusedSide)

  const handleKeyUpCallback = useCallback(
    (e: KeyboardEvent): void => handleKeyUp(e, focusedSide, highlight),
    [focusedSide, highlight],
  )

  useEffect(() => {
    if (area === undefined || area === null) {
      return
    }
    area.addEventListener(KEYDOWN, handleKeyDown, { capture: true })
    area.addEventListener(KEYUP, handleKeyUpCallback, { capture: true })
    return () => {
      area.removeEventListener(KEYDOWN, handleKeyDown, { capture: true })
      area.removeEventListener(KEYUP, handleKeyUpCallback, { capture: true })
    }
  }, [area, handleKeyUpCallback])
}

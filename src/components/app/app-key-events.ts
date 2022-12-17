import * as keys from '../../services/utils/keys'

import { KEYDOWN, KEYUP } from '../../services/utils/events'
import { Side, other } from '../../services/utils/types'
import { useCallback, useEffect } from 'react'

import { PairCallback } from '../../services/utils/hooks'

export function useDocumentKeyListener(
  area: HTMLDivElement | null,
  selectedSide: Side,
  highlight: PairCallback<() => void>,
): void {
  const handleKeyUp = useCallback(
    (e: KeyboardEvent): void => {
      if (e.key === keys.TAB) {
        e.preventDefault()
        e.stopImmediatePropagation()
        highlight[other(selectedSide)]()
      }
    },
    [selectedSide, highlight],
  )

  const handleKeyDown = useCallback((e: KeyboardEvent): void => {
    if (e.key === keys.TAB) {
      e.stopImmediatePropagation()
      e.preventDefault()
    }
  }, [])

  useEffect(() => {
    if (area === undefined || area === null) {
      return
    }
    area.addEventListener(KEYDOWN, handleKeyDown, { capture: true })
    area.addEventListener(KEYUP, handleKeyUp, { capture: true })
    return () => {
      area.removeEventListener(KEYDOWN, handleKeyDown, { capture: true })
      area.removeEventListener(KEYUP, handleKeyUp, { capture: true })
    }
  }, [area, handleKeyDown, handleKeyUp])
}

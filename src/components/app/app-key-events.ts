import * as keys from '../../services/utils/keys'

import { KEYDOWN, KEYUP } from '../../services/utils/events'
import { useCallback, useEffect } from 'react'

import { focusSide } from '../../store/app-state-reducers'
import { other } from '../../services/utils/types'
import { useAppDispatch } from '../../store/hooks'
import { useSelectFocusedSide } from '../../store/app-state-hooks'

const handleKeyDown = (e: KeyboardEvent): void => {
  if (e.key === keys.TAB) {
    e.stopImmediatePropagation()
    e.preventDefault()
  }
}

export function useDocumentKeyListener(area: HTMLDivElement | null): void {
  const dispatch = useAppDispatch()
  const focusedSide = useSelectFocusedSide()

  const handleKeyUpCallback = useCallback(
    (e: KeyboardEvent): void => {
      if (e.key === keys.TAB) {
        e.preventDefault()
        e.stopImmediatePropagation()
        dispatch(focusSide(other(focusedSide)))
      }
    },
    [dispatch, focusedSide],
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

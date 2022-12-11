import * as keys from '../../services/utils/keys'

import { useCallback, useEffect } from 'react'

import { KEYDOWN } from '../../services/utils/events'

export function useDocumentKeyListener(): void {
  const handleKeyDown = useCallback((e: KeyboardEvent): void => {
    if (e.key === keys.TAB) {
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()
    }
  }, [])

  useEffect(() => {
    document.addEventListener(KEYDOWN, handleKeyDown)
    return () => {
      document.removeEventListener(KEYDOWN, handleKeyDown)
    }
  }, [handleKeyDown])
}

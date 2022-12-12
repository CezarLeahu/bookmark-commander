import * as keys from '../../services/utils/keys'

import { KeyboardEvent, useCallback } from 'react'

const permittedKeys = new Set<string>([keys.ESCAPE, keys.TAB])

export function useKeyDownCallback(): (e: KeyboardEvent<HTMLDivElement>) => void {
  return useCallback((e: KeyboardEvent): void => {
    if (!permittedKeys.has(e.key)) {
      e.stopPropagation()
    }
  }, [])
}

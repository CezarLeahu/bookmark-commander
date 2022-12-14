import { useCallback, useEffect } from 'react'

import { MOUSEUP } from '../../services/utils/events'
import { Navigation } from './panel-history'

export function usePanelMouseListener(
  highlighted: boolean,
  containerRef: React.RefObject<HTMLDivElement>,
  navigation: Navigation,
): void {
  const handleMouseButton: (e: MouseEvent) => void = useCallback(
    (e: MouseEvent): void => {
      switch (e.button) {
        case 3: {
          console.log('Mouse X1 button (back) - 3')
          if (highlighted) {
            e.preventDefault()
            navigation.back()
          }
          break
        }
        case 4: {
          console.log('Mouse X2 button (forward) - 4')
          if (highlighted) {
            e.preventDefault()
            navigation.forward()
          }
          break
        }
      }
    },
    [highlighted, navigation],
  )

  useEffect(() => {
    if (containerRef.current === undefined || containerRef.current === null) {
      return
    }
    const elem = containerRef.current
    elem.addEventListener(MOUSEUP, handleMouseButton)
    return () => {
      elem.removeEventListener(MOUSEUP, handleMouseButton)
    }
  }, [containerRef, handleMouseButton])
}

import { useCallback, useEffect } from 'react'

import { MOUSEUP } from '../../services/utils/events'
import { Navigation } from './panel-history'
import { Side } from '../../services/utils/types'
import { selectIsHighlighted } from '../../store/app-state-reducers'
import { useAppSelector } from '../../store/hooks'

export function usePanelMouseListener(
  side: Side,
  container: HTMLDivElement | null,
  navigation: Navigation,
): void {
  const highlighted = useAppSelector(state => selectIsHighlighted(state, side))

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
    if (container === null) {
      return
    }
    container.addEventListener(MOUSEUP, handleMouseButton)
    return () => {
      container.removeEventListener(MOUSEUP, handleMouseButton)
    }
  }, [container, handleMouseButton])
}

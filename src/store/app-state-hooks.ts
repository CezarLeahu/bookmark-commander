import { useCallback, useMemo } from 'react'

import { RootState } from './store'
import { Side } from '../services/utils/types'
import { selectIsHighlighted } from './app-state-reducers'
import { useAppSelector } from './hooks'

export function useSelectIsHighlighted(side: Side): boolean {
  return useMemo(() => useAppSelector(state => selectIsHighlighted(state, side)), [side])
}

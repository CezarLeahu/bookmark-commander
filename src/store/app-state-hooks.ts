import { BTN } from '../services/bookmarks/types'
import { RootState } from './store'
import { Side } from '../services/utils/types'
import { shallowEqual } from 'react-redux'
import { useAppSelector } from './hooks'
import { useCallback } from 'react'

export function useSelectAppOutdated(): object {
  const selector = useCallback((state: RootState) => state.app.outdated, [])
  return useAppSelector(selector, Object.is)
}

export function useSelectFocusedSide(): Side {
  const selector = useCallback((state: RootState) => state.app.focusedSide, [])
  return useAppSelector(selector)
}

export function useSelectTopNodes(): BTN[] {
  const selector = useCallback((state: RootState) => state.app.topNodes, [])
  return useAppSelector(selector, shallowEqual)
}

export function useSelectIsHighlighted(side: Side): boolean {
  const selector = useCallback((state: RootState) => state.app.focusedSide === side, [side])
  return useAppSelector(selector)
}

export function useSearchResultSelection(): { current: BTN | undefined } {
  const selector = useCallback((state: RootState) => state.app.searchResultSelection, [])
  return useAppSelector(selector, shallowEqual)
}

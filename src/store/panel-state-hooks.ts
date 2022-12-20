import { Side, other } from '../services/utils/types'

import { BTN } from '../services/bookmarks/types'
import { RootState } from './store'
import { shallowEqual } from 'react-redux'
import { useAppSelector } from './hooks'
import { useCallback } from 'react'

export function useSelectPanelOutdated(side: Side): object {
  const selector = useCallback((state: RootState) => state.panel[side].outdated, [side])
  return useAppSelector(selector, shallowEqual)
}

export function useSelectLeftNodeId(): string {
  const selector = useCallback((state: RootState) => state.panel.left.nodeId, [])
  return useAppSelector(selector)
}
export function useSelectRightNodeId(): string {
  const selector = useCallback((state: RootState) => state.panel.right.nodeId, [])
  return useAppSelector(selector)
}

export function useSelectFocusedPanelInRootDir(): boolean {
  const selector = useCallback(
    (state: RootState) => state.panel[state.app.focusedSide].nodeId === '0',
    [],
  )
  return useAppSelector(selector)
}

export function useSelectNodeId(side: Side): string {
  const selector = useCallback((state: RootState) => state.panel[side].nodeId, [side])
  return useAppSelector(selector)
}

export function useSelectFocusedNodeId(): string {
  const selector = useCallback((state: RootState) => state.panel[state.app.focusedSide].nodeId, [])
  return useAppSelector(selector)
}

export function useSelectOtherNodeId(): string {
  const selector = useCallback(
    (state: RootState) => state.panel[other(state.app.focusedSide)].nodeId,
    [],
  )
  return useAppSelector(selector)
}

export function useSelectNode(side: Side): BTN | undefined {
  const selector = useCallback((state: RootState) => state.panel[side].node, [side])
  return useAppSelector(selector, shallowEqual)
}

export function useSelectBreadcrumbs(side: Side): BTN[] {
  const selector = useCallback((state: RootState) => state.panel[side].breadcrumbs, [side])
  return useAppSelector(selector, shallowEqual)
}

export function useSelectRows(side: Side): BTN[] {
  const selector = useCallback((state: RootState) => state.panel[side].rows, [side])
  return useAppSelector(selector, shallowEqual)
}

export function useSelectSelectionIds(side: Side): string[] {
  const selector = useCallback((state: RootState) => state.panel[side].selectionIds, [side])
  return useAppSelector(selector, shallowEqual)
}

export function useSelectHighlightId(side: Side): string | undefined {
  const selector = useCallback((state: RootState) => state.panel[side].highlightId, [side])
  return useAppSelector(selector)
}

export function useSelectFocusedPanelSelectionIds(): string[] {
  const selector = useCallback(
    (state: RootState) => state.panel[state.app.focusedSide].selectionIds,
    [],
  )
  return useAppSelector(selector, shallowEqual)
}

export function useSelectFocusedPanelHasSelection(): boolean {
  const selector = useCallback(
    (state: RootState) => state.panel[state.app.focusedSide].selectionIds.length > 0,
    [],
  )
  return useAppSelector(selector)
}

export function useSelectFocusedPanelHasHighlight(): boolean {
  const selector = useCallback(
    (state: RootState) => state.panel[state.app.focusedSide].highlightId !== undefined,
    [],
  )
  return useAppSelector(selector)
}

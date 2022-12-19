import { History, history } from '../../services/utils/history'
import { selectNodeId, updateNodeId } from '../../store/panel-state-reducers'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useCallback, useEffect, useMemo } from 'react'

import { Side } from '../../services/utils/types'

export interface Navigation {
  back: () => void
  forward: () => void
  canGoBack: () => boolean
  canGoForward: () => boolean
}

export function useNavigation(side: Side): Navigation {
  const dispatch = useAppDispatch()

  const currentNodeId = useAppSelector(state => selectNodeId(state, side))

  const nodeIdHistory = useMemo<History<string>>(() => history<string>(10), [])

  useEffect(() => {
    nodeIdHistory.put(currentNodeId)
  }, [nodeIdHistory, currentNodeId])

  return {
    back: useCallback(() => {
      const nodeId = nodeIdHistory.back()
      if (nodeId !== undefined) {
        dispatch(updateNodeId({ side, id: nodeId }))
      }
    }, [dispatch, side, nodeIdHistory]),

    forward: useCallback(() => {
      const nodeId = nodeIdHistory.forwardRef()
      if (nodeId !== undefined) {
        dispatch(updateNodeId({ side, id: nodeId }))
      }
    }, [dispatch, side, nodeIdHistory]),

    canGoBack: useCallback(() => nodeIdHistory.hasBackHistory(), [nodeIdHistory]),
    canGoForward: useCallback(() => nodeIdHistory.hasForwardHistory(), [nodeIdHistory]),
  }
}

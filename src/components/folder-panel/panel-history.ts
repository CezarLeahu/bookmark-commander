import { History, history } from '../../services/utils/history'
import { useCallback, useEffect, useMemo } from 'react'

export interface Navigation {
  back: () => void
  forward: () => void
  canGoBack: () => boolean
  canGoForward: () => boolean
}

export function useNavigation(
  currentNodeId: string,
  setCurrentNodeId: (id: string) => void,
): Navigation {
  const nodeIdHistory = useMemo<History<string>>(() => history<string>(10), [])

  useEffect(() => {
    nodeIdHistory.put(currentNodeId)
  }, [nodeIdHistory, currentNodeId])

  return {
    back: useCallback(() => {
      const nodeId = nodeIdHistory.back()
      if (nodeId !== undefined) {
        setCurrentNodeId(nodeId)
      }
    }, [nodeIdHistory, setCurrentNodeId]),

    forward: useCallback(() => {
      const nodeId = nodeIdHistory.forwardRef()
      if (nodeId !== undefined) {
        setCurrentNodeId(nodeId)
      }
    }, [nodeIdHistory, setCurrentNodeId]),

    canGoBack: useCallback(() => nodeIdHistory.hasBackHistory(), [nodeIdHistory]),
    canGoForward: useCallback(() => nodeIdHistory.hasForwardHistory(), [nodeIdHistory]),
  }
}

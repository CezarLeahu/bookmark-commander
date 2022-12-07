import { useCallback, useState } from 'react'

export function useRefreshPanels(): () => void {
  const [, setRefreshContent] = useState({})
  return useCallback(() => setRefreshContent({}), [])
}

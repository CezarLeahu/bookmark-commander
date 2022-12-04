import { GridApi, GridReadyEvent } from 'ag-grid-community'
import { useCallback, useEffect } from 'react'

import { BTN } from '../../services/bookmarks/types'
import { usePairStateEmpty } from '../../services/utils/hooks'

interface DndBetweenGrids {
  handleGridReadyLeft: (params: GridReadyEvent) => void
  handleGridReadyRight: (params: GridReadyEvent) => void
}

export function useDndBetweenGrids(): DndBetweenGrids {
  const gridApis = usePairStateEmpty<GridApi<BTN>>()

  useEffect(() => {
    if (gridApis.left.state !== undefined && gridApis.right.state !== undefined) {
      console.log('We can enable DND')
    }
  }, [gridApis.left.state, gridApis.right.state])

  return {
    handleGridReadyLeft: useCallback(
      (params: GridReadyEvent): void => {
        gridApis.left.setState(params.api)
      },
      [gridApis.left],
    ),

    handleGridReadyRight: useCallback(
      (params: GridReadyEvent): void => {
        gridApis.right.setState(params.api)
      },
      [gridApis.right],
    ),
  }
}

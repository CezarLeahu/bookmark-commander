import { GridApi, GridReadyEvent } from 'ag-grid-community'
import { useCallback, useEffect } from 'react'

import { BTN } from '../../services/bookmarks/types'
import { usePairStateEmpty } from '../../services/utils/hooks'

export function useDragAndDropPanelBinder(): {
  handleGridReadyLeft: (params: GridReadyEvent) => void
  handleGridReadyRight: (params: GridReadyEvent) => void
} {
  const gridApis = usePairStateEmpty<GridApi<BTN>>()

  useEffect(() => {
    if (gridApis.left.state !== undefined && gridApis.right.state !== undefined) {
      gridApis.left.state.addRowDropZone(gridApis.right.state.getRowDropZoneParams())
      gridApis.right.state.addRowDropZone(gridApis.left.state.getRowDropZoneParams())
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

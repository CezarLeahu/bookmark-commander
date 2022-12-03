import { BTN } from '../../services/bookmarks/types'
import { GetRowIdParams } from 'ag-grid-community'
import { useMemo } from 'react'

export function useRowIdMemo(): (params: GetRowIdParams<BTN>) => string {
  return useMemo(
    () =>
      (params: GetRowIdParams<BTN>): string =>
        params.data.id,
    [],
  )
}

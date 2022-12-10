import { CellEditRequestEvent, GridApi } from 'ag-grid-community'
import { useCallback, useImperativeHandle } from 'react'

import { BTN } from '../../services/bookmarks/types'
import { updateTitle } from '../../services/bookmarks/commands'

export interface CellEditingHandle {
  renameCell: (id: string | undefined) => void
}

export function useCellEditing(
  ref: React.ForwardedRef<CellEditingHandle>,
  gridApi: GridApi | undefined,
  refreshRows: () => void,
): (event: CellEditRequestEvent<BTN, string>) => void {
  const startCellEdit = useCallback((api: GridApi<BTN>, id: string): void => {
    const rowIndex = api.getRowNode(id)?.rowIndex
    if (rowIndex === undefined || rowIndex === null) {
      return
    }
    api.startEditingCell({
      rowIndex,
      colKey: 'title',
    })
  }, [])

  useImperativeHandle<CellEditingHandle, CellEditingHandle>(
    ref,
    () => ({
      renameCell: (id: string | undefined): void => {
        if (id !== undefined && gridApi !== undefined) {
          startCellEdit(gridApi, id)
        }
      },
    }),
    [gridApi, startCellEdit],
  )

  return useCallback(
    (event: CellEditRequestEvent<BTN, string>) => {
      if (event.colDef.field !== 'title' || event.newValue === undefined) {
        return
      }

      const newVal = event.newValue
      if (newVal === event.oldValue || String(newVal).trim() === String(event.oldValue)) {
        return
      }

      updateTitle(event.data.id, newVal)
        .then(() => {
          console.log('Updated one title')
          refreshRows()
        })
        .catch(e => console.log(e))
    },
    [refreshRows],
  )
}

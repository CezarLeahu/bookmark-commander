import { CellClassParams, ColDef, GridApi, RowNode } from 'ag-grid-community'
import { titleCellRenderer, urlCellRenderer } from './cell-renderers'

import { BTN } from '../../services/bookmarks/types'

export interface FolderPanelMetadata {
  potentialParent: RowNode<BTN> | undefined
  columnDefs: ColDef[]
  resetPotentialParentAndRefresh: (api: GridApi) => void
  setPotentialParentAndRefresh: (api: GridApi, node: RowNode<BTN>) => void
}

export const folderPanelMetadata = (): FolderPanelMetadata => {
  let potentialParent: RowNode<BTN> | undefined

  const columnDefs: ColDef[] = [
    {
      field: 'title',
      headerName: 'Title',
      filter: true,
      width: 250,
      editable: false, // change to 'true' if in-line renaming ever gets enabled
      resizable: true,
      cellRenderer: titleCellRenderer,
      cellClassRules: {
        'hover-over': (params: CellClassParams<BTN>) => {
          return params.node === potentialParent
        },
      },
    },
    {
      field: 'url',
      headerName: 'URL',
      filter: true,
      flex: 1,
      resizable: true,
      cellRenderer: urlCellRenderer,
      cellClassRules: {
        'hover-over': (params: CellClassParams<BTN>) => {
          return params.node === potentialParent
        },
      },
    },
  ]

  return {
    potentialParent,
    columnDefs,

    resetPotentialParentAndRefresh: (api: GridApi): void => {
      if (potentialParent === undefined) {
        return
      }
      const rowsToRefresh = [potentialParent]
      potentialParent = undefined
      api.refreshCells({
        rowNodes: rowsToRefresh,
        force: true,
      })
    },

    setPotentialParentAndRefresh: (api: GridApi, node: RowNode<BTN>): void => {
      const rowsToRefresh = [potentialParent, node].filter(n => n !== undefined) as Array<
        RowNode<BTN>
      >
      potentialParent = node
      api.refreshCells({
        rowNodes: rowsToRefresh,
        force: true,
      })
    },
  }
}

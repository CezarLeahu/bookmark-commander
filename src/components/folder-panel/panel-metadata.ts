import { CellClassParams, ColDef, GridApi, RowNode } from 'ag-grid-community'
import { titleCellRenderer, urlCellRenderer } from './grid-cell-renderers'
import { useRef, useState } from 'react'

import { BTN } from '../../services/bookmarks/types'

export interface FolderPanelMetadata {
  columnDefs: ColDef[]
  sameAsPotentialParent: (node: RowNode<BTN>) => boolean
  resetPotentialParentAndRefresh: (api: GridApi) => void
  setPotentialParentAndRefresh: (api: GridApi, node: RowNode<BTN>) => void
}

export function usePanelMetadataWithDragAndDrop(): FolderPanelMetadata {
  const potentialParent = useRef<RowNode<BTN>>()

  const [columnDefs] = useState<ColDef[]>([
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
          return params.node === potentialParent.current
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
          return params.node === potentialParent.current
        },
      },
    },
  ])

  return {
    columnDefs,

    sameAsPotentialParent: (node: RowNode<BTN>): boolean => {
      return node === potentialParent.current
    },

    resetPotentialParentAndRefresh: (api: GridApi): void => {
      if (potentialParent.current === undefined) {
        return
      }
      const rowsToRefresh = [potentialParent.current]
      potentialParent.current = undefined
      api.refreshCells({
        rowNodes: rowsToRefresh,
        force: true,
      })
    },

    setPotentialParentAndRefresh: (api: GridApi, node: RowNode<BTN>): void => {
      const rowsToRefresh = [potentialParent.current, node].filter(n => n !== undefined) as Array<
        RowNode<BTN>
      >
      potentialParent.current = node
      api.refreshCells({
        rowNodes: rowsToRefresh,
        force: true,
      })
    },
  }
}

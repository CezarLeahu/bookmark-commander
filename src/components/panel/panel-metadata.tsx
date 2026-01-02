import { CellClassParams, ColDef, GridApi, ICellRendererParams, RowNode } from 'ag-grid-community'
import { isDirectory, isSimpleBookmark } from '../../services/bookmarks/utils'
import { openAllInNewTabs, openInNewTab } from '../../services/tabs/tabs'
import { suppressHeaderKeys, suppressKeys } from './panel-key-events'
import { useRef, useState } from 'react'

import { BTN } from '../../services/bookmarks/types'
import FolderIcon from '@mui/icons-material/Folder'
import { MOUSEUP } from '../../services/utils/events'
import { getFaviconUrl } from '../../services/favicons/favicons'

export interface FolderPanelMetadata {
  columnDefs: ColDef[]
  defaultColDef: ColDef
  sameAsPotentialParent: (node: RowNode<BTN>) => boolean
  resetPotentialParentAndRefresh: (api: GridApi) => void
  setPotentialParentAndRefresh: (api: GridApi, node: RowNode<BTN>) => void
}

export const TITLE_COLUMN = 'title'

const defaultColDef: ColDef = {
  filter: false,
  sortable: false,
  suppressMenu: true,
  suppressHeaderKeyboardEvent: suppressHeaderKeys,
  suppressKeyboardEvent: suppressKeys,
}

export function usePanelMetadataWithDragAndDrop(): FolderPanelMetadata {
  const potentialParent = useRef<RowNode<BTN>>()

  const [columnDefs] = useState<ColDef[]>([
    {
      field: TITLE_COLUMN,
      headerName: 'Title',
      minWidth: 100,
      flex: 1, // 1 out for 2 -> 50% width
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
      flex: 1, // 1 out for 2 -> 50% width
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
    defaultColDef,

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
      const rowsToRefresh = [potentialParent.current, node].filter(n => n !== undefined)
      potentialParent.current = node
      api.refreshCells({
        rowNodes: rowsToRefresh,
        force: true,
      })
    },
  }
}

const titleCellRenderer = (params: ICellRendererParams<BTN, string>): JSX.Element => {
  return (
    <div onMouseUp={e => middleClickHandle(params.api, e)}>
      {params.data !== undefined && isDirectory(params.data) ? (
        <FolderIcon sx={{ verticalAlign: 'middle', paddingRight: '8px', outerHeight: '16' }} />
      ) : (
        <img
          src={getFaviconUrl(params.data?.url ?? '')}
          height='16'
          style={{ verticalAlign: 'middle', paddingRight: '10px' }}
        />
      )}
      <span className='filename'>{params.value}</span>
    </div>
  )
}

const urlCellRenderer = (params: ICellRendererParams<BTN, string>): JSX.Element => {
  return <span onMouseUp={e => middleClickHandle(params.api, e)}>{params.value}</span>
}

const middleClickHandle = (
  api: GridApi<BTN>,
  event?: React.MouseEvent<HTMLSpanElement, MouseEvent>,
): void => {
  if (event?.type === MOUSEUP && event.button === 1) {
    // Middle click
    const rowIndex = api?.getFocusedCell()?.rowIndex
    if (rowIndex === undefined || rowIndex === 0 || rowIndex < 0) {
      return
    }
    const focusedNode: BTN = api?.getModel().getRow(rowIndex)?.data
    if (focusedNode === undefined || focusedNode.url === undefined) {
      return
    }
    const selectedNodes: BTN[] = api.getSelectedRows().filter(n => isSimpleBookmark(n))

    const focusedNodeSelected = selectedNodes.filter(n => n.id === focusedNode.id).length === 1

    if (focusedNodeSelected) {
      openAllInNewTabs(selectedNodes.map(n => n.url) as string[])
      return
    }

    openInNewTab(focusedNode.url, false)
  }
}

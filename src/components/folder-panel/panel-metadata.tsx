import { CellClassParams, ColDef, GridApi, ICellRendererParams, RowNode } from 'ag-grid-community'
import { useRef, useState } from 'react'

import { BTN } from '../../services/bookmarks/types'
import FolderIcon from '@mui/icons-material/Folder'
import { getFaviconUrl } from '../../services/favicons/favicons'
import { isDirectory } from '../../services/bookmarks/utils'
import { openAllInNewTabs } from '../../services/tabs/tabs'

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
  if (event?.type === 'mouseup' && event.nativeEvent.which === 2) {
    // Middle click
    const urls: string[] = api
      .getSelectedRows()
      .map(n => n.url)
      .filter(url => url !== undefined) as string[]

    if (urls.length > 0 && urls.length < 20) {
      openAllInNewTabs(urls)
    }
  }
}

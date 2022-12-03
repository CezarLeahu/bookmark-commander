import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css'
import '../../styles/style.css'

import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Container,
  Link,
  Typography,
} from '@mui/material'
import {
  CellClassParams,
  ColDef,
  GetRowIdParams,
  GridApi,
  RowDoubleClickedEvent,
  RowDragEndEvent,
  RowDragLeaveEvent,
  RowDragMoveEvent,
  RowNode,
  RowSelectedEvent,
  SelectionChangedEvent,
} from 'ag-grid-community'
import {
  childrenAndParent,
  getNode,
  getTopNodes,
  parentPath,
} from '../../services/bookmarks/queries'
import { dropInfo, moveInfo } from '../../services/utils/dnd'
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { AgGridReact } from 'ag-grid-react'
import { BTN } from '../../services/bookmarks/types'
import { moveAll } from '../../services/bookmarks/commands'
import { useTheme } from '@mui/material/styles'

const columnDefs: ColDef[] = [
  {
    field: 'title',
    headerName: 'Title',
    filter: true,
    width: 250,
    editable: false, // change to 'true' if in-line renaming ever gets enabled
    resizable: true,
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
    cellClassRules: {
      'hover-over': (params: CellClassParams<BTN>) => {
        return params.node === potentialParent
      },
    },
  },
]

export interface FolderPanelProps {
  readonly currentNodeId: string
  setCurrentNodeId: (id: string) => void
  selected: boolean
  onSelect: (node: BTN) => void
  selectionModel: string[]
  setSelectionModel: (model: string[]) => void
  refreshContent: object
  forceUpdate: () => void
}

export interface FolderPanelHandle {
  renameCell: (id: string | undefined) => void
}

let potentialParent: RowNode<BTN> | undefined

const resetPotentialParentAndRefresh = (api: GridApi): void => {
  if (potentialParent === undefined) {
    return
  }
  const rowsToRefresh = [potentialParent]
  potentialParent = undefined
  api.refreshCells({
    rowNodes: rowsToRefresh,
    force: true,
  })
}

const setPotentialParentAndRefresh = (api: GridApi, node: RowNode<BTN>): void => {
  const rowsToRefresh = [potentialParent, node].filter(n => n !== undefined) as Array<RowNode<BTN>>
  potentialParent = node
  api.refreshCells({
    rowNodes: rowsToRefresh,
    force: true,
  })
}

const FolderPanel: React.ForwardRefRenderFunction<FolderPanelHandle, FolderPanelProps> = (
  {
    currentNodeId,
    setCurrentNodeId,
    selected,
    onSelect,
    selectionModel,
    setSelectionModel,
    refreshContent,
    forceUpdate,
  }: FolderPanelProps,
  ref: React.ForwardedRef<FolderPanelHandle>,
) => {
  const theme = useTheme()
  const [topNodes, setTopNodes] = useState<BTN[]>([])
  const [error, setError] = useState<string>()

  const gridRef = useRef<AgGridReact>(null)

  useEffect(() => {
    getTopNodes().then(
      r => setTopNodes(r),
      e => setError(e),
    )
  }, [])

  const [currentNode, setCurrentNode] = useState<BTN>()

  useEffect(() => {
    getNode(currentNodeId).then(
      r => setCurrentNode(r),
      e => setError(e),
    )
  }, [currentNodeId])

  const [breadcrumbs, setBreadcrumbs] = useState<BTN[]>([])

  useEffect(() => {
    parentPath(currentNode).then(
      r => setBreadcrumbs(r),
      e => setError(e),
    )
  }, [currentNode])

  const [rows, setRows] = useState<BTN[]>([])
  const parentId = useRef<string>()

  useEffect(() => {
    childrenAndParent(currentNodeId).then(
      ([r, pId]) => {
        setRows(r)
        parentId.current = pId
      },
      e => setError(e),
    )
  }, [currentNodeId, refreshContent, selectionModel])

  const handleRowClick = (event: RowSelectedEvent<BTN>): void => {
    const node = event.data
    if (node !== undefined) {
      onSelect(node)
    }
  }

  const handleRowDoubleClick = (event: RowDoubleClickedEvent<BTN>): void => {
    const node = event.data
    if (node === undefined) {
      return
    }
    switch (node.url) {
      case undefined: // folder
        setCurrentNodeId(String(node.id))
        break
      default: // actual bookmark - open in new tab
        chrome.tabs.create({ url: node.url }).catch(e => setError(e))
    }
  }

  const handleSelectionChanged = (event: SelectionChangedEvent<BTN>): void => {
    setSelectionModel(event.api.getSelectedRows().map(n => n.id))
  }

  const getRowId = useMemo(
    () =>
      (params: GetRowIdParams<BTN>): string =>
        params.data.id,
    [],
  )

  const handleRowDragMove = useCallback(
    (e: RowDragMoveEvent<BTN>): void => {
      if (currentNodeId === '0' || e.node.childIndex === 0) {
        resetPotentialParentAndRefresh(e.api)
        return
      }

      if (e.nodes.filter(n => n === e.overNode).length !== 0) {
        resetPotentialParentAndRefresh(e.api)
        return
      }

      const info = moveInfo(e, rows.length)
      if (info === undefined) {
        resetPotentialParentAndRefresh(e.api)
        return
      }

      gridRef.current?.api.forEachNode(n => n.setHighlighted(null))

      const node: RowNode<BTN> | undefined =
        e.overNode ?? gridRef.current?.api.getRowNode(rows[info.highlightedRowIndex].id)

      if (node === undefined) {
        resetPotentialParentAndRefresh(e.api)
        return
      }

      node.setHighlighted(info.position)

      if (info.position !== null) {
        resetPotentialParentAndRefresh(e.api)
        return
      }

      if (node !== potentialParent) {
        setPotentialParentAndRefresh(e.api, node)
      }
    },
    [currentNodeId, rows],
  )

  const handleRowDragLeave = useCallback((e: RowDragLeaveEvent<BTN>) => {
    resetPotentialParentAndRefresh(e.api)
    gridRef.current?.api.forEachNode(n => n.setHighlighted(null))
  }, [])

  const handleRowDragEnd = useCallback(
    (e: RowDragEndEvent<BTN>) => {
      resetPotentialParentAndRefresh(e.api)
      gridRef.current?.api.forEachNode(n => n.setHighlighted(null))

      if (currentNodeId === '0' || e.node.childIndex === 0) {
        return
      }

      if (e.nodes.filter(n => n === e.overNode).length !== 0) {
        return
      }

      const info = dropInfo(e, rows.length)
      if (info === undefined) {
        return
      }

      if (info.isDir && e.overNode === undefined) {
        console.log('Target node not available')
        return
      }

      console.log('handleRowDragEnd()', info)

      const parentId: string | undefined = info.isDir
        ? e.overNode?.data?.id ?? undefined
        : undefined

      const ids = e.nodes.map(n => n.data?.id ?? undefined).filter(e => e !== undefined) as string[]
      const directionUp: boolean =
        info.index !== undefined &&
        e.nodes.filter(n => n.childIndex < (info.index ?? 0) + 1).length === 0 // todo check if the target dir is the current dir (when enabling the second dnd zone)
      moveAll(directionUp ? ids.reverse() : ids, parentId, info.index)
        .then(() => {
          console.log('Moved elements')
          forceUpdate()
        })
        .catch(e => console.log(e))
    },
    [currentNodeId, rows, forceUpdate],
  )

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        flex: 1,
        minHeight: '10px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box>
        {error !== undefined ? (
          <Alert severity='error' onClose={() => setError(undefined)}>
            {error}
          </Alert>
        ) : (
          <></>
        )}
      </Box>
      <Box display='flex' justifyContent='center' alignItems='center'>
        <ButtonGroup variant='text' aria-label='Main Bookmark Locations'>
          {topNodes.map(d => (
            <Button
              key={d.id}
              sx={{ textTransform: 'none' }}
              onClick={() => setCurrentNodeId(d.id)}
            >
              {d.title}
            </Button>
          ))}
        </ButtonGroup>
      </Box>
      <Box>
        <Breadcrumbs aria-label='breadcrumb'>
          {breadcrumbs.map(d => (
            <Link key={d.id} onClick={() => setCurrentNodeId(d.id)}>
              {d.title}
            </Link>
          ))}
          <Typography color='text.primary'>{currentNode?.title}</Typography>
        </Breadcrumbs>
      </Box>

      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        sx={{
          border: 1,
          borderColor: selected ? 'primary.main' : 'background.default',
          height: '100%',
        }}
      >
        <Box
          className={theme.palette.mode === 'dark' ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'}
          sx={{ width: '100%', height: '100%' }}
        >
          <AgGridReact
            ref={gridRef}
            columnDefs={columnDefs}
            rowData={rows}
            getRowId={getRowId}
            animateRows
            rowSelection='multiple'
            onRowClicked={handleRowClick}
            onRowDoubleClicked={handleRowDoubleClick}
            onSelectionChanged={handleSelectionChanged}
            isRowSelectable={p => p.id !== parentId.current}
            rowDragEntireRow
            rowDragMultiRow
            suppressMoveWhenRowDragging
            onRowDragMove={handleRowDragMove}
            onRowDragLeave={handleRowDragLeave}
            onRowDragEnd={handleRowDragEnd}
          />
        </Box>
      </Box>
    </Container>
  )
}

export default forwardRef(FolderPanel)

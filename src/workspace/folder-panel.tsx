import { childrenAndParent, getNode, getTopNodes, parentPath } from '../bookmarks/queries'
import { BTN } from '../bookmarks/types'
import { useEffect, useState, forwardRef, useRef, useMemo, useCallback } from 'react'
import {
  Alert,
  Container,
  Box,
  Link,
  Typography,
  Breadcrumbs,
  ButtonGroup,
  Button,
} from '@mui/material'
import { AgGridReact } from 'ag-grid-react'
import {
  ColDef,
  GetRowIdParams,
  RowDoubleClickedEvent,
  RowDragEndEvent,
  RowDragLeaveEvent,
  RowDragMoveEvent,
  RowSelectedEvent,
  SelectionChangedEvent,
} from 'ag-grid-community'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css'
import { moveInfo, dropInfo } from '../misc/utils'

const columns: ColDef[] = [
  {
    field: 'title',
    headerName: 'Title',
    filter: true,
    width: 250,
    editable: false, // change to 'true' if in-line renaming ever gets enabled
    resizable: true,
  },
  {
    field: 'url',
    headerName: 'URL',
    filter: true,
    flex: 1,
    resizable: true,
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
}

export interface FolderPanelHandle {
  renameCell: (id: string | undefined) => void
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
  }: FolderPanelProps,
  ref: React.ForwardedRef<FolderPanelHandle>,
) => {
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
        return
      }
      const movingNode = e.node
      const overNode = e.overNode

      if (movingNode !== overNode) {
        const info = moveInfo(e, rows.length)

        if (info === undefined) {
          return
        }

        gridRef.current?.api.forEachNode(n => n.setHighlighted(null))

        const node =
          e.overNode ?? gridRef.current?.api.getRowNode(rows[info.highlightedRowIndex].id)

        node?.setHighlighted(info.position)
      }
    },
    [currentNodeId, rows],
  )

  const handleRowDragLeave = useCallback((e: RowDragLeaveEvent<BTN>) => {
    gridRef.current?.api.forEachNode(n => n.setHighlighted(null))
  }, [])

  const handleRowDragEnd = useCallback(
    (e: RowDragEndEvent<BTN>) => {
      if (currentNodeId === '0' || e.node.childIndex === 0) {
        return
      }

      gridRef.current?.api.forEachNode(n => n.setHighlighted(null))

      const info = dropInfo(e, rows.length)
      console.log('handleRowDragEnd()', info)

      // todo check drag end target is not a parent/ancestor of the current destination
    },
    [currentNodeId, rows],
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
        <Box className='ag-theme-alpine-dark' sx={{ width: '100%', height: '100%' }}>
          <AgGridReact
            ref={gridRef}
            columnDefs={columns}
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

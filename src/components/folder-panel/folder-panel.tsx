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
  GridApi,
  GridReadyEvent,
  RowDragEndEvent,
  RowDragLeaveEvent,
  RowDragMoveEvent,
} from 'ag-grid-community'
import { folderPanelMetadata, useRowIdMemo } from './metadata'
import { forwardRef, useEffect, useRef } from 'react'
import { handleRowDragEnd, handleRowDragLeave, handleRowDragMove } from './dnd-handlers'

import { AgGridReact } from 'ag-grid-react'
import { BTN } from '../../services/bookmarks/types'
import { useClickHandlers } from './click-handlers'
import { useFolderActiveContent } from './content'
import { useTheme } from '@mui/material/styles'

const meta = folderPanelMetadata()

export interface FolderPanelProps {
  readonly currentNodeId: string
  readonly setCurrentNodeId: (id: string) => void
  readonly selected: boolean
  readonly onSelect: (node?: BTN) => void
  readonly onGridReady: (params: GridReadyEvent) => void
  readonly selectionModel: string[]
  readonly setSelectionModel: (model: string[]) => void
  readonly refreshContent: object
  readonly forceUpdate: () => void
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
    onGridReady,
    selectionModel,
    setSelectionModel,
    refreshContent,
    forceUpdate,
  }: FolderPanelProps,
  ref: React.ForwardedRef<FolderPanelHandle>,
) => {
  const theme = useTheme()
  const getRowId = useRowIdMemo()
  const gridApi = useRef<GridApi<BTN>>()

  const { topNodes, error, setError, currentNode, breadcrumbs, rows, parentId } =
    useFolderActiveContent(currentNodeId, selectionModel, refreshContent)

  const { handleRowClick, handleRowDoubleClick, handleSelectionChanged } = useClickHandlers(
    onSelect,
    setCurrentNodeId,
    setSelectionModel,
    setError,
  )

  useEffect(() => {
    if (gridApi.current === undefined) {
      return
    }
    if (selectionModel.length === 0) {
      gridApi.current.deselectAll()
      return
    }
    const ids = new Set<string>(selectionModel)
    gridApi.current.forEachNode(n =>
      n.setSelected(n.data?.id !== undefined && ids.has(n.data.id), false, true),
    )
    // gridApi.current.redrawRows()
  }, [currentNodeId, rows, selectionModel])

  const handleGridReady = (params: GridReadyEvent): void => {
    gridApi.current = params.api
    onGridReady(params)
  }

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
      {/* <div style={{ flex: 1 }} onMouseUp={handleMouseUpOnEmptySpace}> */}
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
            columnDefs={meta.columnDefs}
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
            onRowDragMove={(e: RowDragMoveEvent<BTN>) =>
              handleRowDragMove(e, meta, currentNodeId, rows)
            }
            onRowDragLeave={(e: RowDragLeaveEvent<BTN>) => handleRowDragLeave(e, meta)}
            onRowDragEnd={(e: RowDragEndEvent<BTN>) =>
              handleRowDragEnd(e, meta, currentNodeId, rows, setSelectionModel, forceUpdate)
            }
            onGridReady={handleGridReady}
          />
        </Box>
      </Box>
      {/* </div> */}
    </Container>
  )
}

export default forwardRef(FolderPanel)

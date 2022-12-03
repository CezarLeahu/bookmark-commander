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
import { folderPanelMetadata, useRowIdMemo } from './metadata'
import { forwardRef, useRef } from 'react'

import { AgGridReact } from 'ag-grid-react'
import { BTN } from '../../services/bookmarks/types'
import { useClickHandlers } from './click-handlers'
import { useFolderActiveContent } from './content'
import { useRowDropZoneEvents } from './dnd-handlers'
import { useTheme } from '@mui/material/styles'

const meta = folderPanelMetadata()

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
  const getRowId = useRowIdMemo()
  const gridRef = useRef<AgGridReact>(null)

  const { topNodes, error, setError, currentNode, breadcrumbs, rows, parentId } =
    useFolderActiveContent(currentNodeId, selectionModel, refreshContent)

  const { handleRowClick, handleRowDoubleClick, handleSelectionChanged } = useClickHandlers(
    onSelect,
    setCurrentNodeId,
    setSelectionModel,
    setError,
  )

  const { onDragging, onDragLeave, onDragStop } = useRowDropZoneEvents(
    meta,
    currentNodeId,
    forceUpdate,
    gridRef,
    rows,
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
            onRowDragMove={onDragging}
            onRowDragLeave={onDragLeave}
            onRowDragEnd={onDragStop}
          />
        </Box>
      </Box>
    </Container>
  )
}

export default forwardRef(FolderPanel)

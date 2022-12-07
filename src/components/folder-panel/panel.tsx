import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css'
import '../../styles/style.css'

import { Box, Breadcrumbs, Button, ButtonGroup, Container, Link, Typography } from '@mui/material'
import {
  GridApi,
  GridReadyEvent,
  RowDragEndEvent,
  RowDragLeaveEvent,
  RowDragMoveEvent,
} from 'ag-grid-community'
import { forwardRef, useCallback, useMemo, useRef } from 'react'
import {
  handleRowDragEnd,
  handleRowDragLeave,
  handleRowDragMove,
} from './panel-drag-and-drop-grid-handlers'
import { useFolderContentEffect, useGridSelectionEffect } from './panel-content'

import { AgGridReact } from 'ag-grid-react'
import { BTN } from '../../services/bookmarks/types'
import { useGridSelectionHandlers } from './panel-click-grid-handlers'
import { usePanelMetadataWithDragAndDrop } from './panel-metadata'
import { useRowIdMemo } from './grid-utils'
import { useTheme } from '@mui/material/styles'

export interface FolderPanelHandle {
  renameCell: (id: string | undefined) => void
}

export interface FolderPanelProps {
  readonly highlighted: boolean
  readonly highlightSide: () => void
  readonly currentNodeId: string
  readonly setCurrentNodeId: (id: string) => void
  readonly notifyGridReady: (params: GridReadyEvent) => void
  readonly selectionModel: string[]
  readonly setSelectionModel: (model: string[]) => void
  readonly rowsOutdated: object
  readonly refreshRows: () => void
}

const FolderPanel: React.ForwardRefRenderFunction<FolderPanelHandle, FolderPanelProps> = (
  {
    highlighted,
    highlightSide,
    currentNodeId,
    setCurrentNodeId,
    notifyGridReady,
    selectionModel,
    setSelectionModel,
    rowsOutdated,
    refreshRows,
  }: FolderPanelProps,
  ref: React.ForwardedRef<FolderPanelHandle>,
) => {
  const theme = useTheme()
  const getRowId = useRowIdMemo()
  const gridApi = useRef<GridApi<BTN>>()
  const meta = usePanelMetadataWithDragAndDrop()

  const { topNodes, currentNode, breadcrumbs, rows } = useFolderContentEffect(
    currentNodeId,
    rowsOutdated,
  )

  useGridSelectionEffect(gridApi, selectionModel, rows)

  const { handleRowClick, handleRowDoubleClick } = useGridSelectionHandlers(
    highlightSide,
    setCurrentNodeId,
    setSelectionModel,
  )

  const handleGridReady = useCallback(
    (params: GridReadyEvent): void => {
      gridApi.current = params.api
      notifyGridReady(params)
    },
    [notifyGridReady],
  )

  const isHighlighted: boolean = useMemo<boolean>(() => highlighted, [highlighted])
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
          borderColor: isHighlighted ? 'primary.main' : 'background.default',
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
            isRowSelectable={p => p.id !== currentNode?.parentId}
            rowDragEntireRow
            rowDragMultiRow
            suppressMoveWhenRowDragging
            onRowDragMove={(e: RowDragMoveEvent<BTN>) =>
              handleRowDragMove(e, meta, currentNodeId, rows)
            }
            onRowDragLeave={(e: RowDragLeaveEvent<BTN>) => handleRowDragLeave(e, meta)}
            onRowDragEnd={(e: RowDragEndEvent<BTN>) =>
              handleRowDragEnd(e, meta, currentNodeId, rows, setSelectionModel, refreshRows)
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

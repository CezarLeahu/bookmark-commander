import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css'
import '../../styles/style.css'

import {
  Box,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Container,
  IconButton,
  Link,
  Typography,
} from '@mui/material'
import { CellEditingHandle, useCellEditing } from './panel-commands'
import {
  GridApi,
  GridReadyEvent,
  RowDragEndEvent,
  RowDragLeaveEvent,
  RowDragMoveEvent,
} from 'ag-grid-community'
import { forwardRef, useCallback, useEffect, useMemo, useRef } from 'react'
import {
  handleRowDragEnd,
  handleRowDragLeave,
  handleRowDragMove,
} from './panel-drag-and-drop-grid-handlers'
import { useFolderContentEffect, useGridSelectionEffect } from './panel-content'

import { AgGridReact } from 'ag-grid-react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { BTN } from '../../services/bookmarks/types'
import { useGridClickHandlers } from './panel-click-grid-handlers'
import { useNavigation } from './panel-history'
import { usePanelMetadataWithDragAndDrop } from './panel-metadata'
import { useRowIdMemo } from './grid-utils'
import { useTheme } from '@mui/material/styles'

export interface FolderPanelHandle extends CellEditingHandle {}
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
  const containerRef = useRef<HTMLDivElement>(null)
  const gridApi = useRef<GridApi<BTN>>()
  const meta = usePanelMetadataWithDragAndDrop()

  const { topNodes, currentNode, breadcrumbs, rows } = useFolderContentEffect(
    currentNodeId,
    rowsOutdated,
  )

  useGridSelectionEffect(gridApi, selectionModel, rows)

  const navigation = useNavigation(currentNodeId, setCurrentNodeId)

  const clickHandlers = useGridClickHandlers(highlightSide, setCurrentNodeId, setSelectionModel)

  const handleGridReady = useCallback(
    (params: GridReadyEvent): void => {
      gridApi.current = params.api
      notifyGridReady(params)
    },
    [notifyGridReady],
  )

  const handleCellEditRequest = useCellEditing(ref, gridApi.current)

  useEffect(() => {
    if (containerRef.current === undefined || containerRef.current === null) {
      return
    }
    const elem = containerRef.current
    elem.addEventListener('mouseup', highlightSide)
    return () => {
      elem.removeEventListener('mouseup', highlightSide)
    }
  }, [notifyGridReady, highlightSide])

  const isHighlighted: boolean = useMemo<boolean>(() => highlighted, [highlighted])

  return (
    <Container
      ref={containerRef}
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
      <Box
        display='inline-flex'
        justifyContent='space-between'
        alignItems='center'
        sx={{ marginTop: '5px' }}
      >
        <Box justifySelf='start'>
          <ButtonGroup variant='contained' aria-label='Navigation buttons'>
            <IconButton
              aria-label='back'
              size='medium'
              disabled={!navigation.canGoBack()}
              onClick={navigation.back}
            >
              <ArrowBackIcon />
            </IconButton>
            <IconButton
              aria-label='forward'
              size='medium'
              disabled={!navigation.canGoForward()}
              onClick={navigation.forward}
            >
              <ArrowForwardIcon />
            </IconButton>
          </ButtonGroup>
        </Box>
        <Box justifySelf='end'>
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
        <Box />
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
            suppressClickEdit
            readOnlyEdit
            onCellEditRequest={handleCellEditRequest}
            animateRows
            rowSelection='multiple'
            onRowClicked={clickHandlers.handleRowClick}
            onRowDoubleClicked={clickHandlers.handleRowDoubleClick}
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
    </Container>
  )
}

export default forwardRef(FolderPanel)

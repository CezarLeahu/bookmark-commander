import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css'
import '../../styles/style.css'

import { Box, Button, ButtonGroup, Container, IconButton } from '@mui/material'
import {
  CellFocusedEvent,
  GridApi,
  GridReadyEvent,
  RowNode,
  SelectionChangedEvent,
} from 'ag-grid-community'
import {
  FolderPanelHandle,
  useCellEditingHandler,
  useGridReadyHandle,
  useHighlightPanelOnClick,
  usePanelHandlers,
} from './panel-commands'
import { TITLE_COLUMN, usePanelMetadataWithDragAndDrop } from './panel-metadata'
import { forwardRef, useCallback, useEffect, useRef } from 'react'
import {
  updateLastHighlight,
  updateNodeId,
  updateSelection,
} from '../../store/panel-state-reducers'
import { useComponenetStateChangedHandler, useLoadPanelContentEffect } from './panel-content'
import { useSelectIsHighlighted, useSelectTopNodes } from '../../store/app-state-hooks'
import {
  useSelectLastHighlightId,
  useSelectNode,
  useSelectRows,
} from '../../store/panel-state-hooks'

import { AgGridReact } from 'ag-grid-react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { BTN } from '../../services/bookmarks/types'
import Breadcrumbs from './breadcrumbs'
import { Side } from '../../services/utils/types'
import { rowIdProvider } from './grid-utils'
import { useAppDispatch } from '../../store/hooks'
import { useDragAndDropHandlers } from './panel-drag-and-drop-grid-handlers'
import { useGridClickHandlers } from './panel-click-grid-handlers'
import { useNavigation } from './panel-history'
import { usePanelKeyListener } from './panel-key-events'
import { usePanelMouseListener } from './panel-mouse-events'
import { useTheme } from '@mui/material/styles'

export interface FolderPanelProps {
  readonly side: Side
  readonly notifyGridReady: (params: GridReadyEvent) => void
  readonly openDialogActions: OpenDialogActions
  readonly moveItemsBetweenPanels: () => void
}

export interface OpenDialogActions {
  readonly openNewBookmark: () => void
  readonly openNewDirectory: () => void
  readonly openEdit: () => void
  readonly openDelete: () => void
}

const FolderPanel: React.ForwardRefRenderFunction<FolderPanelHandle, FolderPanelProps> = (
  { side, notifyGridReady, openDialogActions, moveItemsBetweenPanels }: FolderPanelProps,
  ref: React.ForwardedRef<FolderPanelHandle>,
) => {
  const theme = useTheme()

  const dispatch = useAppDispatch()
  const highlighted = useSelectIsHighlighted(side)
  const currentNode = useSelectNode(side)
  const rows = useSelectRows(side)
  const topNodes = useSelectTopNodes()

  const containerRef = useRef<HTMLDivElement>(null)
  const gridApi = useRef<GridApi<BTN>>()
  const meta = usePanelMetadataWithDragAndDrop()

  const navigation = useNavigation(side)

  const clickHandlers = useGridClickHandlers(side, gridApi.current)

  const handleGridReady = useGridReadyHandle(notifyGridReady, gridApi)

  const handleCellEditRequest = useCellEditingHandler()

  usePanelHandlers(side, ref, gridApi.current)

  useHighlightPanelOnClick(side, gridApi.current, containerRef.current, notifyGridReady)

  usePanelKeyListener(
    side,
    containerRef.current,
    gridApi.current,
    notifyGridReady,
    openDialogActions,
    moveItemsBetweenPanels,
  )
  usePanelMouseListener(side, containerRef.current, navigation)

  const dndHandlers = useDragAndDropHandlers(side, meta)

  const handleComponentStateChanged = useComponenetStateChangedHandler(side)

  const rowSelectable = useCallback(
    (node: RowNode<BTN>): boolean =>
      currentNode?.parentId !== undefined && node.id !== currentNode?.parentId,
    [currentNode],
  )

  const handleSelectionChanged = useCallback(
    (event: SelectionChangedEvent<BTN>): void => {
      console.debug('panel: handleSelectionChanged')
      dispatch(updateSelection({ side, ids: event.api.getSelectedRows().map(r => r.id) }))
    },
    [dispatch, side],
  )

  const lastHighlightId = useSelectLastHighlightId(side)
  const handleCellFocusChanged = useCallback(
    (event: CellFocusedEvent<BTN>): void => {
      console.debug('panel: handleCellFocusChanged')
      const cell = event.api.getFocusedCell()
      if (cell !== undefined && cell !== null) {
        if (cell.rowIndex === -1) {
          event.api.setFocusedCell(0, TITLE_COLUMN)
          return
        }

        const id = event.api.getModel().getRow(cell.rowIndex)?.id
        if (id !== undefined && id !== lastHighlightId) {
          dispatch(updateLastHighlight({ side, id }))
        }
      }
    },
    [dispatch, side, lastHighlightId],
  )

  useEffect(() => {
    if (!highlighted) {
      gridApi.current?.clearFocusedCell()
      return
    }

    if (lastHighlightId !== undefined && gridApi.current?.getFocusedCell() === null) {
      const row = gridApi.current?.getRowNode(lastHighlightId)
      if (row === undefined || row.rowIndex === null) {
        return
      }
      gridApi.current?.setFocusedCell(row.rowIndex, TITLE_COLUMN)
    }
  }, [highlighted, lastHighlightId])

  useLoadPanelContentEffect(side)

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
                onClick={() => dispatch(updateNodeId({ side, id: d.id }))}
              >
                {d.title}
              </Button>
            ))}
          </ButtonGroup>
        </Box>
        <Box />
      </Box>
      <Box>
        <Breadcrumbs side={side} />
      </Box>

      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        sx={{
          border: 1,
          borderColor: highlighted ? 'primary.main' : 'background.default',
          height: '100%',
        }}
      >
        <Box
          className={theme.palette.mode === 'dark' ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'}
          sx={{ width: '100%', height: '100%' }}
        >
          <AgGridReact<BTN>
            columnDefs={meta.columnDefs}
            defaultColDef={meta.defaultColDef}
            rowData={rows}
            getRowId={rowIdProvider}
            onGridReady={handleGridReady}
            suppressClickEdit
            stopEditingWhenCellsLoseFocus
            readOnlyEdit
            onCellEditRequest={handleCellEditRequest}
            animateRows
            rowSelection='multiple'
            onRowClicked={clickHandlers.handleRowClick}
            onRowDoubleClicked={clickHandlers.handleRowDoubleClick}
            isRowSelectable={rowSelectable}
            rowDragEntireRow
            rowDragMultiRow
            onCellFocused={handleCellFocusChanged}
            suppressMoveWhenRowDragging
            onRowDragMove={dndHandlers.handleRowDragMove}
            onRowDragLeave={dndHandlers.handleRowDragLeave}
            onRowDragEnd={dndHandlers.handleRowDragEnd}
            onComponentStateChanged={handleComponentStateChanged}
            onSelectionChanged={handleSelectionChanged}
          />
        </Box>
      </Box>
    </Container>
  )
}

export default forwardRef(FolderPanel)

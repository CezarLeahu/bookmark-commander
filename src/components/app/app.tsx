import { Box, Button, ButtonGroup, Container, Grid, IconButton } from '@mui/material'
import FolderPanel, { OpenDialogActions } from '../panel/panel'
import { updateCurrentNodeIdLeft, updateCurrentNodeIdRight } from '../../store/panel-state-reducers'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  useJumpToParent,
  useLastSelectedIds,
  usePanelHighlight,
  useRefresh,
  useSelectionReset,
  useUpdateCurrentPathsIfNeeded,
} from './app-content'
import { useMemo, useRef } from 'react'

import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import CreateDialog from '../dialogs/create-dialog'
import DeleteConfirmationDialog from '../dialogs/delete-dialog'
import EditDialog from '../dialogs/edit-dialog'
import { FolderPanelHandle } from '../panel/panel-commands'
import Search from '../search/search'
import { closeCurrentTab } from '../../services/tabs/tabs'
import { useCreateDialogState } from '../dialogs/create-dialog-hook'
import { useDeleteDialogState } from '../dialogs/delete-dialog-hook'
import { useDocumentKeyListener } from './app-key-events'
import { useDragAndDropPanelBinder } from './app-drag-and-drop-panel-binders'
import { useEditDialogState } from '../dialogs/edit-dialog-hook'
import { useMoveHandlers } from './app-move-button-handlers'
import { usePairRef } from '../../services/utils/hooks'
import { useTheme } from '@mui/material/styles'
import { useThemeContext } from './theme-context'

const App: React.FC = () => {
  const theme = useTheme()
  const themeContext = useThemeContext()

  const panelAreaRef = useRef<HTMLDivElement>(null)
  const panelRefs = usePairRef<FolderPanelHandle | null>(null, null)

  const dispatch = useAppDispatch()
  const selectedSide = useAppSelector(state => state.side)
  const currentNodeIds = useAppSelector(state => state.currentNodeIds)

  const [rowsOutdated, refreshRows] = useRefresh()

  const lastSelectedIds = useLastSelectedIds(panelRefs)

  const resetCurrentSelection = useSelectionReset(panelRefs)

  const updateCurrentPathsIfNeeded = useUpdateCurrentPathsIfNeeded()

  const jumpToParent = useJumpToParent(panelRefs)

  const { handleGridReadyLeft, handleGridReadyRight } = useDragAndDropPanelBinder()

  const highlight = usePanelHighlight(panelRefs)

  const createDialog = useCreateDialogState(resetCurrentSelection, refreshRows, panelRefs)
  const editDialog = useEditDialogState(resetCurrentSelection, refreshRows, panelRefs)
  const deleteDialog = useDeleteDialogState(
    lastSelectedIds,
    updateCurrentPathsIfNeeded,
    resetCurrentSelection,
    refreshRows,
    panelRefs,
  )

  const dialogActions = useMemo<OpenDialogActions>(() => {
    return {
      openNewBookmark: createDialog.handleBookmarkOpen,
      openNewDirectory: createDialog.handleDirectoryOpen,
      openEdit: editDialog.handleOpen,
      openDelete: deleteDialog.handleOpen,
    }
  }, [createDialog, editDialog, deleteDialog])

  const { handleMoveBetweenPanels, handleMoveUp, handleMoveDown } = useMoveHandlers(
    panelRefs,
    highlight,
    refreshRows,
  )

  useDocumentKeyListener(panelAreaRef.current, highlight)

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <Box display='flex' justifyContent='center' alignItems='center'>
        <Search onJumpTo={jumpToParent} goAway={() => panelAreaRef.current?.focus()} />
        <IconButton
          sx={{ ml: 1, justifySelf: 'right' }}
          onClick={themeContext.toggleColorMode}
          color='inherit'
        >
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>

      <Grid
        container
        spacing={0.5}
        alignItems='stretch'
        sx={{ flex: 1, overflow: 'auto' }}
        ref={panelAreaRef}
      >
        <Grid item xs={6}>
          <FolderPanel
            ref={panelRefs.left}
            side={'left'}
            highlighted={selectedSide === 'left'}
            highlightSide={highlight.left}
            highlightOtherSide={highlight.right}
            notifyGridReady={handleGridReadyLeft}
            rowsOutdated={rowsOutdated}
            refreshRows={refreshRows}
            openDialogActions={dialogActions}
          />
        </Grid>

        <Grid item xs={6}>
          <FolderPanel
            ref={panelRefs.right}
            side={'right'}
            highlighted={selectedSide === 'right'}
            highlightSide={highlight.right}
            highlightOtherSide={highlight.left}
            notifyGridReady={handleGridReadyRight}
            rowsOutdated={rowsOutdated}
            refreshRows={refreshRows}
            openDialogActions={dialogActions}
          />
        </Grid>
      </Grid>

      <Box display='flex' justifyContent='center' alignItems='center' sx={{ padding: '5px' }}>
        <ButtonGroup variant='text' aria-label='Actions'>
          <Button
            onClick={createDialog.handleBookmarkOpen}
            disabled={currentNodeIds[selectedSide] === '0'}
          >
            New
          </Button>

          <Button
            onClick={createDialog.handleDirectoryOpen}
            disabled={currentNodeIds[selectedSide] === '0'}
          >
            New Folder
          </Button>
          <Button
            disabled={!(panelRefs[selectedSide].current?.singleRowSelectedOrFocused() ?? false)}
            onClick={editDialog.handleOpen}
          >
            Edit
          </Button>
          <Button
            disabled={currentNodeIds.left === currentNodeIds.right}
            onClick={() => dispatch(updateCurrentNodeIdRight(currentNodeIds.left))}
          >
            Mirror ({'\u2192'})
          </Button>
          <Button
            disabled={currentNodeIds.left === currentNodeIds.right}
            onClick={() => dispatch(updateCurrentNodeIdLeft(currentNodeIds.right))}
          >
            Mirror ({'\u2190'})
          </Button>
          <Button
            disabled={
              currentNodeIds.left === currentNodeIds.right ||
              !(panelRefs[selectedSide].current?.rowsSelectedOrFocused() ?? false)
            }
            onClick={handleMoveBetweenPanels}
          >
            Move
          </Button>
          <Button
            disabled={!(panelRefs[selectedSide].current?.rowsSelectedOrFocused() ?? false)}
            onClick={handleMoveUp}
          >
            Move Up ({'\u2191'})
          </Button>
          <Button
            disabled={!(panelRefs[selectedSide].current?.rowsSelectedOrFocused() ?? false)}
            onClick={handleMoveDown}
          >
            Move Down ({'\u2193'})
          </Button>
          <Button
            disabled={!(panelRefs[selectedSide].current?.rowsSelectedOrFocused() ?? false)}
            onClick={deleteDialog.handleOpen}
          >
            Delete
          </Button>
          <Button onClick={closeCurrentTab}>Exit</Button>
        </ButtonGroup>
      </Box>

      {createDialog.isOpen() ? (
        <CreateDialog
          open={createDialog.isOpen()}
          isDirectory={createDialog.directoryOpen}
          onConfirm={createDialog.handleConfirm}
          onCancel={createDialog.handleClose}
        />
      ) : (
        <></>
      )}

      {editDialog.open ? (
        <EditDialog
          open={editDialog.open}
          nodeId={panelRefs[selectedSide].current?.getSelectedNodeIds()[0]}
          onConfirm={editDialog.handleConfirm}
          onCancel={editDialog.handleClose}
        />
      ) : (
        <></>
      )}

      {deleteDialog.open ? (
        <DeleteConfirmationDialog
          open={deleteDialog.open}
          nodeIds={panelRefs[selectedSide].current?.getSelectedNodeIds() ?? []}
          onConfirm={deleteDialog.handleConfirm}
          onCancel={deleteDialog.handleClose}
        />
      ) : (
        <></>
      )}
    </Container>
  )
}

export default App

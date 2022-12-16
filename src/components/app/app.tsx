import { Box, Button, ButtonGroup, Container, Grid, IconButton } from '@mui/material'
import FolderPanel, { OpenDialogActions } from '../folder-panel/panel'
import {
  useJumpToParent,
  useLastSelectedIds,
  usePanelHighlight,
  useRefresh,
  useSelectionReset,
  useUpdateCurrentPathsIfNeeded,
} from './app-content'
import { useMemo, useRef, useState } from 'react'
import { usePairRef, usePairState } from '../../services/utils/hooks'

import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import CreateDialog from '../dialogs/create-dialog'
import DeleteConfirmationDialog from '../dialogs/delete-dialog'
import EditDialog from '../dialogs/edit-dialog'
import { FolderPanelHandle } from '../folder-panel/panel-commands'
import Search from '../search/search'
import { Side } from '../../services/utils/types'
import { closeCurrentTab } from '../../services/tabs/tabs'
import { useCreateDialogState } from '../dialogs/create-dialog-hook'
import { useDeleteDialogState } from '../dialogs/delete-dialog-hook'
import { useDocumentKeyListener } from './app-key-events'
import { useDragAndDropPanelBinder } from './app-drag-and-drop-panel-binders'
import { useEditDialogState } from '../dialogs/edit-dialog-hook'
import { useMoveHandlers } from './app-move-button-handlers'
import { useTheme } from '@mui/material/styles'
import { useThemeContext } from './theme-context'

const App: React.FC = () => {
  const theme = useTheme()
  const themeContext = useThemeContext()

  const panelAreaRef = useRef<HTMLDivElement>(null)

  const panelRefs = usePairRef<FolderPanelHandle | null>(null, null)
  const [selectedSide, setSelectedSide] = useState<Side>('left')
  const currentNodeIds = usePairState<string>('1', '2')

  const [rowsOutdated, refreshRows] = useRefresh()

  const lastSelectedIds = useLastSelectedIds(panelRefs, selectedSide)

  const resetCurrentSelection = useSelectionReset(panelRefs, selectedSide, currentNodeIds)

  const updateCurrentPathsIfNeeded = useUpdateCurrentPathsIfNeeded(selectedSide, currentNodeIds)

  const jumpToParent = useJumpToParent(panelRefs, selectedSide, currentNodeIds)

  const { handleGridReadyLeft, handleGridReadyRight } = useDragAndDropPanelBinder()

  const highlight = usePanelHighlight(panelRefs, setSelectedSide)

  const createDialog = useCreateDialogState(
    selectedSide,
    currentNodeIds,
    resetCurrentSelection,
    refreshRows,
    panelRefs,
  )
  const editDialog = useEditDialogState(selectedSide, resetCurrentSelection, refreshRows, panelRefs)
  const deleteDialog = useDeleteDialogState(
    lastSelectedIds,
    selectedSide,
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
    selectedSide,
    highlight,
    currentNodeIds,
    refreshRows,
  )

  useDocumentKeyListener(panelAreaRef, selectedSide, highlight)

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
            highlighted={selectedSide === 'left'}
            highlightSide={highlight.left}
            highlightOtherSide={highlight.right}
            currentNodeId={currentNodeIds.left.state}
            setCurrentNodeId={currentNodeIds.left.setState}
            notifyGridReady={handleGridReadyLeft}
            rowsOutdated={rowsOutdated}
            refreshRows={refreshRows}
            openDialogActions={dialogActions}
          />
        </Grid>

        <Grid item xs={6}>
          <FolderPanel
            ref={panelRefs.right}
            highlighted={selectedSide === 'right'}
            highlightSide={highlight.right}
            highlightOtherSide={highlight.left}
            currentNodeId={currentNodeIds.right.state}
            setCurrentNodeId={currentNodeIds.right.setState}
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
            disabled={currentNodeIds[selectedSide].state === '0'}
          >
            New
          </Button>

          <Button
            onClick={createDialog.handleDirectoryOpen}
            disabled={currentNodeIds[selectedSide].state === '0'}
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
            disabled={currentNodeIds.left.state === currentNodeIds.right.state}
            onClick={() => currentNodeIds.right.setState(currentNodeIds.left.state)}
          >
            Mirror ({'\u2192'})
          </Button>
          <Button
            disabled={currentNodeIds.left.state === currentNodeIds.right.state}
            onClick={() => currentNodeIds.left.setState(currentNodeIds.right.state)}
          >
            Mirror ({'\u2190'})
          </Button>
          <Button
            disabled={
              currentNodeIds.left.state === currentNodeIds.right.state ||
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

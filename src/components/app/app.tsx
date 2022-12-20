import { Box, Button, ButtonGroup, Container, Grid, IconButton } from '@mui/material'
import FolderPanel, { OpenDialogActions } from '../panel/panel'
import {
  useJumpToParent,
  useLoadAppCommonStateEffect,
  usePanelHighlight,
  useSelectionReset,
} from './app-content'
import { useMemo, useRef } from 'react'
import {
  useSelectFocusedPanelHasSelection,
  useSelectFocusedPanelHasSingleSelection,
  useSelectFocusedPanelInRootDir,
  useSelectLeftNodeId,
  useSelectRightNodeId,
} from '../../store/panel-state-hooks'

import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import CreateDialog from '../dialogs/create-dialog'
import DeleteConfirmationDialog from '../dialogs/delete-dialog'
import EditDialog from '../dialogs/edit-dialog'
import { FolderPanelHandle } from '../panel/panel-commands'
import Search from '../search/search'
import { closeCurrentTab } from '../../services/tabs/tabs'
import { updateNodeId } from '../../store/panel-state-reducers'
import { useAppDispatch } from '../../store/hooks'
import { useCreateDialogState } from '../dialogs/create-dialog-hook'
import { useDeleteDialogState } from '../dialogs/delete-dialog-hook'
import { useDocumentKeyListener } from './app-key-events'
import { useDragAndDropPanelBinder } from './app-drag-and-drop-panel-binders'
import { useEditDialogState } from '../dialogs/edit-dialog-hook'
import { useMoveHandlers } from './app-move-button-handlers'
import { usePairRef } from '../../services/utils/hooks'
import { useSelectFocusedSide } from '../../store/app-state-hooks'
import { useTheme } from '@mui/material/styles'
import { useThemeContext } from './theme-context'

const App: React.FC = () => {
  const theme = useTheme()
  const themeContext = useThemeContext()

  const dispatch = useAppDispatch()
  const focusedSide = useSelectFocusedSide()
  const leftNodeId = useSelectLeftNodeId()
  const rightNodeId = useSelectRightNodeId()
  const focusedPanelInRootDir = useSelectFocusedPanelInRootDir()
  const sameNodeIds = leftNodeId === rightNodeId
  const focusedPanelHasSelection = useSelectFocusedPanelHasSelection()
  const focusedPanelHasSingleSelection = useSelectFocusedPanelHasSingleSelection()

  const panelAreaRef = useRef<HTMLDivElement>(null)
  const panelRefs = usePairRef<FolderPanelHandle | null>(null, null)
  const { handleGridReadyLeft, handleGridReadyRight } = useDragAndDropPanelBinder()

  const jumpToParent = useJumpToParent(panelRefs)

  const highlight = usePanelHighlight(panelRefs)

  const resetCurrentSelection = useSelectionReset(panelRefs)
  const createDialog = useCreateDialogState(resetCurrentSelection, panelRefs)
  const editDialog = useEditDialogState(resetCurrentSelection, panelRefs)
  const deleteDialog = useDeleteDialogState(resetCurrentSelection, panelRefs)
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
  )

  useDocumentKeyListener(panelAreaRef.current, highlight)

  useLoadAppCommonStateEffect()

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
            highlightSide={highlight.left}
            highlightOtherSide={highlight.right}
            notifyGridReady={handleGridReadyLeft}
            openDialogActions={dialogActions}
          />
        </Grid>

        <Grid item xs={6}>
          <FolderPanel
            ref={panelRefs.right}
            side={'right'}
            highlightSide={highlight.right}
            highlightOtherSide={highlight.left}
            notifyGridReady={handleGridReadyRight}
            openDialogActions={dialogActions}
          />
        </Grid>
      </Grid>

      <Box display='flex' justifyContent='center' alignItems='center' sx={{ padding: '5px' }}>
        <ButtonGroup variant='text' aria-label='Actions'>
          <Button onClick={createDialog.handleBookmarkOpen} disabled={focusedPanelInRootDir}>
            New
          </Button>

          <Button onClick={createDialog.handleDirectoryOpen} disabled={focusedPanelInRootDir}>
            New Folder
          </Button>
          <Button disabled={!focusedPanelHasSingleSelection} onClick={editDialog.handleOpen}>
            Edit
          </Button>
          <Button
            disabled={sameNodeIds}
            onClick={() => dispatch(updateNodeId({ side: 'right', id: leftNodeId }))}
          >
            Mirror ({'\u2192'})
          </Button>
          <Button
            disabled={sameNodeIds}
            onClick={() => dispatch(updateNodeId({ side: 'left', id: rightNodeId }))}
          >
            Mirror ({'\u2190'})
          </Button>
          <Button
            disabled={sameNodeIds || !focusedPanelHasSelection}
            onClick={handleMoveBetweenPanels}
          >
            Move
          </Button>
          <Button disabled={!focusedPanelHasSelection} onClick={handleMoveUp}>
            Move Up ({'\u2191'})
          </Button>
          <Button disabled={!focusedPanelHasSelection} onClick={handleMoveDown}>
            Move Down ({'\u2193'})
          </Button>
          <Button disabled={!focusedPanelHasSelection} onClick={deleteDialog.handleOpen}>
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
          nodeId={panelRefs[focusedSide].current?.getSelectedNodeIds()[0]}
          onConfirm={editDialog.handleConfirm}
          onCancel={editDialog.handleClose}
        />
      ) : (
        <></>
      )}

      {deleteDialog.open ? (
        <DeleteConfirmationDialog
          open={deleteDialog.open}
          nodeIds={panelRefs[focusedSide].current?.getSelectedNodeIds() ?? []}
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

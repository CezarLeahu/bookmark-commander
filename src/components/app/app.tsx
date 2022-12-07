import { Box, Button, ButtonGroup, Container, Grid, IconButton } from '@mui/material'
import FolderPanel, { FolderPanelHandle } from '../folder-panel/panel'
import {
  useJumpToParent,
  useLastSelectedIds,
  useRefresh,
  useSelectionReset,
  useUpdateCurrentPathsIfNeeded,
} from './app-content'
import { usePairRef, usePairState } from '../../services/utils/hooks'

import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import CreateDialog from '../dialogs/create-dialog'
import DeleteConfirmationDialog from '../dialogs/delete-dialog'
import EditDialog from '../dialogs/edit-dialog'
import Search from '../search/search'
import { Side } from '../../services/utils/types'
import { closeCurrentTab } from '../../services/utils/utils'
import { useCreateDialogState } from '../dialogs/create-dialog-hook'
import { useDeleteDialogState } from '../dialogs/delete-dialog-hook'
import { useDragAndDropPanelBinder } from './grid-dnd-handlers'
import { useEditDialogState } from '../dialogs/edit-dialog-hook'
import { useMoveHandlers } from './move-handlers'
import { useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { useThemeContext } from './theme-context'

const App: React.FC = () => {
  const theme = useTheme()
  const themeContext = useThemeContext()

  const panelRefs = usePairRef<FolderPanelHandle | null>(null, null)
  const [selectedSide, setSelectedSide] = useState<Side>('left')
  const currentNodeIds = usePairState<string>('1', '2')
  const selectionModels = usePairState<string[]>([], [])

  const [rowsOutdated, refreshRows] = useRefresh()

  const lastSelectedIds = useLastSelectedIds(selectedSide, selectionModels)

  const resetCurrentSelection = useSelectionReset(selectedSide, currentNodeIds, selectionModels)

  const updateCurrentPathsIfNeeded = useUpdateCurrentPathsIfNeeded(selectedSide, currentNodeIds)

  const jumpToParent = useJumpToParent(selectedSide, currentNodeIds, selectionModels)

  const { handleGridReadyLeft, handleGridReadyRight } = useDragAndDropPanelBinder()

  const createDialog = useCreateDialogState(selectedSide, currentNodeIds, resetCurrentSelection)
  const editDialog = useEditDialogState(resetCurrentSelection)
  const deleteDialog = useDeleteDialogState(
    lastSelectedIds,
    updateCurrentPathsIfNeeded,
    resetCurrentSelection,
  )

  const { handleMoveBetweenPanels, handleMoveUp, handleMoveDown } = useMoveHandlers(
    selectedSide,
    setSelectedSide,
    currentNodeIds,
    selectionModels,
    refreshRows,
  )

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <Box display='flex' justifyContent='center' alignItems='center'>
        <Search onJumpTo={jumpToParent} />
        <IconButton
          sx={{ ml: 1, justifySelf: 'right' }}
          onClick={themeContext.toggleColorMode}
          color='inherit'
        >
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>

      <Grid container spacing={0.5} alignItems='stretch' sx={{ flex: 1, overflow: 'auto' }}>
        <Grid item xs={6}>
          <FolderPanel
            ref={panelRefs.left}
            highlighted={selectedSide === 'left'}
            highlightSide={() => setSelectedSide('left')}
            currentNodeId={currentNodeIds.left.state}
            setCurrentNodeId={currentNodeIds.left.setState}
            notifyGridReady={handleGridReadyLeft}
            selectionModel={selectionModels.left.state}
            setSelectionModel={selectionModels.left.setState}
            rowsOutdated={rowsOutdated}
            refreshRows={refreshRows}
          />
        </Grid>

        <Grid item xs={6}>
          <FolderPanel
            ref={panelRefs.right}
            highlighted={selectedSide === 'right'}
            highlightSide={() => setSelectedSide('right')}
            currentNodeId={currentNodeIds.right.state}
            setCurrentNodeId={currentNodeIds.right.setState}
            notifyGridReady={handleGridReadyRight}
            selectionModel={selectionModels.right.state}
            setSelectionModel={selectionModels.right.setState}
            rowsOutdated={rowsOutdated}
            refreshRows={refreshRows}
          />
        </Grid>
      </Grid>

      <Box display='flex' justifyContent='center' alignItems='center'>
        <ButtonGroup variant='text' aria-label='Actions'>
          <Button onClick={createDialog.handleBookmarkOpen}>New</Button>

          <Button onClick={createDialog.handleDirectoryOpen}>New Folder</Button>
          <Button
            disabled
            // disabled={lastSelectedIds().length !== 1}
            // TODO enable when feature is merged into MUI community (post https://github.com/mui/mui-x/pull/6773)
            onClick={() => panelRefs[selectedSide].current?.renameCell(lastSelectedIds()[0])}
          >
            Rename
          </Button>
          <Button disabled={lastSelectedIds().length !== 1} onClick={editDialog.handleOpen}>
            Edit
          </Button>
          <Button
            disabled={currentNodeIds.left.state === currentNodeIds.right.state}
            onClick={() =>
              currentNodeIds[selectedSide === 'left' ? 'right' : 'left'].setState(
                currentNodeIds[selectedSide].state,
              )
            }
          >
            Mirror (=)
          </Button>
          <Button
            disabled={
              currentNodeIds.left.state === currentNodeIds.right.state ||
              lastSelectedIds().length === 0
            }
            onClick={handleMoveBetweenPanels}
          >
            Move
          </Button>
          <Button disabled={lastSelectedIds().length === 0} onClick={handleMoveUp}>
            Move Up ({'\u2191'})
          </Button>
          <Button disabled={lastSelectedIds().length === 0} onClick={handleMoveDown}>
            Move Down ({'\u2193'})
          </Button>
          <Button disabled={lastSelectedIds().length === 0} onClick={deleteDialog.handleOpen}>
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
          nodeId={String(selectionModels[selectedSide].state?.[0])}
          onConfirm={editDialog.handleConfirm}
          onCancel={editDialog.handleClose}
        />
      ) : (
        <></>
      )}

      {deleteDialog.open ? (
        <DeleteConfirmationDialog
          open={deleteDialog.open}
          nodeIds={selectionModels[selectedSide].state?.map(e => String(e)) ?? []}
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

import { Box, Button, ButtonGroup, Container, Grid, IconButton } from '@mui/material'
import FolderPanel, { FolderPanelHandle } from '../folder-panel/folder-panel'
import { Side, other } from '../../services/utils/types'
import { useCallback, useState } from 'react'
import { usePairRef, usePairState } from '../../services/utils/hooks'

import { BTN } from '../../services/bookmarks/types'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import CreateDialog from '../dialogs/create-dialog'
import DeleteConfirmationDialog from '../dialogs/delete-dialog'
import EditDialog from '../dialogs/edit-dialog'
import Search from '../search/search'
import { closeCurrentTab } from '../../services/utils/utils'
import { getNode } from '../../services/bookmarks/queries'
import { useCreateDialogState } from '../dialogs/create-dialog-hook'
import { useDeleteDialogState } from '../dialogs/delete-dialog-hook'
import { useDndBetweenGrids } from './grid-dnd-handlers'
import { useEditDialogState } from '../dialogs/edit-dialog-hook'
import { useMoveHandlers } from './move-handlers'
import { useTheme } from '@mui/material/styles'
import { useThemeContext } from './theme-context'

const App: React.FC = () => {
  const theme = useTheme()
  const themeContext = useThemeContext()

  const [, setRefreshContent] = useState({})
  const forceUpdate = useCallback(() => setRefreshContent({}), [])

  const panelRefs = usePairRef<FolderPanelHandle | null>(null, null)
  const [selectedSide, setSelectedSide] = useState<Side>('left')
  const currentNodeIds = usePairState<string>('1', '2')

  const selectionModels = usePairState<string[]>([], [])

  const lastSelectedIds = useCallback(
    (): string[] => selectionModels[selectedSide].state,
    [selectionModels, selectedSide],
  )

  const resetCurrentSelection = useCallback((): void => {
    selectionModels[selectedSide].setState([])
    const otherSide: Side = other(selectedSide)
    if (currentNodeIds[otherSide] === currentNodeIds[selectedSide]) {
      selectionModels[otherSide].setState([])
    }
  }, [selectionModels, selectedSide, currentNodeIds])

  const updateCurrentNodesIfNeeded = useCallback(
    (idsToBeDeleted: string[]): void => {
      if (idsToBeDeleted.length === 0) {
        return
      }

      const ids = new Set<string>(idsToBeDeleted)
      const otherSide: Side = other(selectedSide)

      const checkSide = (side: Side): void => {
        if (ids.has(currentNodeIds[side].state)) {
          getNode(currentNodeIds[side].state)
            .then(n => {
              currentNodeIds[side].setState(n.parentId ?? '0')
            })
            .catch(e => {
              console.log(e)
              currentNodeIds[side].setState('0')
            })
        }
      }

      checkSide(otherSide)
      checkSide(selectedSide)
    },
    [currentNodeIds, selectedSide],
  )

  const {
    createBookmarkDialogOpen,
    createDirectoryDialogOpen,
    handleCreateBookmarkDialogOpen,
    handleCreateDirectoryDialogOpen,
    handleCreateDialogConfirm,
    handleCreateDialogClose,
  } = useCreateDialogState(selectedSide, currentNodeIds, resetCurrentSelection)

  const { editDialogOpen, handleEditDialogOpen, handleEditDialogConfirm, handleEditDialogClose } =
    useEditDialogState(resetCurrentSelection)

  const {
    deleteDialogOpen,
    handleDeleteDialogOpen,
    handleDeleteDialogConfirm,
    handleDeleteDialogClose,
  } = useDeleteDialogState(lastSelectedIds, updateCurrentNodesIfNeeded, resetCurrentSelection)

  const closeAllDialogs = useCallback((): void => {
    handleCreateDialogClose()
    handleEditDialogClose()
    handleDeleteDialogClose()
    resetCurrentSelection()
  }, [
    handleCreateDialogClose,
    handleEditDialogClose,
    handleDeleteDialogClose,
    resetCurrentSelection,
  ])

  const { handleMove, handleMoveUp, handleMoveDown } = useMoveHandlers(
    selectedSide,
    setSelectedSide,
    currentNodeIds,
    selectionModels,
    lastSelectedIds,
    resetCurrentSelection,
    closeAllDialogs,
  )

  const handleJumpTo = useCallback(
    (node: BTN): void => {
      console.log(`jump to directory ${node.parentId ?? '0'}`)
      currentNodeIds[selectedSide].setState(node.parentId ?? '0')
      selectionModels[selectedSide].setState([node.id])
    },
    [currentNodeIds, selectionModels, selectedSide],
  )

  const { handleGridReadyLeft, handleGridReadyRight } = useDndBetweenGrids()

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <Box display='flex' justifyContent='center' alignItems='center'>
        <Search onJumpTo={handleJumpTo} />
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
            onGridReady={handleGridReadyLeft}
            selectionModel={selectionModels.left.state}
            setSelectionModel={selectionModels.left.setState}
            forceUpdate={forceUpdate}
          />
        </Grid>

        <Grid item xs={6}>
          <FolderPanel
            ref={panelRefs.right}
            highlighted={selectedSide === 'right'}
            highlightSide={() => setSelectedSide('right')}
            currentNodeId={currentNodeIds.right.state}
            setCurrentNodeId={currentNodeIds.right.setState}
            onGridReady={handleGridReadyRight}
            selectionModel={selectionModels.right.state}
            setSelectionModel={selectionModels.right.setState}
            forceUpdate={forceUpdate}
          />
        </Grid>
      </Grid>

      <Box display='flex' justifyContent='center' alignItems='center'>
        <ButtonGroup variant='text' aria-label='Actions'>
          <Button onClick={handleCreateBookmarkDialogOpen}>New</Button>

          <Button onClick={handleCreateDirectoryDialogOpen}>New Folder</Button>
          <Button
            disabled
            // disabled={lastSelectedIds().length !== 1}
            // TODO enable when feature is merged into MUI community (post https://github.com/mui/mui-x/pull/6773)
            onClick={() => panelRefs[selectedSide].current?.renameCell(lastSelectedIds()[0])}
          >
            Rename
          </Button>
          <Button disabled={lastSelectedIds().length !== 1} onClick={handleEditDialogOpen}>
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
            onClick={handleMove}
          >
            Move
          </Button>
          <Button disabled={lastSelectedIds().length === 0} onClick={handleMoveUp}>
            Move Up ({'\u2191'})
          </Button>
          <Button disabled={lastSelectedIds().length === 0} onClick={handleMoveDown}>
            Move Down ({'\u2193'})
          </Button>
          <Button disabled={lastSelectedIds().length === 0} onClick={handleDeleteDialogOpen}>
            Delete
          </Button>
          <Button onClick={closeCurrentTab}>Exit</Button>
        </ButtonGroup>
      </Box>

      {createBookmarkDialogOpen || createDirectoryDialogOpen ? (
        <CreateDialog
          open={createBookmarkDialogOpen || createDirectoryDialogOpen}
          isDirectory={createDirectoryDialogOpen}
          onConfirm={handleCreateDialogConfirm}
          onCancel={handleCreateDialogClose}
        />
      ) : (
        <></>
      )}

      {editDialogOpen ? (
        <EditDialog
          open={editDialogOpen}
          nodeId={String(selectionModels[selectedSide].state?.[0])}
          onConfirm={handleEditDialogConfirm}
          onCancel={handleEditDialogClose}
        />
      ) : (
        <></>
      )}

      {deleteDialogOpen ? (
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          nodeIds={selectionModels[selectedSide].state?.map(e => String(e)) ?? []}
          onConfirm={handleDeleteDialogConfirm}
          onCancel={handleDeleteDialogClose}
        />
      ) : (
        <></>
      )}
    </Container>
  )
}

export default App

import { useCallback, useState } from 'react'
import { Alert, Container, Grid, Box, ButtonGroup, Button } from '@mui/material'
import FolderPanel, { FolderPanelHandle } from './folder-panel'
import Search from './search'
import { BTN } from '../bookmarks/types'
import EditDialog from './dialogs/edit-dialog'
import {
  createBookmark,
  createDir,
  moveAll,
  moveDown,
  moveUp,
  removeAll,
  update,
} from '../bookmarks/commands'
import { closeCurrentTab } from '../misc/utils'
import CreateDialog from './dialogs/create-dialog'
import DeleteConfirmationDialog from './dialogs/delete-confirmation-dialog'
import { containsNonEmptyDirectories } from '../bookmarks/queries'
import { Side } from '../misc/types'
import { usePairRef, usePairState } from '../misc/hooks'

const App: React.FC = () => {
  const [error, setError] = useState<string>()
  const [refreshContent, setRefreshContent] = useState({})
  const forceUpdate = useCallback(() => setRefreshContent({}), [])

  const panelRefs = usePairRef<FolderPanelHandle | null>(null, null)
  const [selectedSide, setSelectedSide] = useState<Side>('left')
  const currentNodeIds = usePairState<string>('1', '2')

  const selectionModels = usePairState<string[]>([], [])

  const lastSelectedIds = (): string[] => {
    return selectionModels[selectedSide].state
      .filter(e => e !== undefined)
      .filter(e => e !== currentNodeIds[selectedSide].state)
      .map(e => String(e))
  }

  const handleDialogClose = (resetSelection?: boolean): void => {
    setCreateBookmarkDialogOpen(false)
    setCreateDirectoryDialogOpen(false)
    setEditDialogOpen(false)
    setConfirmDialogOpen(false)
    if (resetSelection !== undefined && resetSelection) {
      resetCurrentSelection()
    }
  }
  const resetCurrentSelection = (): void => {
    selectionModels[selectedSide].setState([])
    const otherSide: Side = selectedSide === 'left' ? 'right' : 'left'
    if (currentNodeIds[otherSide] === currentNodeIds[selectedSide]) {
      selectionModels[otherSide].setState([])
    }
    forceUpdate()
  }

  const [createBookmarkDialogOpenB, setCreateBookmarkDialogOpen] = useState(false)
  const [createDirectoryDialogOpen, setCreateDirectoryDialogOpen] = useState(false)
  const handleCreateDialogConfirm = (title: string, url?: string): void => {
    const parentId = currentNodeIds[selectedSide].state
    if (parentId === undefined) {
      console.log('The current panel current node id is unknown (undefined).')
      handleDialogClose()
      return
    }

    if (url === undefined) {
      createDir(parentId, title)
        .then(() => handleDialogClose(true))
        .catch(e => setError(e))
    } else {
      createBookmark(parentId, title, url)
        .then(() => handleDialogClose(true))
        .catch(e => setError(e))
    }
  }

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const handleEditDialogConfirm = (node: BTN): void => {
    update(node)
      .then(() => handleDialogClose(true))
      .catch(e => setError(e))
  }

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const handleDeleteDialogConfirm = (): void => {
    const ids: string[] = lastSelectedIds()
    if (ids.length === 0) {
      handleDialogClose()
      return
    }

    containsNonEmptyDirectories(ids)
      .then(nonEmptyDirsExist => {
        if (nonEmptyDirsExist) {
          setError('Cannot delete non-empty folders!')
          handleDialogClose()
          return
        }
        removeAll(ids)
          .then(() => handleDialogClose(true))
          .catch(e => console.log(e))
      })
      .catch(e => console.log(e))
  }

  const handleMove = (): void => {
    const nodeIds = lastSelectedIds()
    if (nodeIds === undefined || nodeIds.length === 0) {
      return
    }

    if (currentNodeIds.left.state === currentNodeIds.right.state) {
      console.log('Source directory is the same as the target directory')
    }

    const otherSide: Side = selectedSide === 'left' ? 'right' : 'left'

    moveAll(nodeIds, currentNodeIds[otherSide].state)
      .then(() => {
        resetCurrentSelection()
        selectionModels[otherSide].setState(nodeIds)
        setSelectedSide(otherSide)
      })
      .catch(e => console.log(e))
  }

  const handleMoveUp = (): void => {
    const nodeIds = lastSelectedIds()
    if (nodeIds === undefined || nodeIds.length === 0) {
      return
    }
    moveUp(nodeIds)
      .then(() => {
        handleDialogClose(true)
        selectionModels[selectedSide].setState(nodeIds)
      })
      .catch(e => console.log(e))
  }

  const handleMoveDown = (): void => {
    const nodeIds = lastSelectedIds()
    if (nodeIds === undefined || nodeIds.length === 0) {
      return
    }
    moveDown(nodeIds)
      .then(() => {
        handleDialogClose(true)
        selectionModels[selectedSide].setState(nodeIds)
      })
      .catch(e => console.log(e))
  }

  const handleJumpTo = (node: BTN): void => {
    console.log(`jump to directory ${node.parentId ?? '0'}`)
    currentNodeIds[selectedSide].setState(node.parentId ?? '0')
    selectionModels[selectedSide].setState([node.id])
  }

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
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
        <Search onJumpTo={handleJumpTo} />
      </Box>

      <Grid container spacing={0.5} alignItems='stretch' sx={{ flex: 1, overflow: 'auto' }}>
        <Grid item xs={6}>
          <FolderPanel
            currentNodeId={currentNodeIds.left.state}
            setCurrentNodeId={currentNodeIds.left.setState}
            selected={selectedSide === 'left'}
            onSelect={node => {
              setSelectedSide('left')
              console.log(`Selected left panel - id ${node.id}`)
            }}
            selectionModel={selectionModels.left.state}
            setSelectionModel={selectionModels.left.setState}
            refreshContent={refreshContent}
            ref={panelRefs.left}
          />
        </Grid>

        <Grid item xs={6}>
          <FolderPanel
            currentNodeId={currentNodeIds.right.state}
            setCurrentNodeId={currentNodeIds.right.setState}
            selected={selectedSide === 'right'}
            onSelect={node => {
              setSelectedSide('right')
              console.log(`Selected right panel - id ${node.id}`)
            }}
            selectionModel={selectionModels.right.state}
            setSelectionModel={selectionModels.right.setState}
            refreshContent={refreshContent}
            ref={panelRefs.right}
          />
        </Grid>
      </Grid>

      <Box display='flex' justifyContent='center' alignItems='center'>
        <ButtonGroup variant='text' aria-label='Actions'>
          <Button onClick={() => setCreateBookmarkDialogOpen(true)}>New</Button>

          <Button onClick={() => setCreateDirectoryDialogOpen(true)}>New Folder</Button>
          <Button
            disabled
            // disabled={lastSelectedIds().length !== 1}
            // TODO enable when feature is merged into MUI community (post https://github.com/mui/mui-x/pull/6773)
            onClick={() => panelRefs[selectedSide].current?.renameCell(lastSelectedIds()[0])}
          >
            Rename
          </Button>
          <Button disabled={lastSelectedIds().length !== 1} onClick={() => setEditDialogOpen(true)}>
            Edit
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
          <Button
            disabled={lastSelectedIds().length === 0}
            onClick={() => setConfirmDialogOpen(true)}
          >
            Delete
          </Button>
          <Button onClick={closeCurrentTab}>Exit</Button>
        </ButtonGroup>
      </Box>

      {createBookmarkDialogOpenB || createDirectoryDialogOpen ? (
        <CreateDialog
          open={createBookmarkDialogOpenB || createDirectoryDialogOpen}
          isDirectory={createDirectoryDialogOpen}
          onConfirm={handleCreateDialogConfirm}
          onCancel={() => handleDialogClose()}
        />
      ) : (
        <></>
      )}

      {editDialogOpen ? (
        <EditDialog
          open={editDialogOpen}
          nodeId={String(selectionModels[selectedSide].state?.[0])}
          onConfirm={handleEditDialogConfirm}
          onCancel={() => handleDialogClose()}
        />
      ) : (
        <></>
      )}

      {confirmDialogOpen ? (
        <DeleteConfirmationDialog
          open={confirmDialogOpen}
          nodeIds={selectionModels[selectedSide].state?.map(e => String(e)) ?? []}
          onConfirm={handleDeleteDialogConfirm}
          onCancel={() => handleDialogClose()}
        />
      ) : (
        <></>
      )}
    </Container>
  )
}

export default App

import { useReducer, useRef, useState } from 'react'
import { Alert, Container, Grid, Box, ButtonGroup, Button } from '@mui/material'
import FolderPanel, { FolderPanelHandle } from './folder-panel'
import Search from './search'
import { BTN } from '../bookmarks/types'
import EditDialog from './dialogs/edit-dialog'
import { createBookmark, createDir, removeAll, update } from '../bookmarks/commands'
import { closeCurrentTab } from '../misc/utils'
import CreateDialog from './dialogs/create-dialog'
import DeleteConfirmationDialog from './dialogs/delete-confirmation-dialog'
import { GridRowId } from '@mui/x-data-grid'
import { containsNonEmptyDirectories } from '../bookmarks/queries'
import { Side } from '../misc/types'
import { usePairRef, usePairState } from '../misc/hooks'

const App: React.FC = () => {
  const [error, setError] = useState<string>()
  const [, forceRerender] = useReducer((x: number) => x + 1, 0)

  const panelRefs = usePairRef<FolderPanelHandle | null>(null, null)
  const selectedSide = useRef<Side>('left')
  const currentNodeIds = usePairRef<string | undefined>('1', '2')

  const selectionModels = usePairState<GridRowId[]>([], [])

  const lastSelectedIds = (): string[] => {
    return selectionModels[selectedSide.current].state
      .filter(e => e !== undefined)
      .map(e => String(e))
  }

  const handleDialogClose = (): void => {
    setCreateDialogOpen(false)
    setEditDialogOpen(false)
    setConfirmDialogOpen(false)
    forceRerender()
  }

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const isDirCreate = useRef<boolean>(false)
  const handleCreateDialogConfirm = (title: string, url?: string): void => {
    const parentId = currentNodeIds[selectedSide.current].current
    if (parentId === undefined) {
      console.log('The current panel current node id is unknown (undefined).')
      handleDialogClose()
      return
    }

    if (url === undefined) {
      createDir(parentId, title)
        .then(() => handleDialogClose())
        .catch(e => console.log(e))
    } else {
      createBookmark(parentId, title, url)
        .then(() => handleDialogClose())
        .catch(e => console.log(e))
    }
  }

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const handleEditDialogConfirm = (node: BTN): void => {
    update(node)
      .then()
      .catch(e => setError(e))

    handleDialogClose()
  }

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const handleConfirmDialogConfirm = (): void => {
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
        removeAll(ids).catch(e => console.log(e))
        handleDialogClose()
      })
      .catch(e => console.log(e))
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
        <Search />
      </Box>

      <Grid container spacing={0} alignItems='stretch' sx={{ flex: 1, overflow: 'auto' }}>
        <Grid item xs={6}>
          <FolderPanel
            initialNodeID={currentNodeIds.left.current ?? '1'}
            updateCurrentNodeID={id => (currentNodeIds.left.current = id)}
            onSelect={node => {
              selectedSide.current = 'left'
              currentNodeIds.left.current = node.parentId
              console.log(`Selected left panel - id ${node.id}`)
            }}
            onSelectionModelChange={model => selectionModels.left.setState(model)}
            ref={panelRefs.left}
          />
        </Grid>

        <Grid item xs={6}>
          <FolderPanel
            initialNodeID={currentNodeIds.right.current ?? '2'}
            onSelect={node => {
              selectedSide.current = 'right'
              console.log(`Selected right panel - id ${node.id}`)
            }}
            updateCurrentNodeID={id => (currentNodeIds.right.current = id)}
            onSelectionModelChange={model => selectionModels.right.setState(model)}
            ref={panelRefs.right}
          />
        </Grid>
      </Grid>

      <Box display='flex' justifyContent='center' alignItems='center'>
        <ButtonGroup variant='text' aria-label='Actions'>
          <Button onClick={() => setCreateDialogOpen(true)}>Create</Button>
          <Button
            disabled
            // disabled={lastSelectedIds().length !== 1}
            // TODO enable when feature is merged into MUI community (post https://github.com/mui/mui-x/pull/6773)
            onClick={() =>
              panelRefs[selectedSide.current].current?.renameCell(lastSelectedIds()[0])
            }
          >
            Rename
          </Button>
          <Button
            disabled={lastSelectedIds().length !== 1}
            onClick={() => {
              isDirCreate.current = false
              setEditDialogOpen(true)
            }}
          >
            Edit
          </Button>
          <Button disabled>Move</Button>
          <Button disabled>Move Up ({'\u2191'})</Button>
          <Button disabled>Move Down ({'\u2193'})</Button>
          <Button disabled>Sort (ASC)</Button>
          <Button disabled>Sort (DESC)</Button>
          <Button
            onClick={() => {
              isDirCreate.current = true
              setCreateDialogOpen(true)
            }}
          >
            New Folder
          </Button>
          <Button
            onClick={() => setConfirmDialogOpen(true)}
            disabled={lastSelectedIds().length === 0}
          >
            Delete
          </Button>
          <Button onClick={closeCurrentTab}>Exit</Button>
        </ButtonGroup>
      </Box>

      {createDialogOpen ? (
        <CreateDialog
          open={createDialogOpen}
          isDirectory={isDirCreate.current}
          onConfirm={handleCreateDialogConfirm}
          onCancel={handleDialogClose}
        />
      ) : (
        <></>
      )}

      {lastSelectedIds().length !== 1 && editDialogOpen ? (
        <EditDialog
          open={editDialogOpen}
          nodeId={String(selectionModels[selectedSide.current].state?.[0])}
          onConfirm={handleEditDialogConfirm}
          onCancel={handleDialogClose}
        />
      ) : (
        <></>
      )}

      {lastSelectedIds().length > 0 && confirmDialogOpen ? (
        <DeleteConfirmationDialog
          open={confirmDialogOpen}
          nodeIds={selectionModels[selectedSide.current].state?.map(e => String(e)) ?? []}
          onConfirm={handleConfirmDialogConfirm}
          onCancel={handleDialogClose}
        />
      ) : (
        <></>
      )}
    </Container>
  )
}

export default App

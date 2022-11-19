import { useReducer, useRef, useState } from 'react'
import { Alert, Container, Grid, Box, ButtonGroup, Button } from '@mui/material'
import FolderPanel, { FolderPanelHandle } from './folder-panel'
import Search from './search'
import { BTN, Side } from '../bookmarks/types'
import EditDialog from './dialogs/edit-dialog'
import { update } from '../bookmarks/commands'
import { closeCurrentTab } from '../bookmarks/utils'
import CreateDialog from './dialogs/create-dialog'

const App: React.FC = () => {
  const [error, setError] = useState<string>()
  const [, forceRerender] = useReducer((x: number) => x + 1, 0)

  const panelRefs = {
    left: useRef<FolderPanelHandle | null>(null),
    right: useRef<FolderPanelHandle | null>(null),
  }

  const selectedSide = useRef<Side>('left')
  const lastSelectedNodes = {
    left: useRef<BTN>(),
    right: useRef<BTN>(),
  }
  const lastNode = lastSelectedNodes[selectedSide.current].current

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const isDirCreate = useRef<boolean>(false)
  const handleCreateDialogConfirm = (title: string, url?: string): void => {
    // todo

    handleCreateDialogCancel()
  }
  const handleCreateDialogCancel = (): void => {
    forceRerender()
    setCreateDialogOpen(false)
  }

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const handleEditDialogConfirm = (node: BTN): void => {
    update(node)
      .then()
      .catch(e => setError(e))

    handleEditDialogCancel()
  }
  const handleEditDialogCancel = (): void => {
    forceRerender()
    setEditDialogOpen(false)
  }

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const handleConfirmDialogConfirm = (): void => {
    // todo

    handleConfirmDialogCancel()
  }
  const handleConfirmDialogCancel = (): void => {
    forceRerender()
    setConfirmDialogOpen(false)
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
            index={1}
            onSelect={node => {
              selectedSide.current = 'left'
              lastSelectedNodes.left.current = node
              console.log(`Selected left panel - id ${node.id}`)
            }}
            ref={panelRefs.left}
          />
        </Grid>

        <Grid item xs={6}>
          <FolderPanel
            index={2}
            onSelect={node => {
              selectedSide.current = 'right'
              lastSelectedNodes.right.current = node
              console.log(`Selected right panel - id ${node.id}`)
            }}
            ref={panelRefs.right}
          />
        </Grid>
      </Grid>

      <Box display='flex' justifyContent='center' alignItems='center'>
        <ButtonGroup variant='text' aria-label='Actions'>
          <Button onClick={() => setCreateDialogOpen(true)}>Create</Button>
          <Button
            disabled // TODO enable when feature is merged into MUI community (post https://github.com/mui/mui-x/pull/6773)
            onClick={() =>
              panelRefs[selectedSide.current].current?.renameCell(
                lastSelectedNodes[selectedSide.current].current?.id,
              )
            }
          >
            Rename
          </Button>
          <Button
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
          <Button disabled>Delete</Button>
          <Button onClick={closeCurrentTab}>Exit</Button>
        </ButtonGroup>
      </Box>

      {createDialogOpen ? (
        <CreateDialog
          open={createDialogOpen}
          isDirectory={isDirCreate.current}
          onConfirm={handleCreateDialogConfirm}
          onCancel={handleCreateDialogCancel}
        />
      ) : (
        <></>
      )}

      {lastNode !== undefined && editDialogOpen ? (
        <EditDialog
          open={editDialogOpen}
          node={lastNode}
          onConfirm={handleEditDialogConfirm}
          onCancel={handleEditDialogCancel}
        />
      ) : (
        <></>
      )}
    </Container>
  )
}

export default App

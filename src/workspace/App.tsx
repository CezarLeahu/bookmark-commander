import { useReducer, useRef, useState } from 'react'
import { Alert, Container, Grid, Box, ButtonGroup, Button } from '@mui/material'
import FolderPanel, { FolderPanelHandle } from './folder-panel'
import Search from './search'
import { BTN, Side } from '../bookmarks/types'
import EditDialog from './dialogs/edit-dialog'
import { update } from '../bookmarks/commands'

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

  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const handleEditDialogClose = (node: BTN | undefined): void => {
    if (node !== undefined) {
      update(node)
        .then()
        .catch(e => setError(e))
    }
    forceRerender()
    setEditDialogOpen(false)
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
          <Button onClick={() => setEditDialogOpen(true)}>Edit</Button>
          <Button disabled>Move</Button>
          <Button disabled>New Folder</Button>
          <Button disabled>Delete</Button>
          <Button disabled>Exit</Button>
        </ButtonGroup>
      </Box>

      {lastNode !== undefined && editDialogOpen ? (
        <EditDialog open={editDialogOpen} node={lastNode} onClose={handleEditDialogClose} />
      ) : (
        <></>
      )}
    </Container>
  )
}

export default App

import { useReducer, useRef, useState } from 'react'
import { Alert, Container, Grid, Box, ButtonGroup, Button } from '@mui/material'
import FolderPanel from './folder-panel'
import Search from './search'
import { BTN, Side } from '../bookmarks/types'
import RenameDialog from './rename-dialog'

const App = (): JSX.Element => {
  const [error, setError] = useState<string>()
  const [, forceRerender] = useReducer((x: number) => x + 1, 0)

  const selectedSide = useRef<Side>('left')
  const lastSelectedNodes = {
    left: useRef<BTN>(),
    right: useRef<BTN>(),
  }
  const lastNode = lastSelectedNodes[selectedSide.current].current

  const [renameDialogOpen, setRenameDialogOpen] = useState(false)

  const handleRenameDialogClose = (node: BTN): void => {
    setRenameDialogOpen(false)
    // setLastSelectedValue(node) // todo check if this line is needed
    console.log(node)
    // todo update with update API
    forceRerender()
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
              console.log('Selected left panel')
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <FolderPanel
            index={2}
            onSelect={node => {
              selectedSide.current = 'right'
              lastSelectedNodes.right.current = node
              console.log('Selected right panel')
            }}
          />
        </Grid>
      </Grid>

      <Box display='flex' justifyContent='center' alignItems='center'>
        <ButtonGroup variant='text' aria-label='Actions'>
          <Button disabled>F2 Rename</Button>
          <Button disabled>F4 Edit</Button>
          <Button disabled>F5 Copy</Button>
          <Button disabled>F6 Move</Button>
          <Button disabled>F7 New Folder</Button>
          <Button disabled>F8 Delete</Button>
          <Button disabled>F10 Exit</Button>
        </ButtonGroup>
      </Box>

      {lastNode !== undefined ? (
        <RenameDialog open={renameDialogOpen} node={lastNode} onClose={handleRenameDialogClose} />
      ) : (
        <></>
      )}
    </Container>
  )
}

export default App

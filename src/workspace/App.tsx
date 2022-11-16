import { useRef, useState } from 'react'
import { Alert, Container, Grid, Box, ButtonGroup, Button } from '@mui/material'
import FolderPanel from './folder-panel'
import Search from './search'

type Side = 'left' | 'right'

const App = (): JSX.Element => {
  const selectedSize = useRef<Side>('left')
  const [error, setError] = useState<string>()

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
          <FolderPanel index={1} />
        </Grid>

        <Grid item xs={6}>
          <FolderPanel index={2} />
        </Grid>
      </Grid>

      <Box display='flex' justifyContent='center' alignItems='center'>
        <ButtonGroup variant='text' aria-label='Actions'>
          <Button>F2 Rename</Button>
          <Button>F4 Edit</Button>
          <Button>F5 Copy</Button>
          <Button>F6 Move</Button>
          <Button>F7 New Folder</Button>
          <Button>F8 Delete</Button>
          <Button>F10 Exit</Button>
        </ButtonGroup>
      </Box>
    </Container>
  )
}

export default App

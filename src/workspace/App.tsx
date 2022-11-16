import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import ButtonGroup from '@mui/material/ButtonGroup'
import Button from '@mui/material/Button'
import FolderPanel from './folder-panel'
import Search from './search'

const App = (): JSX.Element => {
  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      <Box display='flex' justifyContent='center' alignItems='center'>
        <Search />
      </Box>

      <Grid container spacing={0} alignItems='stretch' sx={{ flex: 1, overflow: 'auto' }}>
        <Grid item xs={6}>
          <FolderPanel />
        </Grid>

        <Grid item xs={6}>
          <FolderPanel />
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

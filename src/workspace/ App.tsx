import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FolderPanel from './FolderPanel'

const App = (): JSX.Element => {
  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',

        backgroundColor: 'red',
      }}
    >
      <Box sx={{ backgroundColor: 'green' }}>
        <span>Header</span>
      </Box>

      <Grid
        container
        spacing={0}
        alignItems='stretch'
        sx={{
          flex: 1,
          overflow: 'auto',
          backgroundColor: 'blue',
        }}
      >
        <Grid item xs={6} sx={{ backgroundColor: 'purple' }}>
          <FolderPanel />
        </Grid>

        <Grid item xs={6} sx={{ backgroundColor: 'orange' }}>
          <FolderPanel />
        </Grid>
      </Grid>

      <Box sx={{ backgroundColor: 'green' }}>
        <span>Footer</span>
      </Box>
    </Container>
  )
}

export default App

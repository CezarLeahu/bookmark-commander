import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'

const Copyright = (): JSX.Element => {
  return (
    <Typography variant='body2' color='text.secondary' align='center'>
      {'Copyright © '}
      <Link color='inherit' href='https://mui.com/'>
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const App = (): JSX.Element => {
  return (
    <Container sx={{ backgroundColor: 'red' }}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Container maxWidth='sm'>
              <span>Header</span>
            </Container>
          </Grid>
          <Grid item xs={6}>
            <Box
              sx={{
                width: 300,
                height: 300,
                backgroundColor: 'primary.dark',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  opacity: [0.9, 0.8, 0.7],
                },
              }}
            >
              <span>Left</span>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              sx={{
                width: 300,
                height: 300,
                backgroundColor: 'primary.dark',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  opacity: [0.9, 0.8, 0.7],
                },
              }}
            >
              <span>Right</span>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ my: 4 }}>
        <Typography variant='h4' component='h1' gutterBottom>
          Create React App example
        </Typography>
        <Copyright />
      </Box>
    </Container>
  )
}

export default App

import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import ButtonGroup from '@mui/material/ButtonGroup'
import Button from '@mui/material/Button'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { bookmarks, breadcrumbs, mainLocations } from '../bookmarks/bookmarks'

const columns: GridColDef[] = [
  {
    field: 'title',
    headerName: 'Title',
    // width: 250,
    editable: true,
  },
  {
    field: 'url',
    headerName: 'URL',
    // width: 250,
    editable: true,
  },
]

const rows = bookmarks()

const FolderPanel = (): JSX.Element => {
  const [pathDirs, currentDir] = breadcrumbs()

  const mainDirs = mainLocations()

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        flex: 1,
        minHeight: '10px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box display='flex' justifyContent='center' alignItems='center'>
        <ButtonGroup variant='text' aria-label='Main Bookmark Locations'>
          {mainDirs.map(d => (
            <Button key={'maindir=' + d.id} sx={{ textTransform: 'none' }}>
              {d.title}
            </Button>
          ))}
        </ButtonGroup>
      </Box>
      <Box>
        <Breadcrumbs aria-label='breadcrumb'>
          {pathDirs.map(d => (
            <Link key={'breadcrumb-' + d.id}>{d.title}</Link>
          ))}
          <Typography color='text.primary'>{currentDir.title}</Typography>
        </Breadcrumbs>
      </Box>

      <DataGrid
        rows={rows}
        columns={columns}
        autoPageSize
        checkboxSelection
        density='compact'
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
        sx={{
          flex: 1,
        }}
      />
    </Container>
  )
}

export default FolderPanel

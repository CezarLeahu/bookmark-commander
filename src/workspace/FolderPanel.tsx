import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { bookmarks } from '../bookmarks/bookmarks'

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
      <Box>
        <span>Location Buttons</span>
      </Box>
      <Box>
        <span>Breadcrumbs</span>
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

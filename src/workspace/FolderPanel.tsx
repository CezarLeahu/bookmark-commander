import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Name',
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

const rows = [
  { id: 0, name: 'Mata', url: 'Masa' },
  { id: 1, name: 'Snow', url: 'Jon' },
  { id: 2, name: 'Lannister', url: 'Cersei' },
  { id: 3, name: 'Lannister', url: 'Jaime' },
  { id: 4, name: 'Stark', url: 'Arya' },
  { id: 5, name: 'Targaryen', url: 'Daenerys' },
  { id: 6, name: 'Melisandre', url: null },
  { id: 7, name: 'Clifford', url: 'Ferrara' },
  { id: 8, name: 'Frances', url: 'Rossini' },
  { id: 9, name: 'Roxie', url: 'Harvey' },

  { id: 10, name: 'Mata', url: 'Masa' },
  { id: 11, name: 'Snow', url: 'Jon' },
  { id: 12, name: 'Lannister', url: 'Cersei' },
  { id: 13, name: 'Lannister', url: 'Jaime' },
  { id: 14, name: 'Stark', url: 'Arya' },
  { id: 15, name: 'Targaryen', url: 'Daenerys' },
  { id: 16, name: 'Melisandre', url: null },
  { id: 17, name: 'Clifford', url: 'Ferrara' },
  { id: 18, name: 'Frances', url: 'Rossini' },
  { id: 19, name: 'Roxie', url: 'Harvey' },

  { id: 20, name: 'Mata', url: 'Masa' },
  { id: 21, name: 'Snow', url: 'Jon' },
  { id: 22, name: 'Lannister', url: 'Cersei' },
  { id: 23, name: 'Lannister', url: 'Jaime' },
  { id: 24, name: 'Stark', url: 'Arya' },
  { id: 25, name: 'Targaryen', url: 'Daenerys' },
  { id: 26, name: 'Melisandre', url: null },
  { id: 27, name: 'Clifford', url: 'Ferrara' },
  { id: 28, name: 'Frances', url: 'Rossini' },
  { id: 29, name: 'Roxie', url: 'Harvey' },

  { id: 30, name: 'Mata', url: 'Masa' },
  { id: 31, name: 'Snow', url: 'Jon' },
  { id: 32, name: 'Lannister', url: 'Cersei' },
  { id: 33, name: 'Lannister', url: 'Jaime' },
  { id: 34, name: 'Stark', url: 'Arya' },
  { id: 35, name: 'Targaryen', url: 'Daenerys' },
  { id: 36, name: 'Melisandre', url: null },
  { id: 37, name: 'Clifford', url: 'Ferrara' },
  { id: 38, name: 'Frances', url: 'Rossini' },
  { id: 39, name: 'Roxie', url: 'Harvey' },

  { id: 40, name: 'Mata', url: 'Masa' },
  { id: 41, name: 'Snow', url: 'Jon' },
  { id: 42, name: 'Lannister', url: 'Cersei' },
  { id: 43, name: 'Lannister', url: 'Jaime' },
  { id: 44, name: 'Stark', url: 'Arya' },
  { id: 45, name: 'Targaryen', url: 'Daenerys' },
  { id: 46, name: 'Melisandre', url: null },
  { id: 47, name: 'Clifford', url: 'Ferrara' },
  { id: 48, name: 'Frances', url: 'Rossini' },
  { id: 49, name: 'Roxie', url: 'Harvey' },

  { id: 60, name: 'Mata', url: 'Masa' },
  { id: 61, name: 'Snow', url: 'Jon' },
  { id: 62, name: 'Lannister', url: 'Cersei' },
  { id: 63, name: 'Lannister', url: 'Jaime' },
  { id: 64, name: 'Stark', url: 'Arya' },
  { id: 65, name: 'Targaryen', url: 'Daenerys' },
  { id: 66, name: 'Melisandre', url: null },
  { id: 67, name: 'Clifford', url: 'Ferrara' },
  { id: 68, name: 'Frances', url: 'Rossini' },
  { id: 69, name: 'Roxie', url: 'Harvey' },

  { id: 70, name: 'Mata', url: 'Masa' },
  { id: 71, name: 'Snow', url: 'Jon' },
  { id: 72, name: 'Lannister', url: 'Cersei' },
  { id: 73, name: 'Lannister', url: 'Jaime' },
  { id: 74, name: 'Stark', url: 'Arya' },
  { id: 75, name: 'Targaryen', url: 'Daenerys' },
  { id: 76, name: 'Melisandre', url: null },
  { id: 77, name: 'Clifford', url: 'Ferrara' },
  { id: 78, name: 'Frances', url: 'Rossini' },
  { id: 79, name: 'Roxie', url: 'Harvey' },

  { id: 80, name: 'Mata', url: 'Masa' },
  { id: 81, name: 'Snow', url: 'Jon' },
  { id: 82, name: 'Lannister', url: 'Cersei' },
  { id: 83, name: 'Lannister', url: 'Jaime' },
  { id: 84, name: 'Stark', url: 'Arya' },
  { id: 85, name: 'Targaryen', url: 'Daenerys' },
  { id: 86, name: 'Melisandre', url: null },
  { id: 87, name: 'Clifford', url: 'Ferrara' },
  { id: 88, name: 'Frances', url: 'Rossini' },
  { id: 89, name: 'Roxie', url: 'Harvey' },

  { id: 90, name: 'Mata', url: 'Masa' },
  { id: 91, name: 'Snow', url: 'Jon' },
  { id: 92, name: 'Lannister', url: 'Cersei' },
  { id: 93, name: 'Lannister', url: 'Jaime' },
  { id: 94, name: 'Stark', url: 'Arya' },
  { id: 95, name: 'Targaryen', url: 'Daenerys' },
  { id: 96, name: 'Melisandre', url: null },
  { id: 97, name: 'Clifford', url: 'Ferrara' },
  { id: 98, name: 'Frances', url: 'Rossini' },
  { id: 99, name: 'Roxie', url: 'Harvey' },

  { id: 100, name: 'Mata', url: 'Masa' },
  { id: 101, name: 'Snow', url: 'Jon' },
  { id: 102, name: 'Lannister', url: 'Cersei' },
  { id: 103, name: 'Lannister', url: 'Jaime' },
  { id: 104, name: 'Stark', url: 'Arya' },
  { id: 105, name: 'Targaryen', url: 'Daenerys' },
  { id: 106, name: 'Melisandre', url: null },
  { id: 107, name: 'Clifford', url: 'Ferrara' },
  { id: 108, name: 'Frances', url: 'Rossini' },
  { id: 109, name: 'Roxie', url: 'Harvey' },

  { id: 110, name: 'Mata', url: 'Masa' },
  { id: 111, name: 'Snow', url: 'Jon' },
  { id: 112, name: 'Lannister', url: 'Cersei' },
  { id: 113, name: 'Lannister', url: 'Jaime' },
  { id: 114, name: 'Stark', url: 'Arya' },
  { id: 115, name: 'Targaryen', url: 'Daenerys' },
  { id: 116, name: 'Melisandre', url: null },
  { id: 117, name: 'Clifford', url: 'Ferrara' },
  { id: 118, name: 'Frances', url: 'Rossini' },
  { id: 119, name: 'Roxie', url: 'Harvey' },

  { id: 120, name: 'Mata', url: 'Masa' },
  { id: 121, name: 'Snow', url: 'Jon' },
  { id: 122, name: 'Lannister', url: 'Cersei' },
  { id: 123, name: 'Lannister', url: 'Jaime' },
  { id: 124, name: 'Stark', url: 'Arya' },
  { id: 125, name: 'Targaryen', url: 'Daenerys' },
  { id: 126, name: 'Melisandre', url: null },
  { id: 127, name: 'Clifford', url: 'Ferrara' },
  { id: 128, name: 'Frances', url: 'Rossini' },
  { id: 129, name: 'Roxie', url: 'Harvey' },

  { id: 130, name: 'Mata', url: 'Masa' },
  { id: 131, name: 'Snow', url: 'Jon' },
  { id: 132, name: 'Lannister', url: 'Cersei' },
  { id: 133, name: 'Lannister', url: 'Jaime' },
  { id: 134, name: 'Stark', url: 'Arya' },
  { id: 135, name: 'Targaryen', url: 'Daenerys' },
  { id: 136, name: 'Melisandre', url: null },
  { id: 137, name: 'Clifford', url: 'Ferrara' },
  { id: 138, name: 'Frances', url: 'Rossini' },
  { id: 139, name: 'Roxie', url: 'Harvey' },

  { id: 140, name: 'Mata', url: 'Masa' },
  { id: 141, name: 'Snow', url: 'Jon' },
  { id: 142, name: 'Lannister', url: 'Cersei' },
  { id: 143, name: 'Lannister', url: 'Jaime' },
  { id: 144, name: 'Stark', url: 'Arya' },
  { id: 145, name: 'Targaryen', url: 'Daenerys' },
  { id: 146, name: 'Melisandre', url: null },
  { id: 147, name: 'Clifford', url: 'Ferrara' },
  { id: 148, name: 'Frances', url: 'Rossini' },
  { id: 149, name: 'Roxie', url: 'Harvey' },

  { id: 150, name: 'Mata', url: 'Masa' },
  { id: 151, name: 'Snow', url: 'Jon' },
  { id: 152, name: 'Lannister', url: 'Cersei' },
  { id: 153, name: 'Lannister', url: 'Jaime' },
  { id: 154, name: 'Stark', url: 'Arya' },
  { id: 155, name: 'Targaryen', url: 'Daenerys' },
  { id: 156, name: 'Melisandre', url: null },
  { id: 157, name: 'Clifford', url: 'Ferrara' },
  { id: 158, name: 'Frances', url: 'Rossini' },
  { id: 159, name: 'Roxie', url: 'Harvey' },

  { id: 160, name: 'Mata', url: 'Masa' },
  { id: 161, name: 'Snow', url: 'Jon' },
  { id: 162, name: 'Lannister', url: 'Cersei' },
  { id: 163, name: 'Lannister', url: 'Jaime' },
  { id: 164, name: 'Stark', url: 'Arya' },
  { id: 165, name: 'Targaryen', url: 'Daenerys' },
  { id: 166, name: 'Melisandre', url: null },
  { id: 167, name: 'Clifford', url: 'Ferrara' },
  { id: 168, name: 'Frances', url: 'Rossini' },
  { id: 169, name: 'Roxie', url: 'Harvey' },
]

const FolderPanel = (): JSX.Element => {
  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        flex: 1,
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

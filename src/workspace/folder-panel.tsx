import bookmarks = chrome.bookmarks
import { DataGrid, GridColDef, GridCellParams } from '@mui/x-data-grid'
import { children, parentPath } from '../bookmarks/queries'
import { BTN } from '../bookmarks/types'
import { useEffect, useState } from 'react'
import {
  Alert,
  Container,
  Box,
  Link,
  Typography,
  Breadcrumbs,
  ButtonGroup,
  Button,
} from '@mui/material'

const columns: GridColDef[] = [
  {
    field: 'title',
    headerName: 'Title',
    width: 250,
    editable: false,
  },
  {
    field: 'url',
    headerName: 'URL',
    flex: 1,
    editable: false,
  },
]

interface FolderPanelProps {
  readonly index: number
  onSelect: (node: BTN) => void
}

const FolderPanel = (props: FolderPanelProps): JSX.Element => {
  const [topNodes, setTopNodes] = useState<BTN[]>([])
  const [error, setError] = useState<string>()

  useEffect(() => {
    bookmarks.getChildren('0').then(
      r => setTopNodes(r),
      e => setError(e),
    )
  }, [])

  const [currentNodeID, setCurrentNodeID] = useState<string>(String(props.index))
  const [currentNode, setCurrentNode] = useState<BTN>()

  useEffect(() => {
    bookmarks.get(currentNodeID).then(
      r => setCurrentNode(r[0]),
      e => setError(e),
    )
  }, [topNodes, currentNodeID])

  const [breadcrumbs, setBreadcrumbs] = useState<BTN[]>([])

  useEffect(() => {
    parentPath(currentNode).then(
      r => setBreadcrumbs(r),
      e => setError(e),
    )
  }, [currentNode])

  const [rows, setRows] = useState<BTN[]>([])

  useEffect(() => {
    children(currentNodeID).then(
      r => setRows(r),
      e => setError(e),
    )
  }, [currentNodeID])

  const handleCellDoubleClick = (params: GridCellParams): void => {
    switch (params.row.url) {
      case undefined: // folder
        setCurrentNodeID(String(params.id))
        break
      default: // actual bookmark
        chrome.tabs.create({ url: params.row.url }).catch(e => setError(e))
    }
  }

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
        {error !== undefined ? (
          <Alert severity='error' onClose={() => setError(undefined)}>
            {error}
          </Alert>
        ) : (
          <></>
        )}
      </Box>
      <Box display='flex' justifyContent='center' alignItems='center'>
        <ButtonGroup variant='text' aria-label='Main Bookmark Locations'>
          {topNodes.map(d => (
            <Button
              key={d.id}
              sx={{ textTransform: 'none' }}
              onClick={() => setCurrentNodeID(d.id)}
            >
              {d.title}
            </Button>
          ))}
        </ButtonGroup>
      </Box>
      <Box>
        <Breadcrumbs aria-label='breadcrumb'>
          {breadcrumbs.map(d => (
            <Link key={d.id} onClick={() => setCurrentNodeID(d.id)}>
              {d.title}
            </Link>
          ))}
          <Typography color='text.primary'>{currentNode?.title}</Typography>
        </Breadcrumbs>
      </Box>

      <DataGrid
        rows={rows}
        columns={columns}
        autoPageSize
        checkboxSelection
        density='compact'
        experimentalFeatures={{ newEditingApi: true }}
        onCellClick={(params: GridCellParams): void => props.onSelect(params.row)}
        onCellDoubleClick={handleCellDoubleClick}
        sx={{
          flex: 1,
        }}
      />
    </Container>
  )
}

export default FolderPanel

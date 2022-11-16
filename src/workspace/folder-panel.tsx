import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { children, parentPath } from '../bookmarks/bookmarks'
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
    editable: true,
  },
  {
    field: 'url',
    headerName: 'URL',
    // width: 250,
    flex: 1,
    editable: false,
  },
]

interface FolderPanelProps {
  readonly index: number
}

const FolderPanel = (props: FolderPanelProps): JSX.Element => {
  const [topNodes, setTopNodes] = useState<chrome.bookmarks.BookmarkTreeNode[]>([])
  const [error, setError] = useState<string>()

  useEffect(() => {
    chrome.bookmarks.getChildren('0').then(
      r => setTopNodes(r),
      e => setError(e),
    )
  }, [])

  const [currentNodeID, setCurrentNodeID] = useState<string>(String(props.index))
  const [currentNode, setCurrentNode] = useState<chrome.bookmarks.BookmarkTreeNode>()

  useEffect(() => {
    chrome.bookmarks.get(currentNodeID).then(
      r => setCurrentNode(r[0]),
      e => setError(e),
    )
  }, [topNodes, currentNodeID])

  const [breadcrumbs, setBreadcrumbs] = useState<chrome.bookmarks.BookmarkTreeNode[]>([])

  useEffect(() => {
    parentPath(currentNode).then(
      r => setBreadcrumbs(r),
      e => setError(e),
    )
  }, [currentNode])

  const [rows, setRows] = useState<chrome.bookmarks.BookmarkTreeNode[]>([])

  useEffect(() => {
    children(currentNodeID).then(
      r => setRows(r),
      e => setError(e),
    )
  }, [currentNodeID])

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
            <Link key={d.id}>{d.title}</Link>
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

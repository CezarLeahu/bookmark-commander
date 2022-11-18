import bookmarks = chrome.bookmarks
import {
  DataGrid,
  GridColDef,
  GridCellParams,
  GridRowId,
  GridCellEditCommitParams,
  useGridApiRef,
} from '@mui/x-data-grid'
import { children, parentPath } from '../bookmarks/queries'
import { BTN } from '../bookmarks/types'
import { useEffect, useImperativeHandle, useState, forwardRef } from 'react'
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
    sortable: false,
  },
  {
    field: 'url',
    headerName: 'URL',
    flex: 1,
    editable: false,
    sortable: false,
  },
]

export interface FolderPanelProps {
  readonly index: number
  onSelect: (node: BTN) => void
}

export interface FolderPanelHandle {
  renameCell: (id: GridRowId | undefined) => void
}

const FolderPanel: React.ForwardRefRenderFunction<FolderPanelHandle, FolderPanelProps> = (
  props: FolderPanelProps,
  ref: React.ForwardedRef<FolderPanelHandle>,
) => {
  const { index, onSelect } = props
  const [topNodes, setTopNodes] = useState<BTN[]>([])
  const [error, setError] = useState<string>()

  useEffect(() => {
    bookmarks.getChildren('0').then(
      r => setTopNodes(r),
      e => setError(e),
    )
  }, [])

  const [currentNodeID, setCurrentNodeID] = useState<string>(String(index))
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

  const apiRef = useGridApiRef()

  useImperativeHandle(ref, () => ({
    renameCell: (id: GridRowId | undefined) => {
      if (id === undefined) {
        return
      }
      // TODO this check shouldn't be needed in future MUI versions (post https://github.com/mui/mui-x/pull/6773)
      if (apiRef?.current !== undefined) {
        apiRef.current.startCellEditMode({ id, field: 'title' })
      }
    },
  }))

  const handleCellEdit = (params: GridCellEditCommitParams): void => {
    console.log(params.value) // TODO call api
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
        // apiRef={apiRef} // TODO enable when https://github.com/mui/mui-x/pull/6773 gets merged & tagged
        rows={rows}
        columns={columns}
        autoPageSize
        checkboxSelection
        density='compact'
        experimentalFeatures={{ newEditingApi: true }}
        onCellClick={(params: GridCellParams): void => onSelect(params.row)}
        onCellDoubleClick={handleCellDoubleClick}
        onCellEditCommit={handleCellEdit}
        sx={{
          flex: 1,
        }}
        // rowReordering
      />
    </Container>
  )
}

export default forwardRef(FolderPanel)

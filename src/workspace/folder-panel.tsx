import {
  DataGrid,
  GridColDef,
  GridCellParams,
  GridRowId,
  GridCellEditCommitParams,
  useGridApiRef,
} from '@mui/x-data-grid'
import { children, getNode, getTopNodes, parentPath } from '../bookmarks/queries'
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
import { updateTitle } from '../bookmarks/commands'

const columns: GridColDef[] = [
  {
    field: 'title',
    headerName: 'Title',
    width: 250,
    editable: false, // change to 'true' if in-line renaming ever gets enabled
    sortable: false,
    hideable: false,
  },
  {
    field: 'url',
    headerName: 'URL',
    flex: 1,
    editable: false,
    sortable: false,
    hideable: false,
  },
]

export interface FolderPanelProps {
  readonly currentNodeId: string
  setCurrentNodeId: (id: string) => void
  onSelect: (node: BTN) => void
  selectionModel: GridRowId[]
  setSelectionModel: (model: GridRowId[]) => void
}

export interface FolderPanelHandle {
  renameCell: (id: GridRowId | undefined) => void
}

const FolderPanel: React.ForwardRefRenderFunction<FolderPanelHandle, FolderPanelProps> = (
  {
    currentNodeId,
    setCurrentNodeId,
    onSelect,
    selectionModel,
    setSelectionModel,
  }: FolderPanelProps,
  ref: React.ForwardedRef<FolderPanelHandle>,
) => {
  const [topNodes, setTopNodes] = useState<BTN[]>([])
  const [error, setError] = useState<string>()

  useEffect(() => {
    getTopNodes().then(
      r => setTopNodes(r),
      e => setError(e),
    )
  }, [])

  const [currentNode, setCurrentNode] = useState<BTN>()

  useEffect(() => {
    getNode(currentNodeId).then(
      r => setCurrentNode(r),
      e => setError(e),
    )
  }, [currentNodeId]) // todo [topNodes, currentNodeId] is topNode needed?

  const [breadcrumbs, setBreadcrumbs] = useState<BTN[]>([])

  useEffect(() => {
    parentPath(currentNode).then(
      r => setBreadcrumbs(r),
      e => setError(e),
    )
  }, [currentNode])

  const [rows, setRows] = useState<BTN[]>([])

  useEffect(() => {
    children(currentNodeId).then(
      r => setRows(r),
      e => setError(e),
    )
  }, [currentNodeId, selectionModel])

  const handleCellDoubleClick = (params: GridCellParams): void => {
    switch (params.row.url) {
      case undefined: // folder
        setCurrentNodeId(String(params.id))
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
      apiRef.current.startCellEditMode({ id, field: 'title' })
    },
  }))

  const handleCellEdit = (params: GridCellEditCommitParams): void => {
    updateTitle(String(params.id), params.value)
      .then(() => setSelectionModel([]))
      .catch(e => setError(e))
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
              onClick={() => setCurrentNodeId(d.id)}
            >
              {d.title}
            </Button>
          ))}
        </ButtonGroup>
      </Box>
      <Box>
        <Breadcrumbs aria-label='breadcrumb'>
          {breadcrumbs.map(d => (
            <Link key={d.id} onClick={() => setCurrentNodeId(d.id)}>
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
        initialState={{ columns: { columnVisibilityModel: { __check__: false } } }}
        checkboxSelection
        density='compact'
        experimentalFeatures={{ newEditingApi: true }}
        onCellClick={(params: GridCellParams): void => onSelect(params.row)}
        onCellDoubleClick={handleCellDoubleClick}
        onCellEditCommit={handleCellEdit}
        selectionModel={selectionModel}
        onSelectionModelChange={setSelectionModel}
        sx={{
          flex: 1,
        }}
        // TODO rowReordering - by title (in the dialog)
      />
    </Container>
  )
}

export default forwardRef(FolderPanel)

import { createContext, useContext } from 'react'

import { GridReadyEvent } from 'ag-grid-community'

export interface FolderPanelProps {
  readonly highlighted: boolean
  readonly highlightSide: () => void
  readonly currentNodeId: string
  readonly setCurrentNodeId: (id: string) => void
  readonly notifyGridReady: (params: GridReadyEvent) => void
  readonly selectionModel: string[]
  readonly setSelectionModel: (model: string[]) => void
  readonly rowsOutdated: object
  readonly refreshRows: () => void
}

const FolderPanelContext = createContext<FolderPanelProps>({
  highlighted: false,
  highlightSide: () => console.log('Not yet initialized'),
  currentNodeId: '0',
  setCurrentNodeId: id => console.log('Not yet initialized'),
  notifyGridReady: params => console.log('Not yet initialized'),
  selectionModel: [],
  setSelectionModel: model => console.log('Not yet initialized'),
  rowsOutdated: {},
  refreshRows: () => console.log('Not yet initialized'),
})

export const FolderPanelContextProvider = FolderPanelContext.Provider

export const useFolderPanelContext = (): FolderPanelProps =>
  useContext<FolderPanelProps>(FolderPanelContext)

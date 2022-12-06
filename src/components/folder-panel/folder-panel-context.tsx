import { createContext, useContext } from 'react'

import { BTN } from '../../services/bookmarks/types'
import { GridReadyEvent } from 'ag-grid-community'

export interface FolderPanelProps {
  readonly currentNodeId: string
  readonly setCurrentNodeId: (id: string) => void
  readonly selected: boolean
  readonly onSelect: (node?: BTN) => void
  readonly onGridReady: (params: GridReadyEvent) => void
  readonly selectionModel: string[]
  readonly setSelectionModel: (model: string[]) => void
  readonly refreshContent: object
  readonly forceUpdate: () => void
}

const FolderPanelContext = createContext<FolderPanelProps>({
  currentNodeId: '0',
  setCurrentNodeId: id => console.log('Not yet initialized'),
  selected: false,
  onSelect: node => console.log('Not yet initialized'),
  onGridReady: params => console.log('Not yet initialized'),
  selectionModel: [],
  setSelectionModel: model => console.log('Not yet initialized'),
  refreshContent: {},
  forceUpdate: () => console.log('Not yet initialized'),
})

export const FolderPanelContextProvider = FolderPanelContext.Provider

export const useFolderPanelContext = (): FolderPanelProps =>
  useContext<FolderPanelProps>(FolderPanelContext)

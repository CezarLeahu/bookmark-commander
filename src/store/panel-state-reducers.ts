import { Pair, Side } from '../services/utils/types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { BTN } from '../services/bookmarks/types'

interface PanelState {
  nodeId: string
  node: BTN | undefined
  breadcrumbs: BTN[]
  rows: BTN[]
  selectionIds: string[]
  lastHighlightId: string | undefined
}

const initialState: Pair<PanelState> = {
  left: {
    nodeId: '1',
    node: undefined,
    breadcrumbs: [],
    rows: [],
    selectionIds: [],
    lastHighlightId: undefined,
  },
  right: {
    nodeId: '2',
    node: undefined,
    breadcrumbs: [],
    rows: [],
    selectionIds: [],
    lastHighlightId: undefined,
  },
}

export const panelStateSlice = createSlice({
  name: 'currentNodeIds',
  initialState,
  reducers: {
    updateNodeId: (state, { payload }: PayloadAction<{ side: Side; id: string }>) => {
      if (state[payload.side].nodeId !== payload.id) {
        state[payload.side].lastHighlightId = undefined
      }
      state[payload.side].nodeId = payload.id
    },
    updateNode: (state, { payload }: PayloadAction<{ side: Side; node: BTN }>) => {
      state[payload.side].node = payload.node
    },
    updateBreadcrumbs: (state, { payload }: PayloadAction<{ side: Side; nodes: BTN[] }>) => {
      state[payload.side].breadcrumbs = payload.nodes
    },
    updateRows: (state, { payload }: PayloadAction<{ side: Side; nodes: BTN[] }>) => {
      state[payload.side].rows = payload.nodes
    },
    updateSelection: (state, { payload }: PayloadAction<{ side: Side; ids: string[] }>) => {
      state[payload.side].selectionIds = payload.ids
    },
    updateLastHighlight: (
      state,
      { payload }: PayloadAction<{ side: Side; id: string | undefined }>,
    ) => {
      state[payload.side].lastHighlightId = payload.id
    },
  },
})

export const {
  updateNodeId,
  updateNode,
  updateBreadcrumbs,
  updateRows,
  updateSelection,
  updateLastHighlight,
} = panelStateSlice.actions

export default panelStateSlice.reducer

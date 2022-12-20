import { Pair, Side } from '../services/utils/types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { BTN } from '../services/bookmarks/types'

interface PanelState {
  nodeId: string
  node: BTN | undefined
  breadcrumbs: BTN[]
  rows: BTN[]
  selectionIds: string[]
  highlightId: string | undefined
}

const initialState: Pair<PanelState> = {
  left: {
    nodeId: '1',
    node: undefined,
    breadcrumbs: [],
    rows: [],
    selectionIds: [],
    highlightId: undefined,
  },
  right: {
    nodeId: '2',
    node: undefined,
    breadcrumbs: [],
    rows: [],
    selectionIds: [],
    highlightId: undefined,
  },
}

export const panelStateSlice = createSlice({
  name: 'currentNodeIds',
  initialState,
  reducers: {
    updateNodeIdLeft: (state, { payload }: PayloadAction<string>) => {
      state.left.nodeId = payload
    },
    updateNodeIdRight: (state, { payload }: PayloadAction<string>) => {
      state.right.nodeId = payload
    },
    updateNodeId: (state, { payload }: PayloadAction<{ side: Side; id: string }>) => {
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
    updateHighlight: (
      state,
      { payload }: PayloadAction<{ side: Side; id: string | undefined }>,
    ) => {
      state[payload.side].highlightId = payload.id
    },
  },
})

export const {
  updateNodeIdLeft,
  updateNodeIdRight,
  updateNodeId,
  updateNode,
  updateBreadcrumbs,
  updateRows,
  updateSelection,
  updateHighlight,
} = panelStateSlice.actions

export default panelStateSlice.reducer

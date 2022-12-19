import { Pair, Side } from '../services/utils/types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { RootState } from './store'

const initialState: Pair<string> = {
  left: '1',
  right: '2',
}

export const currentNodeIdsSlice = createSlice({
  name: 'currentNodeIds',
  initialState,
  reducers: {
    updateCurrentNodeIdLeft: (state, { payload }: PayloadAction<string>) => {
      state.left = payload
    },
    updateCurrentNodeIdRight: (state, { payload }: PayloadAction<string>) => {
      state.right = payload
    },
    updateCurrentNodeId: (state, { payload }: PayloadAction<{ side: Side; id: string }>) => {
      state[payload.side] = payload.id
    },
  },
})

export const { updateCurrentNodeIdLeft, updateCurrentNodeIdRight, updateCurrentNodeId } =
  currentNodeIdsSlice.actions

export const selectCurrentNodeIds = (state: RootState): Pair<string> => state.currentNodeIds

export const selectCurrentNodeId = (state: RootState): string => state.currentNodeIds[state.side]

export default currentNodeIdsSlice.reducer

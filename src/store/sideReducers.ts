import { PayloadAction, SliceCaseReducers, createSlice } from '@reduxjs/toolkit'
import { Side, other } from '../services/utils/types'

import { RootState } from './store'

export const sideSlice = createSlice<Side, SliceCaseReducers<Side>, 'side'>({
  name: 'side',
  initialState: 'left',
  reducers: {
    focusLeft: state => (state = 'left'),
    focusRight: state => (state = 'right'),
    change: state => (state = other(state)),
    focusSide: (state, action: PayloadAction<Side>) => (state = action.payload),
  },
})

export const { focusLeft, focusRight, change, focusSide } = sideSlice.actions

export const selectSide = (state: RootState): Side => state.side

export default sideSlice.reducer

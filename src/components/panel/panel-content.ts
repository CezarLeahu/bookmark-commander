import { childrenAndParent, getNode, parentPath } from '../../services/bookmarks/queries'
import { selectAppOutdated, selectHighlighted } from '../../store/app-state-reducers'
import {
  selectNode,
  selectNodeId,
  selectPanelOutdated,
  updateBreadcrumbs,
  updateNode,
  updateRows,
} from '../../store/panel-state-reducers'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useCallback, useEffect } from 'react'

import { BTN } from '../../services/bookmarks/types'
import { ComponentStateChangedEvent } from 'ag-grid-community'
import { Side } from '../../services/utils/types'
import { TITLE_COLUMN } from './panel-metadata'
import { shallowEqual } from 'react-redux'

export function useLoadPanelContentEffect(side: Side): void {
  const dispatch = useAppDispatch()

  const appOutdated = useAppSelector(selectAppOutdated)
  const panelOutdated = useAppSelector(state => selectPanelOutdated(state, side), shallowEqual)
  const nodeId = useAppSelector(state => selectNodeId(state, side))

  const node = useAppSelector(state => selectNode(state, side), shallowEqual)

  useEffect(() => {
    getNode(nodeId).then(
      node => dispatch(updateNode({ side, node })),
      e => console.log(e),
    )
  }, [dispatch, side, nodeId])

  useEffect(() => {
    parentPath(node).then(
      nodes => dispatch(updateBreadcrumbs({ side, nodes })),
      e => console.log(e),
    )
  }, [dispatch, side, node])

  useEffect(() => {
    childrenAndParent(nodeId).then(
      ([nodes]) => dispatch(updateRows({ side, nodes })),
      e => console.log(e),
    )
  }, [dispatch, side, nodeId, appOutdated, panelOutdated])
}

export function useComponenetStateChangedHandler(
  side: Side,
): (event: ComponentStateChangedEvent<BTN>) => void {
  const highlighted = useAppSelector(state => selectHighlighted(state, side))

  return useCallback(
    (event: ComponentStateChangedEvent<BTN>) => {
      console.log('[onComponentStateChanged]')

      if (!highlighted) {
        event.api.clearFocusedCell()
        return
      }
      if (event.api.getDisplayedRowCount() !== 0) {
        return
      }

      if (event.api.getFocusedCell() !== null) {
        event.api.ensureIndexVisible(event.api.getFocusedCell()?.rowIndex ?? 0)
        return
      }

      if (!highlighted) {
        return
      }

      // TODO hopefully not  really needed - we might need to set a current focused cell as a Ref
      console.log('[onComponentStateChanged(): Focusing on the first row')
      event.api.setFocusedCell(0, TITLE_COLUMN)
      event.api.ensureIndexVisible(0)
    },
    [highlighted],
  )
}

import { childrenAndParent, getNode, parentPath } from '../../services/bookmarks/queries'
import { updateBreadcrumbs, updateNode, updateRows } from '../../store/panel-state-reducers'
import { useCallback, useEffect } from 'react'
import { useSelectAppOutdated, useSelectIsHighlighted } from '../../store/app-state-hooks'
import { useSelectNode, useSelectNodeId } from '../../store/panel-state-hooks'

import { BTN } from '../../services/bookmarks/types'
import { ComponentStateChangedEvent } from 'ag-grid-community'
import { Side } from '../../services/utils/types'
import { useAppDispatch } from '../../store/hooks'

export function useLoadPanelContentEffect(side: Side): void {
  const dispatch = useAppDispatch()

  const appOutdated = useSelectAppOutdated()
  const nodeId = useSelectNodeId(side)

  const node = useSelectNode(side)

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
  }, [dispatch, side, nodeId, appOutdated])
}

export function useComponenetStateChangedHandler(
  side: Side,
): (event: ComponentStateChangedEvent<BTN>) => void {
  const highlighted = useSelectIsHighlighted(side)

  return useCallback(
    (event: ComponentStateChangedEvent<BTN>) => {
      if (!highlighted) {
        event.api.clearFocusedCell()
        return
      }
      if (event.api.getDisplayedRowCount() !== 0) {
        return
      }

      const cell = event.api.getFocusedCell()
      if (cell !== undefined && cell !== null && cell.rowIndex >= 0) {
        event.api.ensureIndexVisible(cell.rowIndex)
      }
    },
    [highlighted],
  )
}

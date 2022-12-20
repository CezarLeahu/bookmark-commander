import { childrenAndParent, getNode, parentPath } from '../../services/bookmarks/queries'
import { updateBreadcrumbs, updateNode, updateRows } from '../../store/panel-state-reducers'
import { useCallback, useEffect } from 'react'
import { useSelectAppOutdated, useSelectIsHighlighted } from '../../store/app-state-hooks'
import { useSelectNode, useSelectNodeId } from '../../store/panel-state-hooks'

import { BTN } from '../../services/bookmarks/types'
import { ComponentStateChangedEvent } from 'ag-grid-community'
import { Side } from '../../services/utils/types'
import { TITLE_COLUMN } from './panel-metadata'
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

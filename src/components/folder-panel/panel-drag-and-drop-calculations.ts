import { RowDragLeaveEvent, RowDragMoveEvent, RowHighlightPosition } from 'ag-grid-community'

import { BTN } from '../../services/bookmarks/types'
import { isSimpleBookmark } from '../../services/bookmarks/utils'

export interface DnDMoveInfo {
  highlightedRowIndex: number
  position: RowHighlightPosition | null
}

export const moveInfo = (
  e: RowDragMoveEvent<BTN>,
  totalRowCount: number,
): DnDMoveInfo | undefined => {
  if (totalRowCount <= 0) {
    return undefined
  }
  if (e.overIndex === 0) {
    return {
      highlightedRowIndex: 0,
      position: RowHighlightPosition.Below,
    }
  }
  if (e.overIndex < 0) {
    return {
      highlightedRowIndex: totalRowCount - 1,
      position: RowHighlightPosition.Below,
    }
  }

  return {
    highlightedRowIndex: e.overIndex,
    position: rowHighlightPosition(e),
  }
}

const rowHighlightPosition = (e: RowDragMoveEvent<BTN>): RowHighlightPosition | null => {
  const rowHeight = e.overNode?.rowHeight ?? undefined
  if (rowHeight === undefined) {
    return null
  }

  const bookmarkNode = e.overNode?.data ?? undefined
  if (bookmarkNode === undefined) {
    return null
  }

  const pixelPositionInRow = e.y % rowHeight
  if (isSimpleBookmark(bookmarkNode)) {
    return pixelPositionInRow < rowHeight / 2
      ? RowHighlightPosition.Above
      : RowHighlightPosition.Below
  }

  // else, if Directory:

  if (pixelPositionInRow < rowHeight / 4) {
    return RowHighlightPosition.Above
  }
  if (pixelPositionInRow > (rowHeight / 4) * 3) {
    return RowHighlightPosition.Below
  }
  return null
}

interface DndDropInfo {
  dropIntoDir: boolean
  dropAtIndex?: number
}

export const dropInfo = (e: RowDragLeaveEvent<BTN>, totalRowCount: number): DndDropInfo => {
  if (totalRowCount <= 0) {
    throw new Error('Invalid moveInfo() call: totalRowCount <= 0')
  }
  if (e.overIndex === 0) {
    return {
      dropIntoDir: false,
      dropAtIndex: 0,
    }
  }
  if (e.overIndex < 0) {
    return {
      dropIntoDir: false,
      dropAtIndex: totalRowCount - 1,
    }
  }

  const rowHeight = e.overNode?.rowHeight ?? undefined
  if (rowHeight === undefined) {
    throw new Error('moveInfo() error: failed to get the row height')
  }

  const bookmarkNode = e.overNode?.data ?? undefined
  if (bookmarkNode === undefined) {
    throw new Error('moveInfo() error: failed to get the row BTN data')
  }

  const pixelPositionInRow = e.y % rowHeight
  if (isSimpleBookmark(bookmarkNode)) {
    return {
      dropIntoDir: false,
      dropAtIndex: pixelPositionInRow < rowHeight / 2 ? e.overIndex - 1 : e.overIndex,
    }
  }

  // else, if Directory:

  if (pixelPositionInRow < rowHeight / 4) {
    return {
      dropIntoDir: false,
      dropAtIndex: e.overIndex - 1,
    }
  }
  if (pixelPositionInRow > (rowHeight / 4) * 3) {
    return {
      dropIntoDir: false,
      dropAtIndex: e.overIndex,
    }
  }
  return {
    dropIntoDir: true,
  }
}

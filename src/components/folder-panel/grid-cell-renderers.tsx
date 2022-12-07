import { BTN } from '../../services/bookmarks/types'
import FolderIcon from '@mui/icons-material/Folder'
import { ICellRendererParams } from 'ag-grid-community'
import { getFaviconUrl } from '../../services/favicons/favicons'
import { isDirectory } from '../../services/bookmarks/utils'
import { openInNewTab } from '../../services/tabs/tabs'

export const titleCellRenderer = (params: ICellRendererParams<BTN, string>): JSX.Element => {
  return (
    <div onMouseUp={e => middleClickHandle(params.data?.url, e)}>
      {params.data !== undefined && isDirectory(params.data) ? (
        <FolderIcon sx={{ verticalAlign: 'middle', paddingRight: '8px', outerHeight: '16' }} />
      ) : (
        <img
          src={getFaviconUrl(params.data?.url ?? '')}
          height='16'
          style={{ verticalAlign: 'middle', paddingRight: '10px' }}
        />
      )}
      <span className='filename'>{params.value}</span>
    </div>
  )
}

export const urlCellRenderer = (params: ICellRendererParams<BTN, string>): JSX.Element => {
  return <span onMouseUp={e => middleClickHandle(params.value, e)}>{params.value}</span>
}

const middleClickHandle = (
  url?: string,
  event?: React.MouseEvent<HTMLSpanElement, MouseEvent>,
): void => {
  if (url !== undefined && event?.type === 'mouseup' && event.nativeEvent.which === 2) {
    openInNewTab(url)
  }
}

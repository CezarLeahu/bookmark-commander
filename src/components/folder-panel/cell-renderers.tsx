import { BTN } from '../../services/bookmarks/types'
import FolderIcon from '@mui/icons-material/Folder'
import { ICellRendererParams } from 'ag-grid-community'
import LinkIcon from '@mui/icons-material/Link'
import { isDirectory } from '../../services/utils/utils'

export const titleCellRenderer = (params: ICellRendererParams<BTN, string>): JSX.Element => {
  return (
    <div onMouseUp={e => middleClickHandle(params.data?.url, e)}>
      {params.data !== undefined && isDirectory(params.data) ? (
        <FolderIcon fontSize='small' sx={{ verticalAlign: 'middle', paddingRight: '10px' }} />
      ) : (
        <LinkIcon fontSize='small' sx={{ verticalAlign: 'middle', paddingRight: '10px' }} />
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
    chrome.tabs.create({ url }).catch(e => console.log(e))
  }
}

import { BTN } from '../../services/bookmarks/types'
import FolderIcon from '@mui/icons-material/Folder'
import { ICellRendererParams } from 'ag-grid-community'
import LinkIcon from '@mui/icons-material/Link'
import { isDirectory } from '../../services/utils/utils'

export const titleCellRenderer = (params: ICellRendererParams<BTN, string>): JSX.Element => {
  return (
    <div>
      {params.data !== undefined && isDirectory(params.data) ? (
        <FolderIcon fontSize='small' sx={{ verticalAlign: 'middle', paddingRight: '10px' }} />
      ) : (
        <LinkIcon fontSize='small' sx={{ verticalAlign: 'middle', paddingRight: '10px' }} />
      )}
      <span className='filename'>{params.value}</span>
    </div>
  )
}

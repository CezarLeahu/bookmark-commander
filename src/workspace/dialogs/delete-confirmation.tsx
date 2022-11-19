import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { BTN } from '../../bookmarks/types'
import { isDirectory } from '../../bookmarks/utils'

const dialogTitleAndMessage = (nodes: BTN[]): [string, string] => {
  if (nodes.length > 1) {
    return ['Delete entries?', `Delete ${nodes.length} items?`]
  }
  const node = nodes[0]
  if (isDirectory(node)) {
    return ['Delete folder?', `Delete the "${node.title}" folder?`]
  }
  return ['Delete bookmark?', `Delete the "${node.title}" bookmark?`]
}

interface DeleteConfirmationDialogProps {
  readonly open: boolean
  readonly nodes: BTN[]
  onConfirm: () => void
  onCancel: () => void
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  nodes,
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) => {
  const [title, message] = dialogTitleAndMessage(nodes)

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby='dialog-title'
      aria-describedby='dialog-description'
    >
      <DialogTitle id='dialog-title'>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id='dialog-description'>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm}>Yes</Button>
        <Button onClick={onCancel} autoFocus>
          No
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteConfirmationDialog

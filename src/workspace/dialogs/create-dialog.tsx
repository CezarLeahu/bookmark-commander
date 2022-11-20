import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material'
import { useState } from 'react'

interface CreateDialogProps {
  readonly open: boolean
  readonly isDirectory: boolean
  onConfirm: (title: string, url?: string) => void
  onCancel: () => void
}

const CreateDialog: React.FC<CreateDialogProps> = ({
  open,
  isDirectory,
  onConfirm,
  onCancel,
}: CreateDialogProps) => {
  console.log('CreateDialog')

  const [title, setTitle] = useState<string>('')
  const [validTitle, setValidTitle] = useState<boolean>(false)

  const [url, setUrl] = useState<string | undefined>()
  const [validUrl, setValidUrl] = useState<boolean>(isDirectory)

  const handleTitleValidation = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    setTitle(e.target.value)
    setValidTitle(!isDirectory || e.target.value.length > 0) // folders should have names
  }
  const handleUrlValidation = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    setUrl(e.target.value)
    setValidUrl(e.target.value !== undefined && e.target.value.length > 0)
  }

  return (
    <Dialog open={open} onClose={onCancel} aria-labelledby='dialog-title'>
      <DialogTitle id='dialog-title'>
        {isDirectory ? 'Create folder' : 'Create bookmark'}
      </DialogTitle>
      <DialogContent>
        <TextField
          id='name'
          autoFocus
          margin='dense'
          label='Name'
          type='text'
          fullWidth
          variant='standard'
          value={title}
          onChange={handleTitleValidation}
          required
          error={!validTitle}
        />
        {!isDirectory ? (
          <TextField
            id='url'
            margin='dense'
            label='URL'
            type='url'
            fullWidth
            variant='standard'
            value={url}
            onChange={handleUrlValidation}
            required
            error={!validUrl}
          />
        ) : (
          <></>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onConfirm(title, url)}>Ok</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateDialog

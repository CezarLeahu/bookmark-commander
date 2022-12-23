import * as keys from '../../services/utils/keys'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react'

import { useKeyDownCallback } from './dialog-keys'

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

  const ref = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState<string>('')
  const [validTitle, setValidTitle] = useState<boolean>(false)

  const [url, setUrl] = useState<string>('')
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

  const handleConfirm = useCallback((): void => {
    if (validTitle && validUrl) {
      onConfirm(title, isDirectory ? undefined : url)
    }
  }, [onConfirm, isDirectory, title, url, validTitle, validUrl])

  const handleKeyUp = useCallback(
    (e: KeyboardEvent): void => {
      if (e.key !== keys.ENTER) {
        return
      }
      e.stopPropagation()

      handleConfirm()
    },
    [handleConfirm],
  )
  const handleKeyDown = useKeyDownCallback()

  useEffect(() => {
    ref.current?.focus()

    const timeout = setTimeout(() => {
      ref.current?.focus()
    }, 100)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby='dialog-title'
      onKeyUpCapture={handleKeyUp}
      onKeyDownCapture={handleKeyDown}
    >
      <DialogTitle id='dialog-title'>
        {isDirectory ? 'Create folder' : 'Create bookmark'}
      </DialogTitle>
      <DialogContent>
        <TextField
          id='name'
          autoFocus
          inputRef={ref}
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
        <Button disabled={!validTitle || !validUrl} onClick={handleConfirm}>
          Ok
        </Button>
        <Button onClick={onCancel}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateDialog

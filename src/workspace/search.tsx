import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  Input,
  ClickAwayListener,
  SxProps,
  Popover,
  Typography,
  Popper,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import React, { ChangeEvent, FocusEvent, FocusEventHandler, useRef, useState } from 'react'
import { BTN } from '../bookmarks/types'

// todo remove this
const styles: SxProps = {
  position: 'absolute',
  top: 28,
  right: 0,
  left: 0,
  zIndex: 1,
  border: '1px solid',
  p: 1,
  bgcolor: 'background.paper',
}

export interface SearchProps {
  onJumpTo: (node: BTN) => void
}

const Search: React.FC<SearchProps> = ({ onJumpTo }: SearchProps) => {
  const [open, setOpen] = useState(false)
  const inputEl = useRef(null)

  const sid = open ? 'search-popper' : undefined

  const [searchValue, setSearchValue] = useState<string>('')

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    console.log('Searched for something...')
    setSearchValue(event.target.value)
    // event.target.focus()
    // todo actually call bookmark search api
    setOpen(true)
  }
  const handleFocus = (event: FocusEvent<HTMLInputElement>): void => {
    console.log('Focus on search...')
    setOpen(true)
  }

  const handleClose = (): void => {
    setOpen(false)
  }

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box sx={{ position: 'relative' }}>
        <FormControl sx={{ m: 1, width: '50ch' }} variant='standard' aria-describedby=''>
          <InputLabel htmlFor='search-bookkmarks'>Search bookmarks</InputLabel>
          <Input
            aria-describedby={sid}
            type='text'
            ref={inputEl}
            onChange={handleChange}
            onFocus={handleFocus}
            value={searchValue}
            startAdornment={
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            }
          />
        </FormControl>
        <Popper
          id={sid}
          open={open}
          anchorEl={inputEl.current}
          // onClose={handlePopupClose}
          // anchorOrigin={{
          // vertical: 'bottom',
          // horizontal: 'left',
          // }}
        >
          <Typography sx={{ p: 2 }}>More content to be added to the Popup</Typography>
        </Popper>
      </Box>
    </ClickAwayListener>
  )
}

export default Search

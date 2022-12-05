import {
  Box,
  ClickAwayListener,
  FormControl,
  Grid,
  Input,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Popper,
} from '@mui/material'
import React, { ChangeEvent, FocusEvent, useRef, useState } from 'react'
import { getFaviconUrl, isDirectory } from '../../services/utils/utils'

import { BTN } from '../../services/bookmarks/types'
import FolderIcon from '@mui/icons-material/Folder'
import SearchIcon from '@mui/icons-material/Search'
import { search } from '../../services/bookmarks/commands'

export interface SearchProps {
  onJumpTo: (node: BTN) => void
}

const Search: React.FC<SearchProps> = ({ onJumpTo }: SearchProps) => {
  const [open, setOpen] = useState(false)
  const inputEl = useRef(null)

  const sid = open ? 'search-popper' : undefined

  const [searchValue, setSearchValue] = useState<string>('')
  const [searchResults, setSearchResults] = useState<BTN[]>([])

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    console.log('Searched for something...')
    setSearchValue(event.target.value)
    handleSearch(event.target.value)
  }
  const handleFocus = (event: FocusEvent<HTMLInputElement>): void => {
    console.log('Focus on search...')
    handleSearch(event.target.value)
  }

  const handleSearch = (val: string): void => {
    if (val.length < 3) {
      setOpen(false)
      return
    }
    search(val)
      .then(res => {
        setSearchResults(res)
        setOpen(res.length > 0)
      })
      .catch(e => console.log(e))
  }

  const handleClose = (): void => {
    setOpen(false)
    setSearchResults([])
  }

  const handleJumpTo = (node: BTN): void => {
    setOpen(false)
    setSearchResults([])
    onJumpTo(node)
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
          placement='bottom-start'
          sx={{
            position: 'absolute',
            top: 28,
            right: 0,
            left: 0,
            zIndex: 1,
            border: '1px solid',
            p: 1,
            bgcolor: 'background.paper',
            width: '100%',
          }}
          anchorEl={inputEl.current}
          disablePortal={true}
          modifiers={[
            {
              name: 'preventOverflow',
              enabled: true,
              options: {
                altAxis: true,
                altBoundary: true,
                tether: true,
                rootBoundary: 'viewport',
                padding: 8,
              },
            },
          ]}
        >
          <Box minWidth='sm' width='sm' maxWidth='sm' maxHeight='sm'>
            <Grid item xs={12} md={6}>
              <List
                sx={{
                  width: '100%',
                  maxWidth: '50ch',
                  bgcolor: 'background.paper',
                  position: 'relative',
                  overflow: 'auto',
                  maxHeight: 800,
                  '& ul': { padding: 0 },
                }}
              >
                {searchResults.map(node => (
                  <ListItem key={node.id} onClick={() => handleJumpTo(node)}>
                    <ListItemIcon sx={{ minWidth: '30px' }}>
                      {isDirectory(node) ? (
                        <FolderIcon
                          fontSize='small'
                          sx={{ verticalAlign: 'middle', outerHeight: '16' }}
                        />
                      ) : (
                        <img
                          src={getFaviconUrl(node.url ?? '')}
                          height='16'
                          style={{ verticalAlign: 'middle', paddingLeft: '2px' }}
                        />
                      )}
                    </ListItemIcon>
                    <ListItemText primary={node.title} secondary={node.url ?? null} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Box>
        </Popper>
      </Box>
    </ClickAwayListener>
  )
}

export default Search

import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import Input from '@mui/material/Input'
import SearchIcon from '@mui/icons-material/Search'
import React from 'react'

const handleChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
  console.log('Searched for something...')
}

const Search: React.FC = () => {
  return (
    <FormControl sx={{ m: 1, width: '50ch' }} variant='standard'>
      <InputLabel htmlFor='search-bookkmarks'>Search bookmarks</InputLabel>
      <Input
        id='search-bookkmarks'
        type='text'
        onChange={handleChange()}
        endAdornment={
          <InputAdornment position='end'>
            <SearchIcon />
          </InputAdornment>
        }
      />
    </FormControl>
  )
}

export default Search

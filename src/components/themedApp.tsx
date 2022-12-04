import { ThemeProvider, createTheme } from '@mui/material/styles'
import { createContext, useMemo, useState } from 'react'

import App from './app/app'
import CssBaseline from '@mui/material/CssBaseline'

const ColorModeContext = createContext<{
  toggleColorMode: () => void
}>({
  toggleColorMode: () => {
    console.log('Not yet initialized')
  },
})

const ThemedApp: React.FC = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('dark')

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'))
      },
    }),
    [],
  )

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  )

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App colorModeContext={ColorModeContext} />
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default ThemedApp

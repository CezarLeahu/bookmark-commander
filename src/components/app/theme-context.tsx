import React, { ReactNode, createContext, useContext, useMemo, useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'

import CssBaseline from '@mui/material/CssBaseline'

export interface ThemeContextProps {
  toggleColorMode: () => void
}

const ThemeContext = createContext<ThemeContextProps>({
  toggleColorMode: (): void => console.log('Not yet initialized'),
})

export const ThemeContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}: {
  children: ReactNode
}) => {
  const [mode, setMode] = useState<'light' | 'dark'>('dark')

  const themeContextMemo: ThemeContextProps = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'))
      },
    }),
    [],
  )

  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode])

  return (
    <ThemeContext.Provider value={themeContextMemo}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useThemeContext = (): ThemeContextProps => useContext<ThemeContextProps>(ThemeContext)

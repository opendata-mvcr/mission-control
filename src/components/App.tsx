import React, { Suspense } from 'react'
import { RouterProvider } from 'react-router5'
import { useObservableSuspense } from 'observable-hooks'
import { CssBaseline, ThemeProvider } from '@material-ui/core'

import theme from 'app/theme'
import router from 'app/router'

import { I18nProvider, Namespace } from 'components/i18n'
import Snackbar from 'components/Snackbar'
import RouteComponentRenderer from './RouteComponentRenderer'
import { suspendResource } from 'data/suspend'

const SuspendHelper: React.FC = () => {
  useObservableSuspense(suspendResource)
  return null
}

const App: React.FC = () => (
  <RouterProvider router={router}>
    <I18nProvider>
      <Namespace.Provider value="common">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Suspense fallback={'...'}>
            <SuspendHelper />
            <RouteComponentRenderer />
          </Suspense>
          <Snackbar />
        </ThemeProvider>
      </Namespace.Provider>
    </I18nProvider>
  </RouterProvider>
)

export default App

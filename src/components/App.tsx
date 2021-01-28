import React, { Suspense } from 'react'
import { useObservableSuspense } from 'observable-hooks'
import { CssBaseline, ThemeProvider } from '@material-ui/core'

import theme from 'app/theme'

import { I18nProvider, Namespace } from 'components/i18n'
import Snackbar from 'components/Snackbar'
import RouteComponentRenderer from './RouteComponentRenderer'
import { suspendResource } from 'data/suspend'
import { ErrorBoundary } from 'react-error-boundary'
import { Error500 } from './Errors'
import Router from './Router'

const SuspendHelper: React.FC = () => {
  useObservableSuspense(suspendResource)
  return null
}

const App: React.FC = () => (
  <Router>
    <I18nProvider>
      <Namespace.Provider value="common">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ErrorBoundary FallbackComponent={Error500}>
            <Suspense fallback={'...'}>
              <SuspendHelper />
              <RouteComponentRenderer />
            </Suspense>
            <Snackbar />
          </ErrorBoundary>
        </ThemeProvider>
      </Namespace.Provider>
    </I18nProvider>
  </Router>
)

export default App
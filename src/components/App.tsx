import React, { Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import { useObservableSuspense } from "observable-hooks";
import { CssBaseline, ThemeProvider } from "@material-ui/core";

import theme from "app/theme";

import { I18nProvider, Namespace } from "components/i18n";
import Snackbar from "components/Snackbar";
import RouteComponentRenderer from "./RouteComponentRenderer";
import { suspendResource } from "data/suspend";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./Errors";
import Router from "./Router";
import Title from "./Title";

/**
 * This component prevents React immediate render if the suspend resource is true
 * The suspend value is to be set / unset while doing AJAX calls
 */
const Suspender: React.FC = () => {
  useObservableSuspense(suspendResource);
  return null;
};

const App: React.FC = () => (
  <HelmetProvider>
    <Router>
      <I18nProvider>
        <Namespace.Provider value="common">
          <Title />
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={null}>
                <Suspender />
              </Suspense>
              <Suspense fallback={null}>
                <RouteComponentRenderer />
              </Suspense>
              <Snackbar />
            </ErrorBoundary>
          </ThemeProvider>
        </Namespace.Provider>
      </I18nProvider>
    </Router>
  </HelmetProvider>
);

export default App;

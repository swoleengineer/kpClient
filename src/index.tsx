import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App, HotApp } from './app';
import { store, rootReducer } from './store';
import * as Sentry from '@sentry/browser';
// Sentry.init({
//   dsn: 'https://61a6a7658c77406eacab944b5baf2ef1@sentry.io/1468876',
//   integrations: [
//     new Sentry.Integrations.Breadcrumbs({
//       console: false
//     })
//   ]
// });

const renderRoot = (app: JSX.Element) => {
  ReactDOM.render(app, document.getElementById('root'))
}

if(process.env.NODE_ENV === 'production'){
  renderRoot(<App store={store} />)
} else {
  renderRoot(<HotApp store={store} />)

  if (module.hot) {
    // tslint:disable-next-line:space-before-function-paren
    module.hot.accept('./app', async () => {
      const NextApp = (await System.import('./app')).HotApp
      renderRoot(
        <NextApp store={store} />
      )
    })

    module.hot.accept('./store', () => {
      store.replaceReducer(rootReducer)
    })
  }
}

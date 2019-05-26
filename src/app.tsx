import * as React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { IStore } from './state-management/models';
import 'app.css';
import { hot } from 'react-hot-loader'
import Switcher from './containers/switcher';
import 'antd/dist/antd.css';

type Props = { store: Store<IStore> };

export class App extends React.Component<Props, {}> {
  render() {
    return (
      <Provider store={this.props.store}>
        <Switcher />
      </Provider>
    );
  }
}

export const HotApp = hot(module)(App)

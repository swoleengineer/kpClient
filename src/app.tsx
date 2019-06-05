import * as React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { IStore } from './state-management/models';
import 'app.css';
import { hot } from 'react-hot-loader'
import Switcher from './containers/switcher';
import 'antd/dist/antd.css';
import { getAllBooks, getAllTopics, getAllQuestions } from './config';
import { bookActionTypes, topicActionTypes, questionActionTypes } from './state-management/actions'

type Props = { store: Store<IStore> };

export class App extends React.Component<Props, {}> {
  componentDidMount() {
    const handleErr = () => console.log('error occured getting data')
    getAllBooks().then(
      (res: any) => {
        this.props.store.dispatch({
          type: bookActionTypes.updateAllBooks,
          payload: res.data.data
        })
      }
    ).catch(handleErr);
    getAllTopics().then(
      (res: any) => {
        this.props.store.dispatch({
          type: topicActionTypes.updateAll,
          payload: res.data.data
        })
      }
    ).catch(handleErr);
    getAllQuestions().then(
      (res: any) => {
        this.props.store.dispatch({
          type: questionActionTypes.updateQuestions,
          payload: res.data.data
        })
      }
    ).catch(handleErr);
  }
  render() {
    return (
      <Provider store={this.props.store}>
        <Switcher />
      </Provider>
    );
  }
}

export const HotApp = hot(module)(App)

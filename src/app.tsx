import * as React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { IStore, acceptableTypes } from './state-management/models';
import 'app.css';
import { hot } from 'react-hot-loader'
import Switcher from './containers/switcher';
import 'antd/dist/antd.css';
import { getAllBooks, getAllTopics, getAllQuestions, postSearchManyForManyComments  } from './config';
import { bookActionTypes, topicActionTypes, questionActionTypes } from './state-management/actions'
import { autoLogin } from './state-management/thunks'
import { expandQuestion } from './state-management/utils';


type Props = { store: Store<IStore> };

export class App extends React.Component<Props, {}> {
  componentDidMount() {
    const handleErr = () => console.log('error occured getting data');
    autoLogin();
    getAllBooks().then(
      (res: any) => {
        this.props.store.dispatch({
          type: bookActionTypes.updateAllBooks,
          payload: res.data.data.map(book => ({
            ...book,
            comments: []
          }))
        })
        return res.data.data.map(book => ({
          parentType: acceptableTypes.book,
          parentId: book._id
        }))
      },
      handleErr
    ).then(
      (bookIds: any) => postSearchManyForManyComments({ allRequests: bookIds }).then(
        (res: any) => {
          this.props.store.dispatch({
            type: bookActionTypes.addComments,
            payload: res.data
          });
        },
        handleErr
      ),
      handleErr
    )
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
          payload: res.data.data.map(expandQuestion)
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

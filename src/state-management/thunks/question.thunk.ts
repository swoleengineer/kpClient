import { store } from '../../store';
import { IQuestionRequest, ITopic, IStore, acceptableTypes } from '../models';
import { postCreateQuestion, postQuestionAddTopic, putQuestionToggleAgree,
  postQueryQuestionByTopicAndSort, postSearchManyForManyComments, postQuestionSearch
} from '../../config';
import { questionActionTypes as types } from '../actions';
import { Toaster } from '@blueprintjs/core';
import { redirect } from 'redux-first-router'
import { expandQuestion, questionSorts } from '../utils';

const AppToaster = Toaster.create({
  className: 'keenpagesToaster',
})


export const createQuestion = (params: IQuestionRequest, goToNext: boolean = false, redirectPayload: {
  type: string;
  payload?: any
} = { type: 'HOME' }) => postCreateQuestion(params).then(
  (res: any) => {
    const { data = undefined } = res;
    if (!data) {
      AppToaster.show({
        message: 'Something went wrong with this request.',
        icon: 'error'
      });
      return;
    }
    const payload = expandQuestion(data);
    store.dispatch({ type: types.updateSingleQuestion, payload });
    AppToaster.show({
      message: 'Question added.',
      icon: 'tick',
      onDismiss: () => goToNext ? store.dispatch(redirect(redirectPayload)) : null
    });
    return payload;
  },
  (err: any) => {
    let message;
    try {
      message = err.response.data.message
    } catch {
      message = 'Could not create this question. Please try again later'
    }
    AppToaster.show({ message,  icon: 'error' });
    return Promise.reject(err);
  }
);


export const addTopicsToQuestion = (id: string, topics: ITopic[]) => postQuestionAddTopic(id, { topics }).then(
  (res: any) => {
    if (!res || !res.data) {
      throw { response: { data: {
        message: 'Error updating topics for this request',
        status: 400,
        data: false
      }}};
      return;
    }
    store.dispatch({
      type: types.updateSelected,
      payload: res.data
    });
  },
  (err: any) => {
    let message;
    try {
      message = err.response.data.message
    } catch {
      message = 'Could not update topics for this request.'
    }
    AppToaster.show({
      message,
      icon: 'error'
    });
    return Promise.reject(err);
  }
)

export const toggleTopicAgreeQuestion = (id: string, topicId: string) => putQuestionToggleAgree(id, topicId).then(
  (res: any) => {
    if (!res || !res.data) {
      throw { response: { data: {
        message: 'Error updating topics for this question',
        status: 400,
        data: false
      }}};
    }
    store.dispatch({
      type: types.updateSelected,
      payload: res.data
    });
  },
  (err: any) => {
    let message;
    try {
      const { message: mesaj =  '' } = { ...err.response.data, ...(err.response.data.data || {}) }
      message = mesaj
    } catch {
      message = 'Could not update topic status'
    }
    AppToaster.show({
      message,
      icon: 'error'
    });
    return Promise.reject(err);
  }
);

export const queryMoreQuestions = (sort: { [key: string]: any } = questionSorts[0].sort, topics: string[] = [], already: string[] = []) => {
  const { book: {  books }} = store.getState() as IStore;
  return postQueryQuestionByTopicAndSort(sort, topics, already && already.length ? already : books.map(book => book.gId) || []).then(
    (res: any) => {
      store.dispatch({
        type: types.gotMoreQuestions,
        payload: res.data.data.map(book => ({
          ...book,
          comments: []
        }))
      })
      return res.data.data.map(question => ({
        parentType: acceptableTypes.question,
        parentId: question._id
      }))
    },
    (err: any) => {
      let message;
      try {
        message = err.response.data.message
      } catch {
        message = 'Could not get the books you requested.'
      }
      AppToaster.show({
        message,
        icon: 'error'
      });
      return Promise.reject(err);
    }
  ).then(
    (questionIds: any) => {
      if (!questionIds.length) {
        return;
      }
      return postSearchManyForManyComments({ allRequests: questionIds }).then(
        (res: any) => store.dispatch({
            type: types.addComments,
            payload: res.data
          }),
      (err: any) => {
        let message;
        try {
          message = err.response.data.message
        } catch {
          message = 'Could not get suggestions for your questions.'
        }
        AppToaster.show({
          message,
          icon: 'error'
        });
        return Promise.reject(err);
      })
    },
    err => {
      let message;
      try {
        message = err.response.data.message
      } catch {
        message = 'Could not get the questions you requested.'
      }
      AppToaster.show({
        message,
        icon: 'error'
      });
      return Promise.reject(err);
    }
  )
}

export const searchQuestions = (text) => {
  const { question: {  questions =  []}} = store.getState() as IStore;
  const questionIds = questions.map(question => question._id);
  return postQuestionSearch(text, questionIds).then(
    (res: any) => {
      store.dispatch({
        type: types.gotMoreQuestions,
        payload: res.data.data.map(book => ({
          ...book,
          comments: []
        }))
      });
      return res.data.data.map(question => ({
        parentType: acceptableTypes.question,
        parentId: question._id
      }));
    },
    (err: any) => {
      let message;
      try {
        message = err.response.data.message
      } catch {
        message = 'Could not get the requests you requested.'
      }
      AppToaster.show({
        message,
        icon: 'error'
      });
      return Promise.reject(err);
    }
  ).then(
    (qIds: any) => {
      if (!qIds.length) {
        return;
      }
      return postSearchManyForManyComments({ allRequests: qIds }).then(
        (res: any) => store.dispatch({
            type: types.addComments,
            payload: res.data
          }),
      (err: any) => {
        let message;
        try {
          message = err.response.data.message
        } catch {
          message = 'Could not get suggestions for your questions.'
        }
        AppToaster.show({
          message,
          icon: 'error'
        });
        return Promise.reject(err);
      })
    },
    err => {
      let message;
      try {
        message = err.response.data.message
      } catch {
        message = 'Could not get the questions you requested.'
      }
      AppToaster.show({
        message,
        icon: 'error'
      });
      return Promise.reject(err);
    }
  )
}

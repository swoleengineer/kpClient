import { IQuestionState } from '../models';
import { questionActionTypes as types } from '../actions';
import { initialQuestionState, sortQuestionByDate } from '../utils';

export const questionReducer = (state: IQuestionState = initialQuestionState, action: {
  type: string;
  payload?: any;
}): IQuestionState => {
  switch(action.type) {
    case types.updateQuestions:
      return {
        ...state,
        questions: action.payload.sort(sortQuestionByDate)
      };
    case types.updateSingleQuestion:
      return {
        ...state,
        questions: state.questions
          .filter(question => question._id !== action.payload._id)
          .concat(action.payload)
          .sort(sortQuestionByDate)
      };
    case types.gotMoreQuestions:
      return {
        ...state,
        questions: state.questions.concat(...action.payload.map(question => ({
          ...question,
          comments: [],
          reports: []
            }))).sort(sortQuestionByDate)
        };
    case types.updateNewQuestion:
      return {
        ...state,
        newQuestion: {
          ...state.newQuestion,
          ...action.payload
        }
      };
    case types.updateNewQuestionTopics:
      return {
        ...state,
        newQuestion: {
          ...state.newQuestion,
          topics: action.payload.type === 'remove'
            ? state.newQuestion.topics.filter(topic => topic.name !== action.payload.topic.name)
            : state.newQuestion.topics.filter(topic => topic.name !== action.payload.topic.name).concat(action.payload.topic)
        }
      }
    case types.clearNewQuestion:
      return {
        ...state,
        newQuestion: initialQuestionState.newQuestion
      };
    case types.updateSelected:
      return {
        ...state,
        selectedQuestion: {
          ...state.selectedQuestion,
          ...action.payload
        }
      };
    case types.setSelected:
      return {
        ...state,
        selectedQuestion: action.payload
      }
    case types.addComments:
      return {
        ...state,
        questions: state.questions.map(question => ({
          ...question,
          comments: action.payload[question._id]
        }))
      };
    case types.updateComment:
      console.log('Adding comment to question', action.payload);
      return {
        ...state,
        selectedQuestion: state.selectedQuestion && Object.keys(state.selectedQuestion).length && state.selectedQuestion._id === action.payload.data.parentId
          ? {
            ...state.selectedQuestion,
            comments: action.payload.type === 'add'
              ? state.selectedQuestion.comments.concat(action.payload.data)
              : state.selectedQuestion.comments.filter(comment => comment._id !== action.payload.data._id)
          }
          : state.selectedQuestion
      };
    default:
      return state;
  }
}

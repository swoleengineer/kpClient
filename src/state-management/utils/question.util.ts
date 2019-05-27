import { IQuestionState, IQuestion } from '../models';

export const initialQuestionState: IQuestionState = {
  questions: [],
  newQuestion: {
    topics: [],
    title: '',
    text: ''
  },
  selectedQuestion: {}
};

export const sortQuestionByDate = (a: IQuestion, b: IQuestion) => a.created > b.created
  ? -1
  : a.created < b.created
    ? 1
    : 0;

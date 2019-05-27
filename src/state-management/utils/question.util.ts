import { IQuestionState } from '../models';

export const initialQuestionState: IQuestionState = {
  questions: [],
  newQuestion: {
    topics: [],
    title: '',
    text: ''
  },
  selectedQuestion: {}
};

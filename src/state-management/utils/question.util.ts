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

export const expandQuestion = question => ({
  ...question,
  comments: question.comments && Array.isArray(question.comments) && question.comments.length ? question.comments : [],  
})

export const questionFilter = query => (question: IQuestion) => {
  const {  title = '', text = ''} = question;
  const normalizedTitleArr = title.toLowerCase().split(' ').join('');
  const normalizedTextArr = text.toLowerCase().split(' ').join('');
  const normalizedQueryArr = query.toLowerCase().split(' ');
  console.log(normalizedQueryArr, normalizedTextArr, normalizedTitleArr)
  return !query || !query.length
    ? true
    : normalizedQueryArr.every(word => `${normalizedTitleArr}${normalizedTextArr}`.includes(word));
}

export const questionSorts = [{
  sort: { 'topicsLength': 1 },
  selected: true,
  sortName: 'Highest topics',
  sortFn: (a, b) => a.topics.length < b.topics.length ? 1 : a.topics.length > b.topics.length ? -1 : 0
}, {
  sort: { 'topicsLength': -1 },
  selected: false,
  sortName: 'Lowest topics',
  sortFn: (a, b) => a.topics.length < b.topics.length ? -1 : a.topics.length > b.topics.length ? -1 : 0
}];

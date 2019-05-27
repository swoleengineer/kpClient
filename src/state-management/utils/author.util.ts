import { IAuthorState, IAuthor } from '../models/';

export const initialAuthorState: IAuthorState = {
  selectedAuthor: {},
  authors: [],
  newAuthor: {
    name: '',
    website: ''
  }
};

export const sortByAuthorName = (a: IAuthor, b: IAuthor) => a.name < b.name
  ? -1
  : a.name > b.name
    ? 1
    : 0;

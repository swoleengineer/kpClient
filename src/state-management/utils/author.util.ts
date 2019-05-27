import { IAuthorState } from '../models/';

export const initialAuthorState: IAuthorState = {
  selectedAuthor: {},
  authors: [],
  newAuthor: {
    name: '',
    website: ''
  }
};

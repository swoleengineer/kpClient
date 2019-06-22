import { IExpandedBook, ITopic } from './'

export enum HomeSearchCategories {
  book = 'book',
  topic = 'topic'
}

export interface IAppState {
  home: {
    searchText: string;
    selectedSearchCategory: HomeSearchCategories;
    bookResults: IExpandedBook[];
    topicResults: ITopic[];
  }
}

import { IExpandedBook, ITopic } from './'

export enum HomeSearchCategories {
  book = 'book',
  topic = 'topic'
}

export enum ProfileNavOptions {
  stats = 'stats',
  lists =  'shelves',
  account = 'account'
}
export interface IAppState {
  home: {
    searchText: string;
    selectedSearchCategory: HomeSearchCategories;
    bookResults: IExpandedBook[];
    topicResults: ITopic[];
  }
  profile: {
    topLevel: ProfileNavOptions;
    lowerLevel: {
      [ProfileNavOptions.stats]: 'inProgress' | 'completed' | 'all';
      [ProfileNavOptions.lists]: 'likedBooks' | 'readBooks';
      [ProfileNavOptions.account]: 'account' | 'notifications'
    }
  },
  viewPort: 'mobile' | 'tablet' | 'pc'
}

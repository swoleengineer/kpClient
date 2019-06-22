import { IAppState, HomeSearchCategories } from '../models';

export const appInitialState: IAppState = {
  home: {
    searchText: '',
    selectedSearchCategory: HomeSearchCategories.book
  }
}

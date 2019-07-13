import { IAppState, HomeSearchCategories } from '../models';

const windowSize = window.innerWidth;
const viewPort: IAppState['viewPort'] = windowSize < 380
  ? 'mobile'
  : windowSize > 380 && windowSize < 800
    ? 'tablet'
    : 'pc';
    
export const appInitialState: IAppState = {
  home: {
    searchText: '',
    selectedSearchCategory: HomeSearchCategories.book,
    bookResults: [],
    topicResults: []
  },
  viewPort
}

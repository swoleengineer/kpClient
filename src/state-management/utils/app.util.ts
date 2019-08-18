import { IAppState, HomeSearchCategories, ProfileNavOptions } from '../models';

export const getViewPort = (): IAppState['viewPort'] => {
  const windowSize = window.innerWidth;
  const viewPort: IAppState['viewPort'] = windowSize < 415
    ? 'mobile'
    : windowSize > 415 && windowSize < 800
      ? 'tablet'
      : 'pc';
  return viewPort;
}
export const appInitialState: IAppState = {
  home: {
    searchText: '',
    selectedSearchCategory: HomeSearchCategories.book,
    bookResults: [],
    topicResults: []
  },
  profile: {
    topLevel: ProfileNavOptions.stats,
    lowerLevel: {
      [ProfileNavOptions.stats]: 'inProgress',
      [ProfileNavOptions.lists]: 'likedBooks',
      [ProfileNavOptions.account]: 'profile'
    }
  },
  viewPort: getViewPort()
}

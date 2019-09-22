import { IUserState, AuthModalTypes } from '../models';

// export const initial

export const initialUserState: IUserState = {
  jwt: '156156156',
  user: null,
  loggedIn: false,
  showAuthModal: false,
  authModalActivePage: AuthModalTypes.login,
  userStats: null,
  topicForStat: null,
  followedShelves: [],
  selectedShelf: null,
  selectedShelfComments: [],
  authModalData: null
};

export const updateFollowedShelves = (type, data) => array => ({
    add: array.concat(data),
    remove: array.filter(shelf => shelf.id !== data.id),
    replace: array.map(shelf => shelf.id === data.id ? { ...data } : shelf)
  }[type]);

import { IUserState, AuthModalTypes } from '../models';

export const initialUserState: IUserState = {
  jwt: '156156156',
  user: null,
  loggedIn: false,
  showAuthModal: false,
  authModalActivePage: AuthModalTypes.login,
  userStats: null,
  topicForStat: null
};

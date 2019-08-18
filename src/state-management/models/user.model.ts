import { IBook, ITopic } from './';
export interface IUserProfile {
  first_name: string;
  last_name: string;
  picture: {
    public_id: string;
    link: string;
  }
}

export interface INewUserRequest {
  profile: IUserProfile;
  email: string;
  username: string;
  password: string;
}

export interface IUserLoginRequest {
  account: string;
  password: string;
}

export enum IUserNotificationSettings {
  new_book          = 'notification_new_book',
  new_question      = 'notification_new_question',
  book_comment      = 'notification_book_comment',
  question_comment  = 'notification_question_comment'
}

export interface IUser extends INewUserRequest {
  _id: string;
  role: 'user' | 'admin';
  notification_new_book: boolean;
  notification_new_question: boolean;
  notification_book_comment: boolean;
  notification_question_comment: boolean;
  notification_book_suggested: boolean;
  notification_topic_added: boolean;
  notification_suggestion_accepted: boolean;
  created: Date;
  username: string;
  savedBooks: Array<IBook>;
  readBooks: Array<IBook>;
}


export enum AuthModalTypes {
  login = 'auth/login',
  register = 'auth/register',
  forgot = 'auth/forgotPw/forgot',
  question = 'auth/question',
  topicToStat = 'auth/stats/addTopic'
}


export interface IStatBookEntry {
  book: IBook;
  topicWeight: number
}

export interface IStatSnapshot {
  books: Array<IStatBookEntry>;
  created: Date;
  status: number;
}

export interface IStatFigure {
  _id: string;
  topic: ITopic;
  description?: string;
  goal: number;
  dueDate?: Date;
  currentStatus: number;
  created: Date;
  snapShots: Array<IStatSnapshot>;
  completed: boolean;
  updated: Date
}

export interface IStat {
  _id: string;
  owner: string;
  figures: Array<IStatFigure>;
  updated: Date;
}
export interface IUserState {
  jwt: string;
  user:  IUser;
  loggedIn: boolean;
  showAuthModal: boolean;
  authModalActivePage: AuthModalTypes;
  userStats: IStat | null;
  topicForStat: ITopic | null;
}

export interface IAddTopicToStatRequest {
  statId: string;
  topic: any;
  description?: string;
  goal?: number;
  dueDate?: Date;
}

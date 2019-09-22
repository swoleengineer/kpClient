import { IBook, ITopic, IComment } from './';
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
  myShelves: Array<IShelfDetail>;
  listPublicStatus: {
    readBooks: boolean;
    savedBooks: boolean;
  }
}


export enum AuthModalTypes {
  login = 'auth/login',
  register = 'auth/register',
  forgot = 'auth/forgotPw/forgot',
  question = 'auth/question',
  topicToStat = 'auth/stats/addTopic',
  newShelf = 'auth/shelves/newShelf',
  bookToShelf = 'auth/shelves/addBook',
  searchBooks = 'auth/searchBooks'
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

export enum ShelfEditType {
  addBook = 'addBook',
  rmBook = 'rmBook',
  makePublic = 'makePublic',
  makePrivate = 'makePrivate',
  editTitle = 'editTitle',
  editIcon = 'editIcon'
}

export interface INewShelfRequest {
  title: string;
  icon: string;
  public: boolean;
}

export enum ShelfUpdateType {
  newBook = 'newBook',
  rmBook = 'rmBook',
  newFollower = 'newFollower',
  newShelf = 'newShelf',
  titleEdit = 'titleEdit'
}
export interface IShelfUpdate {
  _id: string;
  text: string;
  created: Date;
  data: any;
  eventType: ShelfUpdateType;
}
export interface IShelf {
  _id: string;
  icon: string;
  created: Date;
  books: Array<IBook>;
  public: boolean;
  followers: Array<IUser>;
  owner: IUser;
  integratedType: 'readBooks' | 'savedBooks';
  listType: 'integrated' | 'single';
  updates: Array<IShelfUpdate>;
  disabled: boolean;
  title: string;
}

export interface IShelfDetail {
  id: string;
  listType: 'integrated' | 'single';
  integratedType: 'readBooks' | 'savedBooks';
  owner: IUser;
  public: boolean;
  icon: string;
  title: string;
  books: number
}
export interface IUserState {
  jwt: string;
  user:  IUser;
  loggedIn: boolean;
  showAuthModal: boolean;
  authModalActivePage: AuthModalTypes;
  userStats: IStat | null;
  topicForStat: ITopic | null;
  followedShelves: Array<IShelfDetail>;
  selectedShelf: IShelf;
  selectedShelfComments: Array<IComment>;
  authModalData: any;
}

export interface IAddTopicToStatRequest {
  statId: string;
  topic: any;
  description?: string;
  goal?: number;
  dueDate?: Date;
}

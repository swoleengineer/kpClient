export interface IUserProfile {
  first_name: string;
  last_name: string;
  picture: {
    public_id: string;
    link: string;
  } | {}
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
  created: Date;
  username: string;
}


export interface IUserState {
  jwt: string;
  user:  IUser;
  loggedIn: boolean;
}

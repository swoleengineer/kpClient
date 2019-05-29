import { IUserState, IUser } from '../models';

const tempUser: IUser = {
  profile: {
    first_name: 'Joram',
    last_name: 'Clervius',
    picture: {}
  },
  email: 'testing@gmail.com',
  username: 'clervius',
  password: 'Password1',
  _id: '12345',
  role: 'user',
  notification_book_comment: true,
  notification_new_book: true,
  notification_new_question: true,
  notification_question_comment: true,
  created: new Date()
}

export const initialUserState: IUserState = {
  jwt: '156156156',
  user: tempUser,
  loggedIn: true
};

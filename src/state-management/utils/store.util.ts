export const siteName = 'Keen Pages';
export const pageTitleMap = {
  HOME: 'Home',
  LOGIN: 'Login',
  FORGOTPASSWORD: 'Forgot Password',
  REGISTER: 'Register',
  RESETPASSWORD: 'Reset Password',
  NEWTOPIC: 'New Topic',
  NEWBOOK: 'New Book',
  NEWQUESTION: 'New Question',
  ALLQUESTIONS: 'All Questions',
  SINGLEQUESTION: question => question && question.title ? question.title : 'Single question',
  ALLBOOKS: 'All Books',
  SINGLEBOOK: book => book && book.title ? book.title : 'Single book'

}

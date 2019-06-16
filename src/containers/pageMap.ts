import Home from '../components/pages/main/home';
import Login from '../components/pages/auth/login';
import Register from '../components/pages/auth/register';
import NewBook from '../components/pages/auth/newBook/index1';
import NewTopic from '../components/pages/auth/topic';
import NewQuestion from '../components/pages/auth/question';
import Allbooks from '../components/pages/main/books/all';
import SingleBook from '../components/pages/main/books/single';
import ForgotPw from '../components/pages/auth/forgotPw/forgot';
import ResetPw from '../components/pages/auth/forgotPw/reset';
import SingleQuestion from '../components/pages/main/questions/single';
import AllQuestions from '../components/pages/main/questions/all';
import Profile from '../components/pages/main/profile';

export default {
  'main/home': Home,
  'auth/login': Login,
  'auth/register': Register,
  'auth/topic': NewTopic,
  'auth/newBook': NewBook,
  'auth/question': NewQuestion,
  'auth/forgotPw/forgot': ForgotPw,
  'auth/forgotPw/reset': ResetPw,
  'main/books/all': Allbooks,
  'main/books/single': SingleBook,
  'main/questions/all': AllQuestions,
  'main/questions/single': SingleQuestion,
  'main/profile': Profile
}

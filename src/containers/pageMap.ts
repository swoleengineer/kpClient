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
import Privacy from '../components/pages/main/privacy';
import Terms from '../components/pages/main/termsOfService';
import AddTopicToStats from '../components/pages/auth/stats/addTopic';
import CreateShelf from '../components/pages/auth/shelves/newShelf';
import AddBookToShelf from '../components/pages/auth/shelves/addBook';
import SearchBooks from '../components/pages/auth/searchBooks';

export default {
  'main/home': Home,
  'auth/login': Login,
  'auth/register': Register,
  'auth/topic': NewTopic,
  'auth/newBook': NewBook,
  'auth/question': NewQuestion,
  'auth/forgotPw/forgot': ForgotPw,
  'auth/forgotPw/reset': ResetPw,
  'auth/stats/addTopic': AddTopicToStats,
  'main/books/all': Allbooks,
  'main/books/single': SingleBook,
  'main/questions/all': AllQuestions,
  'main/questions/single': SingleQuestion,
  'auth/shelves/newShelf': CreateShelf,
  'auth/shelves/addBook': AddBookToShelf,
  'auth/searchBooks': SearchBooks,
  'main/profile': Profile,
  'main/privacy': Privacy,
  'main/termsOfService': Terms
}

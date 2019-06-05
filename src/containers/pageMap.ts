import Home from '../components/pages/main/home';
import Login from '../components/pages/auth/login';
import Register from '../components/pages/auth/register';
import NewBook from '../components/pages/auth/newBook';
import NewTopic from '../components/pages/auth/topic';
import NewQuestion from '../components/pages/auth/question';

export default {
  'main/home': Home,
  'auth/login': Login,
  'auth/register': Register,
  'auth/topic': NewTopic,
  'auth/newBook': NewBook,
  'auth/question': NewQuestion
}

import axios from 'axios';

const currentUrl = window.location.hostname;

export const getApiUrl = () => {
  if (currentUrl.toLowerCase().startsWith('localhost')) return 'http://localhost:4810';
  return 'https://api.keenpages.com';
};


const token = (): string | null => localStorage.getItem('x-access-token');

export const config = () => ({
  headers: {
    'x-access-token': token()
  }
})

const instance = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'x-access-token': token
  }
})

instance.interceptors.response.use(response => response, error => {
  let message: string = '';
  if (error.response) {
    console.error(error.response.status, error.response.data);
    message = `${error.response.status}: request made, and server responded with ${JSON.stringify(error.response.data)}`;
  } else if (error.request) {
    console.error(error.request);
    message = `Request made, but no response received from server.`;
  } else {
    message = `Something happened in setting up the request that triggered an error... ${JSON.stringify(error.message)}`;
  }

  // Replace with Sentry error logging code.

  // Raven.captureException(error, { extra: {
  //   type: 'HTTP Request Error',
  //   message
  // }})

  return Promise.reject(error);
});



export default instance;

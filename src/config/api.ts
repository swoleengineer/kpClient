import axios from 'axios';
// import * as Sentry from '@sentry/browser';

const currentUrl = window.location.hostname;

export const getApiUrl = () => {
  if (currentUrl.toLowerCase().startsWith('localhost')) return 'http://localhost:4810';
  return 'https://dev-api.keenpages.com';
};

export const gAPI = 'AIzaSyB8Z-fRItUJSUltWt3UXAkyvl15Dd6yfqM';

const token = (): string | null => localStorage.getItem('x-access-token');

export const config = () => ({
  headers: {
    'x-access-token': token()
  }
})

const instance = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'x-access-token': token()
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
  // Sentry.captureException({
  //   type: 'HTTP Request Error',
  //   message,
  //   data: error
  // });
  return Promise.reject(error);
});



export default instance;

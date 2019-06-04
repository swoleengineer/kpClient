
// const wait = (seconds: number) => new Promise((resolve) => setTimeout(() => resolve(), seconds * 1000));

const routesMap = { 
  HOME: {
    path: '/',
    thunk: (dispatch: Function, getState: Function) => {
    }
  },
  LOGIN: {
    path: '/login'
  },
  FORGOTPASSWORD: {
    path: '/forgot',
    thunk: (dispatch, getState) => {
    }
  },
  REGISTER: {
    path: '/register',
    thunk: (dispatch, getState) => {
    }
  },
  RESETPASSWORD: {
    path: '/pwReset/:token',
    thunk: (dispatch: Function, getState: Function) => {
    }
  },
  NEWTOPIC: {
    path: '/newTopic'
  },
  NEWBOOK: {
    path: '/newBook',
  },
  PROFILE: {
    path: '/profile',
    thunk: (dispatch, getState) => {
    }
  },
}

export { routesMap }

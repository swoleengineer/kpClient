
// const wait = (seconds: number) => new Promise((resolve) => setTimeout(() => resolve(), seconds * 1000));

const routesMap = { 
  HOME: {
    path: '/',
    thunk: (dispatch: Function, getState: Function) => {
    }
  },
  FORGOTPASSWORD: {
    path: '/forgot',
    thunk: (dispatch, getState) => {
    }
  },
  REGISTER: {
    path: '/createAccount',
    thunk: (dispatch, getState) => {
    }
  },
  RESETPASSWORD: {
    path: '/pwReset/:token',
    thunk: (dispatch: Function, getState: Function) => {
    }
  },

  DASHBOARDHOME: {
    path: '/dashboard',
    thunk: (dispatch, getState) => {
    }
  },
  PROFILE: {
    path: '/profile',
    thunk: (dispatch, getState) => {
    }
  },
}

export { routesMap }

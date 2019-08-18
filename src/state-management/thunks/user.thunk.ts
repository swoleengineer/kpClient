import { store } from '../../store';
import { INewUserRequest, IUserLoginRequest, IStore, IUser, IAddTopicToStatRequest, AuthModalTypes, ITopic } from '../models';
import { postNewUser, postUserLogin, postSaveBookToUser, postRmBookFrUser,
  postUserAutoAuth, postUserForgotPass, postUserResetPassword, postUserUpdatePic,
  postUserUpdate, postUserChangePassword, postUserNotificationSettings,
  getSingeUserStats, postNewTopicToStat, postGenerateStat, postEditStatSkill, postRemoveStatSkill
} from '../../config';
import { userActionTypes as types, bookActionTypes as bookTypes } from '../actions';
import { Toaster } from '@blueprintjs/core'
import { redirect } from 'redux-first-router'

const AppToaster = Toaster.create({
  className: 'keenpagesToaster',
})

export const showAuthModal = (page: AuthModalTypes) => {
  store.dispatch({
    type: types.toggleAuthModal,
    payload: true
  });
  store.dispatch({
    type: types.setAuthModalPage,
    payload: page
  })
}

export const register = (params: INewUserRequest, goToNext: boolean = false, redirectPayload: {
  type: string;
  payload?: any
} = { type: 'HOME' }) => postNewUser(params).then(
  (res: any) => {
    const { user, jwt } = res.data;
    store.dispatch({
      type: types.setUser,
      payload: user
    });
    store.dispatch({
      type: types.updateLoggedIn,
      payload: { loggedIn: true, jwt }
    });
    return { user, goToNext, redirectPayload, jwt };
  },
  (err: any) => {
    console.log(err, err.response.data);
    AppToaster.show({
      message: err.response.data.message || 'Could not register your account. Please try again later.',
      intent: 'danger',
      icon: 'error'
    })
  }
).then((nextPayload: { user: IUser; goToNext: boolean; redirectPayload: any; jwt: string }) => {
  const { user, goToNext: gNext, redirectPayload: rdPload, jwt } = nextPayload;
  return getSingeUserStats(user._id).then(
    res => {
      if (!res.data) {
        return;
      }
      const payload = res.data;
      store.dispatch({
        type: types.setUserStats,
        payload
      });
      localStorage.setItem('x-access-token', jwt);
      AppToaster.show({
        message: 'Successfully registered.',
        intent: 'success',
        icon: 'tick',
        onDismiss: () => gNext ? store.dispatch(redirect(rdPload)) : null
      });
    },
    error => {
      console.log(error, error.response.data);
      AppToaster.show({
        message: error.response.data.message || 'Could not register your account. Please try again later.',
        intent: 'danger',
        icon: 'error'
      });
    }
  )
});



export const login = (params: IUserLoginRequest, goToNext: boolean = false, redirectPayload: {
  type: string;
  payload?: any
} = { type: 'HOME' }) => postUserLogin(params).then(
  ({ data }) => {
    const { user, jwt } = data;
    store.dispatch({
      type: types.setUser,
      payload: user
    });
    store.dispatch({
      type: types.updateLoggedIn,
      payload: { loggedIn: true, jwt }
    });
    localStorage.setItem('x-access-token', jwt);
    AppToaster.show({
      message: `Welcome ${user.profile.first_name}`,
      intent: 'success',
      icon: 'tick',
      onDismiss: () => goToNext ? store.dispatch(redirect(redirectPayload)) : null
    });
    return { user, goToNext, redirectPayload, jwt };
  },
  err => {
    console.log(err, err.response.data);
    AppToaster.show({
      message: err.response.data.message || 'Could not log you in. Please try again later.',
      intent: 'danger',
      icon: 'error'
    })
  }
).then((nextPayload: { user: IUser; goToNext: boolean; redirectPayload: any; jwt: string }) => {
  const { user, goToNext: goNext, redirectPayload: nexpload, jwt } = nextPayload;
  return getSingeUserStats(user._id).then(
    res => {
      if (!res.data) {
        return;
      }
      const payload = res.data;
      store.dispatch({
        type: types.setUserStats,
        payload
      });
      localStorage.setItem('x-access-token', jwt);
      AppToaster.show({
        message: 'Successfully registered.',
        intent: 'success',
        icon: 'tick',
        onDismiss: () => goNext ? store.dispatch(redirect(nexpload)) : null
      });
    },
    error => {
      console.log(error, error.response.data);
      AppToaster.show({
        message: error.response.data.message || 'Could not register your account. Please try again later.',
        intent: 'danger',
        icon: 'error'
      });
    }
  )
});

export const autoLogin = () => {
  const token = localStorage.getItem('x-access-token');
  if (!token) {
    return;
  }
  postUserAutoAuth({ token }).then(
    (res: any) => {
      const { user, jwt } = res.data || { jwt: undefined, user: undefined };
      store.dispatch({
        type: types.setUser,
        payload: user
      });
      store.dispatch({
        type: types.updateLoggedIn,
        payload: { loggedIn: true, jwt }
      });
      return { user, jwt };
    },
    (err: any) => {
      localStorage.removeItem('x-access-token');
    }
  ).then((nextPayload: { user: IUser; goToNext: boolean; redirectPayload: any; jwt: string }) => {
    const { user, jwt } = nextPayload;
    return getSingeUserStats(user._id).then(
      res => {
        if (!res.data) {
          return;
        }
        const payload = res.data;
        store.dispatch({
          type: types.setUserStats,
          payload
        });
        localStorage.setItem('x-access-token', jwt);
        AppToaster.show({
          message: `Welcome ${user.profile.first_name}`,
          intent: 'success',
          icon: 'tick',
        });
      },
      error => {
        AppToaster.show({
          message: error.response.data.message || 'Could not register your account. Please try again later.',
          intent: 'danger',
          icon: 'error'
        });
      }
    )
  }).catch((err) => err)
}

export const updateProfilePicture = (id: string, body: { public_id: string; link: string }) => postUserUpdatePic(id, body).then(
  (res: any) => {
    store.dispatch({
      type: types.updateUser,
      payload: res.data
    })
  },
  (err: any) => {
    console.log(err.response.data);
    AppToaster.show({
      message: 'Could not update your profile picture.',
      intent: 'danger',
      icon: 'error'
    })
  }
)

export const editNotificationSettings = (id: string, params: { [key: string]: boolean }) => postUserNotificationSettings(id, params).then(
  (res: any) => {
    store.dispatch({
      type: types.updateUser,
      payload: res.data
    })
  },
  (err: any) => {
    let message;
    try {
      message = err.response.data.message
    } catch {
      message = 'Could not generate and send token to reset your password. Please try again later.'
    }
    AppToaster.show({
      message,
      intent: 'danger',
      icon: 'error'
    })
  }
)

export const updateAccount = (id: string, body: { [key: string]: any }) => postUserUpdate(id, body).then(
  (res: any) => {
    store.dispatch({
      type: types.updateUser,
      payload: res.data
    })
  },
  (err: any) => {
    let message;
    try {
      message = err.response.data.message
    } catch {
      message = 'Could not generate and send token to reset your password. Please try again later.'
    }
    AppToaster.show({
      message,
      intent: 'danger',
      icon: 'error'
    })
  }
)

export const ChangeUserPassword = (id: string, params: { oldPassword: string; password: string}) => postUserChangePassword(id, params).then(
  (res: any) => AppToaster.show({ message: 'Password updated'}),
  (err: any) => {
    let message;
    try {
      message = err.response.data.message
    } catch {
      message = 'Could not generate and send token to reset your password. Please try again later.'
    }
    AppToaster.show({
      message,
      intent: 'danger',
      icon: 'error'
    })
  }
)

export const toggleUserBook = (id: string, list: 'readBooks' | 'savedBooks', type: 'add' | 'remove') => ({
  add: postSaveBookToUser,
  remove: postRmBookFrUser
}[type])(id, list).then(
  (res: any) => {
    const { book, user } = res.data || { book: undefined, user: undefined};
    if (!book || !user) {
      throw { response: { data: { message: 'Could not manage this book in your account.'}}};
      return;
    }
    store.dispatch({
      type: types.updateSavedBook,
      payload: { type, list, book }
    });
    if (list === 'savedBooks') {
      store.dispatch({
        type: bookTypes.updateBookLike,
        payload: {
          type,
          like: user._id,
          book: id
        }
      });
    }
    
    
    AppToaster.show({
      message: `'${book.title}' ${type === 'add' ? 'saved to' : 'removed from'} your ${list === 'readBooks' ? 'library' : 'saved books'}.`,
      intent: 'none',
      icon: type === 'add' && user.savedBooks.includes(id)
        ? 'book'
        : list === 'savedBooks'
          ? 'bookmark'
          : 'book'
    })
  },
  (err: any) => {
    console.log(err.response.data);
    AppToaster.show({
      message: 'Could not update this book in your account.',
      intent: 'danger',
      icon: 'error'
    })
  }
);

export const isLoggedIn = () => {
  const { user: { loggedIn } } = store.getState() as IStore;
  return loggedIn;
}

export const logUserOut = () => {
  localStorage.removeItem('x-access-token');
  store.dispatch({ type: types.userLogout });
  AppToaster.show({
    message: `You've been logged out.`,
    intent: 'none',
    icon: 'log-out'
  })
}

export const submitForgotPass = (params: { email: string }, goToNext: boolean = false, redirectPayload: {
  type: string;
  payload?: any
} = { type: 'HOME' }) => postUserForgotPass(params).then(
  () => 'If we have an account for that address, you should receive a reset link soon. Please check your email (Check spam/junk too!) for a link to reset your password.',
  (err: any) => {
    let message;
    try {
      message = err.response.data.message
    } catch {
      message = 'Could not generate and send token to reset your password. Please try again later.'
    }
    return message;
  }
)


export const submitResetPass = (params: { password: string }, goToNext: boolean = false, redirectPayload: {
  type: string;
  payload?: any
} = { type: 'HOME' }) => {
  const { ocation: { payload: { token }}} = store.getState();
  return postUserResetPassword({ password: params.password, token }).then(
    (res: any) => {
      const { user, jwt } = res.data || { jwt: undefined, user: undefined };
      store.dispatch({
        type: types.setUser,
        payload: user
      });
      store.dispatch({
        type: types.updateLoggedIn,
        payload: { loggedIn: true, jwt }
      });
      localStorage.setItem('x-access-token', jwt);
      AppToaster.show({
        message: `Password updated. You are now logged in.`,
        intent: 'success',
        icon: 'tick',
        onDismiss: () => goToNext ? store.dispatch(redirect(redirectPayload)) : null
      });
    },
    (err: any) => {
      let message;
      try {
        message = err.response.data.message
      } catch {
        message = 'Application error resetting your password.'
      }
      AppToaster.show({
        message,
        intent: 'danger',
        icon: 'error'
      })
    }
  )
}

const updateStatState = res => {
  const { updatedStat = undefined } = res.data;
  store.dispatch({
    type: types.updateUserStats,
    payload: updatedStat || res.data
  });
  return res.data;
}
const handleStatErr = (errMsg: string) => err => {
  let message;
  try {
    message = err.response.data.message
  } catch {
    message = errMsg;
  }
  AppToaster.show({ message, intent: 'danger', icon: 'error' });
  return err;
}

export const addSkillToStats = (params: { topic: ITopic; description: string; goal: number; dueDate: Date }) => {
  const { user: { userStats }} = store.getState() as IStore;
  const { figures: statFigures = [], _id: statId = ''} = { ...(userStats || {}) };
  const figures = statFigures.filter(fig => fig);
  if (figures.length && figures.findIndex(({ topic: { _id }}) => _id === params.topic._id) > -1) {
    const message = 'You are already tracking this topic.';
    AppToaster.show({ message, intent: 'danger', icon: 'error' });
    return new Promise((resolve, reject) => reject(undefined));
  }
  
  const request: IAddTopicToStatRequest = { statId, ...params };
  return postNewTopicToStat(request).then(
    updateStatState,
    handleStatErr('Could not add this topic to your stats.')
  )
}

export const generateStats = (body: { statId: string }) => postGenerateStat(body).then(
  updateStatState,
  handleStatErr('Error generating your stats, please try again later.')
)

export const editStats = (body: { skillId: string; edits: Array<{ field: string; value: any; }>}) => {
  const { user: { userStats }} = store.getState() as IStore;
  const { _id: statId = ''} = { ...(userStats || {}) };
  return postEditStatSkill(statId, body).then(
    updateStatState,
    handleStatErr('Error editing your stats. Please try again later.')
  );
}

export const deleteStatSkill = (figureId: string) => {
  const { user: { userStats }} = store.getState() as IStore;
  const { _id: statId = ''} = { ...(userStats || {}) };
  return postRemoveStatSkill(statId, figureId).then(
    updateStatState,
    handleStatErr('Could not delete this skill from your stats. Please try again later.')
  );
}

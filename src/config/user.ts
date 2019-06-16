import {  AxiosPromise } from 'axios';
import {  INewUserRequest, IUserLoginRequest, IUser } from '../state-management/models/';
import {  userGetDetailsUrl, userRegisterUrl, userLoginUrl, userSearchUrl,
  userAutoAuthUrl, userForgotPassUrl, userUpdatePicUrl, userResetPassUrl,
  userUpdateUrl, userChangeNotificationsUrl, userSaveBookUrl, userRmBookUrl,
  userChangePassUrl, 
} from './';
import API, {  config } from './api';

export const postNewUser = (body: INewUserRequest): AxiosPromise<{ user: IUser; jwt: string}> => API.post(userRegisterUrl, body);
export const postUserLogin = (body: IUserLoginRequest): AxiosPromise => API.post(userLoginUrl, body);
export const postUserSearch = (body: { account: string }): AxiosPromise => API.post(userSearchUrl, body);
export const getUserDetails = (id: string): AxiosPromise => API.get(userGetDetailsUrl(id), config());
export const postUserChangePassword = (id: string, body: { oldPassword: string; password: string}): AxiosPromise => API.post(userChangePassUrl(id), body, config());
export const postUserAutoAuth = (body: { token: string }): AxiosPromise => API.post(userAutoAuthUrl, body);
export const postUserForgotPass = (body: { email: string }): AxiosPromise => API.post(userForgotPassUrl, body);
export const postUserResetPassword = (body: { password: string, token: string }): AxiosPromise => API.post(userResetPassUrl, body);
export const postUserUpdatePic = (id: string, body: { public_id: string; link: string }): AxiosPromise => API.post(userUpdatePicUrl(id), body, config());
export const postUserUpdate = (id: string, body: { [key: string]: any }): AxiosPromise => API.post(userUpdateUrl(id), body, config());
export const postUserNotificationSettings = (id: string, body: { [key: string]: boolean }): AxiosPromise => API.post(userChangeNotificationsUrl(id), body, config());
export const postSaveBookToUser = (bookId: string, list: 'readBooks' | 'savedBooks'): AxiosPromise => API.post(userSaveBookUrl(bookId, list), null, config());
export const postRmBookFrUser = (bookId: string, list: 'readBooks' | 'savedBooks'): AxiosPromise => API.post(userRmBookUrl(bookId, list), null, config());

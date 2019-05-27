import {  AxiosPromise } from 'axios';
import { ICommentRequest, ICommentSearch } from '../state-management/models/';
import { commentGetManyUrl, commentGetSingleUrl, commentCreateUrl, commentUpdateUrl, commentRemoveUrl } from './';
import API, {  config } from './api';

export const postSearchManyComments = (body: ICommentSearch): AxiosPromise => API.post(commentGetManyUrl, body);
export const getSingleComment = (id: string): AxiosPromise => API.get(commentGetSingleUrl(id));
export const postCreateComment = (body: ICommentRequest): AxiosPromise => API.post(commentCreateUrl, body, config());
export const postUpdateComment = (id: string, body: { [key: string]: any }): AxiosPromise => API.post(commentUpdateUrl(id), body, config());
export const deleteComment = (id: string): AxiosPromise => API.delete(commentRemoveUrl(id), config());

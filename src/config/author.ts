import {  AxiosPromise } from 'axios';
import { IAuthorRequest } from '../state-management/models/';
import { authorCreateUrl, authorGetSingleUrl, authorGetManyUrl,
  authorUpdateUrl, authorRemoveUrl } from './';
import API, {  config } from './api';

export const postAuthorCreate = (body: IAuthorRequest): AxiosPromise => API.post(authorCreateUrl, body, config());
export const getSingleAuthor = (id: string): AxiosPromise => API.get(authorGetSingleUrl(id));
export const getManyAuthors = (name: string): AxiosPromise => API.get(authorGetManyUrl(name));
export const postUpdateAuthor = (id: string, body: { [key: string]: any }): AxiosPromise => API.post(authorUpdateUrl(id), body, config());
export const postDeleteAuthor = (id: string): AxiosPromise => API.delete(authorRemoveUrl(id), config());

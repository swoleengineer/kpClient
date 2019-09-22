import {  AxiosPromise } from 'axios';
import { IShelf, IShelfDetail, INewShelfRequest , ShelfEditType } from '../state-management/models/';
import { shelfGetSingleUrl, shelfGetMultipleUrl, shelfCreateUrl, shelfNewFollowerUrl, shelfRmFollowerUrl,
  shelfDeleteUrl, shelfEditUrl, shelfGetMyShelvesUrl
} from './';
import API, {  config } from './api';

export const getSingleShelfReq = (shelfId: string): AxiosPromise<IShelf> => API.get(shelfGetSingleUrl(shelfId), config());
export const postMultipleShelvesReq = (body: { shelfIds: Array<string>; }): AxiosPromise<Array<IShelfDetail>> => API.post(shelfGetMultipleUrl, body, config());
export const postCreateShelfReq = (body: INewShelfRequest): AxiosPromise<IShelf> => API.post(shelfCreateUrl, body, config());
export const postNewShelfFollowerReq = (shelfId: string): AxiosPromise<IShelf> => API.post(shelfNewFollowerUrl(shelfId), null, config());
export const postRmShelfFollowerReq = (shelfId: string): AxiosPromise<IShelf> => API.post(shelfRmFollowerUrl(shelfId), null, config());
export const deleteShelfReq = (shelfId: string): AxiosPromise => API.delete(shelfDeleteUrl(shelfId), config());
export const postEditShelfReq = (shelfId: string, body: { edits: Array<{ type: ShelfEditType, payload?: { [key: string]: any }}>}): AxiosPromise => API.post(shelfEditUrl(shelfId), body, config());
export const getMyShelvesReq = (): AxiosPromise => API.get(shelfGetMyShelvesUrl, config());

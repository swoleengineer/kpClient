import {  AxiosPromise } from 'axios';
import { IBookRequest, IBookPicture, ITopic } from '../state-management/models/';
import { bookGetOneUrl, bookGetManyByTopic, bookGetAllUrl, bookAddBeginUrl, bookEditUrl,
  bookDeleteUrl, bookSearchUrl, bookToggleLikeUrl, bookAddPicUrl, bookRmPicUrl, bookToggleAgreeUrl,
  bookAddTopicsUrl, bookQueryTopicSortUrl
} from './';
import API, {  config } from './api';

export const getSingleBook = (id: string): AxiosPromise => API.get(bookGetOneUrl(id));
export const getManyBooksByTopic = (topicId: string): AxiosPromise => API.get(bookGetManyByTopic(topicId));
export const getAllBooks = (): AxiosPromise => API.get(bookGetAllUrl);
export const postAddBook = (body: IBookRequest): AxiosPromise => API.post(bookAddBeginUrl, body, config());
export const postEditBook = (id: string, body: { [key: string]: any }): AxiosPromise => API.post(bookEditUrl(id), body, config());
export const deleteBook = (id: string): AxiosPromise => API.delete(bookDeleteUrl(id), config());
export const getBookSearch = (text: string): AxiosPromise => API.get(bookSearchUrl(text));
export const putToggleBookLike = (id: string): AxiosPromise => API.put(bookToggleLikeUrl(id), undefined, config());
export const postAddBookPicture = (id: string, body: IBookPicture): AxiosPromise => API.post(bookAddPicUrl(id), body, config());
export const deleteBookPicture = (id: string, pictureId: string): AxiosPromise => API.delete(bookRmPicUrl(id, pictureId), config());
export const putToggleTopicAgree = (id: string, topicId: string): AxiosPromise => API.put(bookToggleAgreeUrl(id, topicId), undefined, config());
export const postAddTopicsToBook = (book: string, body: { topics: ITopic[] }): AxiosPromise => API.post(bookAddTopicsUrl(book), body, config());
export const postQueryBookByTopicAndSort = (sort: { [key: string]: any }, topics: string[] = [], already: string[] = []): AxiosPromise => API.post(bookQueryTopicSortUrl, { sort, topics, already });

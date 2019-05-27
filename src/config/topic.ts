import {  AxiosPromise } from 'axios';
import { ITopicRequest } from '../state-management/models/';
import { topicGetSingleUrl, topicGetAllUrl, topicCreateNewUrl, topicDeleteUrl,
  topicSearchUrl } from './';
import API, {  config } from './api';

export const getSingleTopic = (id: string): AxiosPromise => API.get(topicGetSingleUrl(id));
export const getAllTopics = (): AxiosPromise => API.get(topicGetAllUrl);
export const postCreateTopic = (body: ITopicRequest): AxiosPromise => API.post(topicCreateNewUrl, body, config());
export const deleteTopic = (id: string): AxiosPromise => API.delete(topicDeleteUrl(id), config());
export const getSearchTopic = (text: string): AxiosPromise => API.get(topicSearchUrl(text));

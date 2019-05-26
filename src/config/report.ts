import {  AxiosPromise }  from 'axios';
import { IReportRequest, acceptableTypes }  from '../state-management/models/';
import { reportCreateUrl, reportDeleteUrl, reportQueryUrl }  from './';
import API, {  config }  from './api';

export const postCreateReport = (body: IReportRequest): AxiosPromise => API.post(reportCreateUrl, body, config());
export const postDeleteReport = (id: string): AxiosPromise => API.delete(reportDeleteUrl(id), config());
export const postQueryReport = (body: { parentId: string; parentType: acceptableTypes }): AxiosPromise => API.post(reportQueryUrl, body);

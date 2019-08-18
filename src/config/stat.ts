import {  AxiosPromise } from 'axios';
import { IAddTopicToStatRequest } from '../state-management/models/';
import { statGetSingleUrl, statAddTopicUrl, statGenerateUrl, statEditSkillUrl, statRemoveSkillUrl } from './';
import API, {  config } from './api';

export const getSingeUserStats = (userId: string): AxiosPromise => API.get(statGetSingleUrl(userId), config());
export const postNewTopicToStat = (request: IAddTopicToStatRequest): AxiosPromise => API.post(statAddTopicUrl, request, config());
export const postGenerateStat = (body: { statId: string }): AxiosPromise => API.post(statGenerateUrl, body, config());
export const postEditStatSkill = (statId: string, body: { skillId: string; edits: Array<{ field: string; value: any; }>}): AxiosPromise => API.post(statEditSkillUrl(statId), body, config());
export const postRemoveStatSkill = (statId: string, figureId: string): AxiosPromise => API.post(statRemoveSkillUrl(statId, figureId), null, config());

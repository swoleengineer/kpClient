import { IReportState } from '../models';
import { reportActionTypes as types } from '../actions';
import { initialReportState } from '../utils';

export const reportReducer = (state: IReportState = initialReportState, action: {
  type: string;
  payload?: any
}): IReportState => {
  switch(action.type) {
    case types.updateAll:
      return {
        ...state,
        myReports: action.payload 
      }
    case types.clearNew:
      return {
        ...state,
        newReport: {
          ...initialReportState.newReport,
          author: state.newReport.author
        }
      }
    case types.updateNew:
      return {
        ...state,
        newReport: {
          ...state.newReport,
          ...action.payload
        }
      }
    default:
      return state
  }
}

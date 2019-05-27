import { IReportState, acceptableTypes } from '../models';

export const initialReportState: IReportState = {
  newReport: {
    author: '',
    parentId: '',
    parentType: acceptableTypes.book,
    reportType: 'inappropriate'
  },
  myReports: []
}

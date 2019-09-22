export enum acceptableTypes {
  book = 'Book',
  question = 'Question',
  topic = 'Topic',
  comment = 'Comment',
  thread = 'Thread',
  shelf = 'Shelf'
}
export interface IReportRequest {
  author: string;
  parentId: string;
  parentType: acceptableTypes;
  reportType: 'inappropriate' | 'spam'
}

export interface IReport extends IReportRequest {
  _id: string;
  created: Date;
}

export interface IReportState {
  newReport: IReportRequest;
  myReports: IReport[];
}

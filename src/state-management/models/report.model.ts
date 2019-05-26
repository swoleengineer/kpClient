export enum acceptableTypes {
  book = 'Book',
  question = 'Question',
  topic = 'Topic'
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

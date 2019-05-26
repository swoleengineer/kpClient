export interface IAuthorRequest {
  name: string;
  website?: string;
}

export interface ISocialObj {
  site: 'ig' | 'tw' | 'fb' | 'li',
  url: string;
}
export interface IAuthor extends IAuthorRequest {
  _id: string;
  picture: {
    link: string;
    public_id: string;
  };
  created: Date;
  presence: ISocialObj[]
}

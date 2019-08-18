// User
export const userGetDetailsUrl = (id: string): string => `/user/userDetails/${id}`
export const userRegisterUrl: string = `/user/register`;
export const userLoginUrl: string = `/user/auth`;
export const userSearchUrl: string = `/user/search`;
export const userAutoAuthUrl: string = `/user/autoAuth`;
export const userForgotPassUrl: string = `/user/forgotPass`;
export const userResetPassUrl: string = `/user/resetPassword`;
export const userChangePassUrl = (id: string): string => `/user/changePass/${id}`;
export const userUpdatePicUrl = (id: string): string => `/user/updatePic/${id}`;
export const userUpdateUrl = (id: string): string => `/user/update/${id}`;
export const userChangeNotificationsUrl = (id: string): string => `/user/editNotifications/${id}`;
export const userSaveBookUrl = (bookId: string, list: 'readBooks' | 'savedBooks'): string => `/user/engage/saveBook/${list}/${bookId}`;
export const userRmBookUrl = (bookId: string, list: 'readBooks' | 'savedBooks'): string => `/user/engage/rmBook/${list}/${bookId}`;


// Stats
export const statGetSingleUrl = (userId: string): string => `/stat/single/${userId}`;
export const statAddTopicUrl: string = `/stat/addSkill`;
export const statGenerateUrl: string = `/stat/generateStats`;
export const statEditSkillUrl = (statId: string): string => `/stat/editSkill/${statId}`;
export const statRemoveSkillUrl = (statId: string, figureId: string): string => `/stat/removeSkill/${statId}/${figureId}`;


// Author '/author
export const authorCreateUrl: string = `/author/new`;
export const authorGetSingleUrl = (id: string): string => `/author/single/${id}`;
export const authorGetManyUrl= (name: string): string =>  `/author/many?name=${name}`;
export const authorUpdateUrl = (id: string): string => `/author/update/${id}`;
export const authorRemoveUrl = (id: string): string => `/author/single/${id}`;


// Book '/book
export const bookGetOneUrl = (id: string): string => `/book/single/${id}`;
export const bookGetManyByTopic = (topicId: string): string => `/book/many/${topicId}`;
export const bookGetAllUrl: string = `/book/all`;
export const bookAddBeginUrl: string = `/book/addBegin`;
export const bookEditUrl = (id: string): string => `/book/edit/${id}`;
export const bookDeleteUrl = (id: string): string => `/book/delete/${id}`;
export const bookSearchUrl = (text: string): string =>  `/book/search?text=${text}`;
export const bookToggleLikeUrl = (id: string): string => `/book/toggleLike/${id}`;
export const bookAddPicUrl = (id: string): string => `/book/addPic/${id}`;
export const bookRmPicUrl = (book: string, pictureId: string): string => `/book/rmPic/${book}/${pictureId}`;
export const bookToggleAgreeUrl = (book: string, topicId: string): string => `/book/toggleAgree/${book}/${topicId}`;
export const bookAddTopicsUrl = (book: string): string => `/book/addTopics/${book}`;
export const bookQueryTopicSortUrl: string = `/book/queryTopicSort`;
export const bookCreateFromInternetUrl: string = `/book/createFromInternet`;


// Comment '/comment
export const commentGetManyUrl: string = `/comment/getMany`;
export const commentGetManyForManyUrl: string = `/comment/getManyForMany`;
export const commentGetSingleUrl = (id: string): string => `/comment/single/${id}`;
export const commentCreateUrl: string = `/comment/new`;
export const commentUpdateUrl = (id: string): string => `/comment/update/${id}`;
export const commentRemoveUrl = (id: string): string => `/comment/remove/${id}`;


// Question '/question
export const questionGetSingleUrl = (id: string): string => `/question/single/${id}`;
export const questionGetManyUrl = (topicId: string): string => `/question/getMany/${topicId}`;
export const questionCreateUrl: string = `/question/startCreating`;
export const questionUpdateUrl = (id: string): string => `/question/update/${id}`;
export const questionDeleteUrl = (id: string): string => `/question/single/${id}`;
export const questionAddTopicUrl = (question: string): string => `/question/addTopic/${question}`;
export const questionRmTopic = (question: string, topicId: string): string => `/question/rmTopic/${question}/${topicId}`;
export const questionToggleAgree = (question: string, topicId: string): string => `/question/toggleAgree/${question}/${topicId}`;
export const questionAllOfThem: string = `/question/getAll`;
export const questionQueryTopicSortUrl: string = `/question/queryTopicSort`;
export const questionSearchUrl: string = `/question/search`;

// Report '/report
export const reportCreateUrl: string = `/report/new`;
export const reportDeleteUrl = (id: string): string => `/report/remove/${id}`;
export const reportQueryUrl: string = `/report/query`;


// Topic '/topic
export const topicGetSingleUrl = (id: string): string => `/topic/single/${id}`;
export const topicGetAllUrl: string = `/topic/getAll`;
export const topicCreateNewUrl: string = `/topic/new`;
export const topicDeleteUrl = (id: string): string => `/topic/single/${id}`;
export const topicSearchUrl = (text: string): string =>  `/topic/search?text=${text}`;


export const searchGoogleBooksUrl = (text: string, key: string): string => `https://www.googleapis.com/books/v1/volumes?q=intitle:${text.split(' ').join('+')}&key=${key}`;

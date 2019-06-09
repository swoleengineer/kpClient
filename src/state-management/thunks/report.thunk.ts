import { IReportRequest, } from '../models';
import { postCreateReport } from '../../config';
import { Toaster } from '@blueprintjs/core'


const AppToaster = Toaster.create({
  className: 'keenpagesToaster',
})

export const createReport = (params: IReportRequest) => postCreateReport(params).then(
  (res: any) => {
    console.log(res.data);
    AppToaster.show({
      message: 'Your report has been submitted. Thank you for helping to moderate the site.',
      intent: 'none',
      icon: 'flag'
    });
  },
  (err: any) => {
    let message;
    try {
      message = err.response.data.message;
    } catch {
      message = 'Your report could not be submitted. Please try agian later. Thank you for helping to moderate the site.';
    }
    AppToaster.show({
      message,
      icon: 'error',
      intent: 'danger'
    })
  }
)

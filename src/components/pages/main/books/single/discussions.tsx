import React from 'react';

import Icon, { IconTypeEnum } from '../../../../icons';
import ThreadSystem from '../../../../thread/threadSystem';
import { getGoodReadsData } from './utils';

interface IProps {
	tempData: any;
	newCommentFormActive: boolean;
	setNewCommentForm: Function;
	user: any;
	submitNewComment: Function;
	threads: Array<any>;
	linkTo: Function;
	deleteCommentClicked: Function;
	reportCommentClicked: Function;
}
const bookDiscussion = (props: IProps) => {
	const { newCommentFormActive, setNewCommentForm, user, submitNewComment,
		threads, linkTo, deleteCommentClicked, reportCommentClicked, tempData
	} = props;
	let commentInput;


  return (
		<div className='container' style={{ marginTop: '25px', maxWidth: '900px'}} >
			<div className='row'>
				<div className='col-md-4'>
					<div className='kp_sidebar_widget_wrapper'>
						<div className='kp_sidebar_widget_container'>
							<header className='kp_sidebar_widget_header'>
								<span className='kp_sidebar_widget_title'>
									Share book
								</span>
							</header>
							<div className='kp_sidebar_widget_content_wrapper'>
								<div className='kp_sidebar_widget_content_container'>
									<div className='kp_social_brands_wrapper'>
										<div className='kp_social_brands_container'>
											<ul className='kp_social_brands'>
												<li
													className='kp_social_brand'
												>
													<Icon icon='fa-facebook-f'  type={IconTypeEnum.brand} />
													<span className='kp_spocial_brand_count'>50</span>
												</li>
												<li
													className='kp_social_brand'
												>
													<Icon icon='fa-twitter'  type={IconTypeEnum.brand} />
													<span className='kp_spocial_brand_count'>50</span>
												</li>
												<li
													className='kp_social_brand'
												>
													<Icon icon='fa-linkedin-in'  type={IconTypeEnum.brand} />
													<span className='kp_spocial_brand_count'>50</span>
												</li>
											</ul>
										</div>
									</div>
									
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='col-md-8'>
					<ThreadSystem
						tempData={tempData}
						inputRef={input => commentInput = input}
						newCommentFormActive={newCommentFormActive}
						setNewCommentForm={setNewCommentForm}
						user={user}
						submitComment={submitNewComment}
						threads={threads}
						linkTo={linkTo}
						deleteCommentClicked={deleteCommentClicked}
						reportCommentClicked={reportCommentClicked}
					/>
				</div>
			</div>
		</div>
	);
}

export default bookDiscussion;

import React, { useState, createRef, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { redirect } from 'redux-first-router';
import { showAuthModal, toggleUserBook, addTopicsToBook, createComment, removeComment, createReport, toggleTopicAgreeBook, engagePrecheck, editBookDetails } from '../../../../../state-management/thunks'
import { IStore, ITopic, IComment, IReportRequest, acceptableTypes } from '../../../../../state-management/models';
import { Card, Breadcrumbs, Tag, Collapse, ButtonGroup, Button, Popover, Menu, MenuItem, ControlGroup, InputGroup, Alert, IAlertProps, MenuDivider, NonIdealState, Divider } from '@blueprintjs/core'
import { keenToaster } from '../../../../../containers/switcher';
import { getAuthorName } from '../../../../../state-management/utils/book.util';
import Topic from '../../../../topic';
import EditBook from '../editBook';
import Icon, { IconTypeEnum, AddBookIcon } from '../../../../icons';
import { getGoodReadsData } from './utils';
import ThreadSystem from '../../../../thread/threadSystem';
import Thread from '../../../../thread';
import KPBOOK from '../../../../../assets/kp_book.png';
import './single.css'; 
import PageTopics from './home_topics';

import Discussion from './discussions';
import Sidebar from './sidebar';
import About from './about';
import Pictures from './pictures';
import Excerpts from './excerpts';
import Vote from './votes';


const singleBook = () => {
	const book = useSelector((store: IStore) => store.book.selectedBook);
	const user = useSelector((store: IStore) => store.user.user);
	const dispatch = useDispatch();
	const linkTo = payload => dispatch(redirect(payload));
	const [addTopicOpen, setTopicForm] = useState<boolean>(false);
	const [viewTopicChart, setTopicChartView] = useState<boolean>(false);
	const [showEdit, setEditForm] = useState<boolean>(false);
	const [tempDiscussions, setTempDiscussions] = useState<any>();
	
  
  const [commentToDelete, updateDeletingComment] = useState<IComment>();
  const [alertProps, updateAlertProps] = useState<IAlertProps>();
  const [alertConfig, updateAlertConfig] = useState<{
    type: 'deleteComment' | 'reportComment' | 'reportBook';
    text: string;
  }>({
    type: 'deleteComment',
    text: ''
  });
  const [itemToReport, updateReportingItem] = useState<IReportRequest>({
    parentId: '',
    parentType: acceptableTypes.comment,
    author: user ? user._id : '',
    reportType: 'inappropriate'
  })
  const [newCommentFormActive, setNewCommentForm] = useState<boolean>(false);
  const [topicFilter, setTopicFilter] = useState<string>('');
	const [activeTab, setActiveTab] = useState<number>(0);
	
	useEffect(() => {
		if (!book || !Object.keys(book).length || !book['isbn10'] || (book.comments && book.comments.length) || !Object.keys(book.thirdPartyData).length) {
			setTempDiscussions(null);
			return;
		}
		const { thirdPartyData } = book;
		const goodReadsData = thirdPartyData.find(x => ['provider', 'goodReads'].includes(x.provider));
		if (goodReadsData && goodReadsData.data && goodReadsData.data.reviews_widget) {
			setTempDiscussions(<div dangerouslySetInnerHTML={{ __html: goodReadsData.data.reviews_widget }} />)
		}
	}, [book])

	
	if (!book || !Object.keys(book).length) {
		console.error('No book details');
		return null;
	}
	const userBook = user && user.readBooks.map(livre => livre._id).includes(book._id)
    ? 'readBooks'
    : user && user.savedBooks.map(livre => livre._id).includes(book._id)
      ? 'savedBooks'
			: undefined;
	
	const submitNewComment = (payload, cb = (x: any) => null) => {
		if (!payload.text || !payload.text.length) {
			return;
		}
		engagePrecheck(book, true, error => {
			if (error) {
				return;
			}
			createComment(
			{
				...payload,
				author: user._id,
				parentId: book._id,
				parentType: acceptableTypes.book,
				created: new Date()
			},
			false,
			{
				type: 'SINGLEBOOK',
				payload: {
				id: book._id
				}
			})
			.then(() => {
				setNewCommentForm(false);
				cb(null)
			})
			.catch((e) => {
				console.log(e);
				cb(e);
				})
			})
		}
	const submitNewReport = () => {
		if (!itemToReport.parentId || !itemToReport.author) {
			keenToaster.show({
				message: 'Improper report request. Please try again.',
				icon: 'error'
			});
			return;
		}
		createReport(itemToReport)
			.then(
				() => {
					updateAlertProps({ ...alertProps, isOpen: false });
					updateReportingItem({
						parentId: '',
						parentType: acceptableTypes.comment,
						author: user ? user._id : '',
						reportType: 'inappropriate'
					});
					updateAlertConfig({ ...alertConfig, text: ''})
				}
			)
			.catch(() => console.log('Could not add this report right now.'));
		}
		const alertFunctions = {
			deleteComment: () => commentToDelete ? removeComment(commentToDelete).then(
				() => {
					updateAlertProps({ ...alertProps, isOpen: false });
					updateDeletingComment(undefined);
					updateAlertConfig({ ...alertConfig, text: ''})
				}
			).catch() : null,
			reportBook: () => itemToReport.parentId && itemToReport.author ? submitNewReport() : null
		}
		const deleteCommentClicked = comment => {
			updateDeletingComment(comment);
			updateAlertConfig({
				type: 'deleteComment',
				text: 'Are you sure you want to delete this comment?'
			});
			updateAlertProps({
				cancelButtonText: 'Nevermind',
				confirmButtonText: 'Delete it',
				icon: 'trash',
				isOpen: true,
				intent: 'danger',
			});
		}
		const reportCommentClicked = comment => engagePrecheck(book, true, err => {
			if (err) {
				return;
			}
			updateReportingItem({
				parentId: comment._id,
				parentType: acceptableTypes.comment,
				author: user ? user._id : '',
				reportType: 'inappropriate'
			})
			updateAlertConfig({
				type: 'reportBook',
				text: `Are you sure you want to report this comment as Inappropriate?`
			})
			updateAlertProps({
				cancelButtonText: 'Nevermind',
				confirmButtonText: 'Report it',
				icon: 'flag',
				isOpen: true,
				intent: 'danger',
			});
		});
	const clickTopic = (topicId: string) => {
		engagePrecheck(book, true, err => {
			if (err) {
				return;
			}
			return user 
				? toggleTopicAgreeBook(book._id, topicId)
					.then(
						() => console.log('success'),
						() => console.log('fail')
					)
				: null
		})
	}
	const addTopics = (tpx: Array<any> = []) => {
		if (!tpx || !tpx.length) {
			return;
		}
		const processResp = (success: boolean = true) => keenToaster.show({
			intent: 'none',
			message: success ? 'Topic(s) have been added successfully' : 'Error adding topics.',
			icon: <><span className='bp3-icon'><Icon icon={`fa-${success ? 'check' : 'exclamation'}`} /></span></>
		})
		engagePrecheck(book, true, err => {
			if (err) {
				return;
			}
			addTopicsToBook(book._id, tpx)
				.then((r) => {
					console.log(r);
					processResp();
				})
				.catch((e) => {
					console.error(e);
					processResp(false);
				})
		});
		return;
	}
		

	const { title, pictures, topics = [] } = book;
	const isRead = user && user.readBooks.findIndex(livre => livre.gId === book.gId) > -1;
	const [ picture = { link: undefined}] = pictures || [];

	const pageTabs = [{
		title: 'Discussions',
		icon: 'fa-comments-alt',
		component: Discussion,
		props: {
			newCommentFormActive, setNewCommentForm, user, submitNewComment,
			threads: book.comments, linkTo, deleteCommentClicked, reportCommentClicked,
			tempData: tempDiscussions
		}
	}, {
		title: 'About',
		icon: 'fa-info-square',
		component: About,
		props: {}
	}, {
		title: 'Photos',
		icon: 'fa-image',
		component: Pictures,
		props: {}
	}, {
		title: 'Excerpts',
		icon: 'fa-quote-left',
		component: Excerpts,
		props: {}
	}, {
		title: 'Activity',
		icon: 'fa-book-reader',
		component: Vote,
		props: {
			
		}
	}]
	const Display = pageTabs[activeTab].component;
  return (
		<section className='section_gray section_top' style={{ padding: '25px 0'}}>
			<Alert
        {...alertProps}
        onConfirm={() => alertFunctions[alertConfig.type]()}
        onCancel={() => updateAlertProps({ isOpen: false})}
        cancelButtonText='Nevermind'
      >
        {alertConfig.text}
      </Alert>
				<div className='kp_breadcrumbs_wrapper'>
					<div className='kp_breadcrumbs_container'></div>
				</div>
				<header className='kp_sb_header'>
					<div className='container sb_social_header'>
						<div className='sb_book_image_wrapper'>
							<div className='sb_book_image_container' style={{backgroundImage: `url(${picture.link || KPBOOK})`}} />
							{/* <div className='sb_page_social_brand_btns'>
								<ul
										className='sb_nav_brands_wrapper'
									>
										<li
											className='sb_nav_brand'
										>
											<Icon
												icon='fa-facebook-f'
												type={IconTypeEnum.brand}
											/>
											<span>15</span>
										</li>
										<li
											className='sb_nav_brand'
										>
											<Icon
												icon='fa-twitter'
												type={IconTypeEnum.brand}
											/>
											<span>35</span>
										</li>
										<li
											className='sb_nav_brand'
										>
											<Icon
												icon='fa-linkedin-in'
												type={IconTypeEnum.brand}
											/>
											<span>50</span>
										</li>
									</ul>
							</div> */}
						</div>
					</div>

					<div className='sb_social_wrapper'>
						<div className='container'>
							<div className='sb_social_container'>
								<ul className='sb_social_actions'>
									<li 
										className='sb_social_action'
										onClick={() => {
											engagePrecheck(book, true, err => {
												if (err) {
													return;
												}
												return user 
													? toggleUserBook(book._id, 'savedBooks', book.likes.includes(user._id) ? 'remove' : 'add')
													: null;
											})
										}}
									>
										<Icon
											icon='fa-heart'
											reverse={true}
											style={{ marginRight: '8px', ...(user && book.likes.includes(user._id) ? { color: '#db3737'} : {})}}
											type={user && book.likes.includes(user._id) ? IconTypeEnum.solid : IconTypeEnum.light}
											intent={user && book.likes.includes(user._id) ? 'danger' : 'none'}
										/>
										<strong>{book.likes.length}</strong>&nbsp;
										<span className='hidden-sm'>Like{book.likes.length !== 1 ? 's' : ''}</span>
									</li>
									<li
										className='sb_social_action'
										onClick={() => alert('Clicked on adding to my shelf!')}
									>
										<Icon
											icon='fa-books'
										/>
									</li>
									<li
										className={`sb_social_action ${user && user.readBooks.map(livre => livre._id).includes(book._id) ? 'sb_social_selected' : ''}`}
										onClick={() => {
											engagePrecheck(book, true, (err) => {
												if (err) {
													return;
												}
												toggleUserBook(book._id, 'readBooks', user && user.readBooks.map(livre => livre._id).includes(book._id) ? 'remove' : 'add').then(
													() => console.log(''),
													() => console.log('')
												)
											})
										}}
									>
										<Icon
											icon='fa-bookmark'
										/>
										{(user && user.readBooks.map(livre => livre._id).includes(book._id)) && (
											<>
												<span>Read</span>
												<span>Jun. 2007</span>
											</>	
										)}
									</li>
								</ul>
								<ul className='sb_top_actions'>
									<li
										className='sb_social_action'
									>
										<Icon icon='fa-shopping-cart' />
									</li>
									<li
										className='sb_social_action'
									>
										<Icon icon='fa-share-all' />
									</li>
									<li
										className='sb_social_action'
									>
										<Icon icon='fa-flag' />
									</li>
								</ul>

							</div>
						</div>

						
					</div>
					<div className='sb_title_wrapper'>
						<div className='container'>
							<div className='sb_title_container'>
								<h4>
									<strong>{title}</strong>
									{book.subtitle && <small>{book.subtitle}</small>}
								</h4>
								{getAuthorName(book) && <p className='description'>By {getAuthorName(book)}</p>}
							</div>
						</div>
					</div>

					<div className='sb_topics_wrapper'>
						<div className='container'>
							<PageTopics
								topics={book.topics}
								topicClick={clickTopic}
								addTopics={addTopics}
								user={user}
							/>
						</div>
					</div>

					
				</header>
				<nav className='sb_nav_wrapper'>
					<div className='container'>
						

						<div className='sb_nav_container'>
							<div className='sb_nav_cta_wrapper'>
								<div className='sb_nav_cta_container'>
									<span className='sb_nav_cta'>
										<Icon icon='fa-books-medical' />
										<span>Add To Shelf</span>
									</span>
								</div>
							</div>							
							<ul
								className='sb_nav_tabs'
							>
								{pageTabs.map((page, i) => {
									return (
										<li
											key={i}
											className={`sb_nav_tab ${i === activeTab ? 'sb_nav_tab_active' : ''}`}
											onClick={() => setActiveTab(i)}
										>
											<Icon icon={page.icon} />
											<span>{page.title}</span>
										</li>
									);
								})}
							</ul>
						</div>

					</div>
				</nav>
				<Display { ...pageTabs[activeTab].props } />
		</section>
	);
}

export default singleBook;

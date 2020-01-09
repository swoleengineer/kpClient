import React, { useState, createRef } from 'react';
import { InputGroup, Button } from '@blueprintjs/core';
import Topic from '../../../../topic';
import Icon, { IconTypeEnum } from '../../../../icons';
import { ITopicBodyObj, ITopic } from '../../../../../state-management/models';
import { keenToaster } from '../../../../../containers/switcher';
import AddTopicBtn from './addTopicBtn';

interface IProps {
  topics: Array<ITopicBodyObj>;
  topicClick: Function;
  addTopics: Function;
  user?: any;

}
const sectionTopics = (props: IProps) => {
  const { topics, topicClick, user = undefined, addTopics = x => null } = props;

  const [topicFilter, setTopicFilter] = useState<string>('');
  const [addingTopic, setAddingTopic] = useState<boolean>(false);
	const [topicsToAdd, adjustTopics] = useState<ITopic[]>([]);
	const [visibleTopics, setVisibleTopics] = useState<number>(3);

  const topicsToShow = topics.filter((tp) => {
		
		if (!topicFilter || !topicFilter.length) {
			return true;
		}
		if (!tp || !tp.topic || !tp.topic.name) {
			return false;
		}
		const { topic: { name }} = tp;
		return name.toLowerCase().includes(topicFilter.toLowerCase());
  }).filter((tp, i) => {
		if (i + 1 > visibleTopics) {
			return false;
		}
		return true;
	});
  const topicFormRef = createRef();
  const newTopicClick = (topicId: string) => adjustTopics(topicsToAdd.filter(skill => skill._id !== topicId))
  return (
    <div className='sb_topics_container'>
			<div className='sb_topics_header'>
				<div className='sb_topics_header_text'>
					<strong>{topics.length}</strong> <span>Topic{topics.length !== 1 ? 's' : ''}</span>
				</div>
        <div className='sb_topics_header_filter_wrapper'>
					<InputGroup
						small={true}
						leftIcon={<span className='bp3-icon'><Icon icon='fa-search' style={{ position: 'relative', top: '-3px'}} /></span>}
						fill={true}
						placeholder='Filter'
						onKeyUp={e => {
							const value = e.target.value;
							setTopicFilter(value);
						}}
						rightElement={topicFilter.length > 0
							? <Button style={{ color: 'white' }} disabled={true} minimal={true} icon={<Icon icon='fa-head-side-brain' />} text={topicsToShow.length} />
							: undefined}
					/>
				</div>
			</div>
			<div
				className='sb_topics_horizontal'
			>
				{topicsToShow.map((topic, i) => {
          return (!topic || !topic.topic || !topic.topic.name)
          ? null
          : (
              <Topic
                topicBody={topic}
                key={topic._id}
                interactive={true}
                topicSize='smallTopic'
                minimal={false}
                selected={(user && (typeof topic.agreed[0] === 'object' ? topic.agreed.filter(x => x).map(person => person._id).includes(user._id) : topic.agreed.includes(user._id)))}
                onClick={() => topicClick(topic._id)}
              />
					)
				})}
				{topicsToShow.length < topics.length && (
					<span
						className='kp_fake_topic_btn kp_fake_topic_btn_minimal'
						onClick={() => setVisibleTopics(visibleTopics + 5)}
					>
						{topics.length - topicsToShow.length}	More...
					</span> 
				)}

				{topicsToAdd.map((topic, i) => {
          return (!topic || !topic.name)
            ? null
            : (
								<Topic
									key={i}
									interactive={true}
									onClick={() => newTopicClick(topic._id)}
									skill={topic}
									topicSize='smallTopic'
									minimal={true}
									removable={true}
								/>
							)
				})}
				<div 
					style={{
						display: (addingTopic || topicsToAdd.length > 0) ? 'flex' : 'block'
					}}
				>
					<AddTopicBtn
						ref={topicFormRef}
						setIsActive={setAddingTopic}
						processNewItem={topic => {
							if (topicsToAdd.length > 9 && topicsToAdd.findIndex(skill => skill.name === topic.name) < 0) {
								keenToaster.show({
									message: '10 topics max at a time please.',
									icon: 'info-sign'
								});
								return;
							}
							if (topics.filter(tpc => tpc.topic && tpc.topic.name).map(tpc => tpc.topic._id).includes(topic._id)) {
								keenToaster.show({
									message: `${topic.name} already in this book.`,
									icon: 'error'
								})
								return;
							}
							adjustTopics(topicsToAdd.filter(skill => skill.name !== topic.name).concat(topic))}
						}
						processRemove={() => console.log('removed topic')}
					/>
					{(addingTopic || topicsToAdd.length > 0) && (
						<span
							className={`kp_fake_topic_btn btn_side ${topicsToAdd.length > 0 ? 'kp_fake_topic_btn_active' : ''}`}
							onClick={() => {
								if (topicsToAdd.length > 0) {
                  addTopics(topicsToAdd);
                  adjustTopics([]);
									return;
								}
								if (!topicFormRef || !topicFormRef.current || (!topicFormRef.current.toggleEdit || typeof topicFormRef.current.toggleEdit !== 'function')) {
									alert('Cannot access form from ref!');
									return;
								}
								topicFormRef.current.toggleEdit();
							}}
						>
							{topicsToAdd.length > 0 && (
								<span className='kp_fake_topic_btn_count'>{topicsToAdd.length}</span>
							)}
							<Icon icon={`fa-${topicsToAdd.length > 0 ? 'check' : 'times'}`} type={IconTypeEnum.light} />
						</span>
					)}
				</div>
      </div>
    </div>
  );
}

export default sectionTopics;

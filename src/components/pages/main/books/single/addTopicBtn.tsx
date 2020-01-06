import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import TopicBrowse from '../../../auth/topic/topicBrowse';
import Icon, { IconTypeEnum } from '../../../../icons';

interface IProps {
	processNewItem: Function;
	processRemove: Function;
	setIsActive: Function;
}
const addTopicBtn = forwardRef((props: IProps, ref) => {
	const { processNewItem, processRemove, setIsActive } = props;
	const [browseMode, setBrowseMode] = useState<boolean>(false);

	useImperativeHandle(ref, () => ({
	toggleEdit: () => setBrowseMode(!browseMode)
	}));
	useEffect(() => setIsActive(browseMode), [browseMode]);
	if (!browseMode) {
		return (
			<div
				className='kp_fake_topic_wrapper'
				onClick={() => setBrowseMode(!browseMode)}
			>
				<div className='kp_fake_topic_container'>
					<Icon icon='fa-plus' type={IconTypeEnum.regular} />
					<span>Add Topic</span>
				</div>
			</div>
		);
	}
  return (
		<div
			className='kp_fake_topic_wrapper kp_fake_topic_active'
		>
			<div className='kp_real_topic_container'>
				<TopicBrowse
					autoOpen={true}
					placeholder='Type here'
					btnClick={() => setBrowseMode(false)}
					large={false}
					processNewItem={(topic, event) => {
						processNewItem(topic);
						setBrowseMode(false);
					}}
					processRemove={() => console.log('removed topic')}
				/>
			</div>
		</div>
	);

});

export default addTopicBtn;

import React from 'react';

interface IProps {
  children: any;
  title?: any;
  style?: any
}
const contentCard = (props: IProps) => {
  const { children, title = '', style} = props;
  return (
    <div className='kp_sidebar_widget_wrapper'>
			<div className='kp_sidebar_widget_container'>
        {title.length > 0 && (
          <header className='kp_sidebar_widget_header'>
            <span className='kp_sidebar_widget_title'>
              {title}
            </span>
          </header>
        )}
				<div className='kp_sidebar_widget_content_wrapper'>
					<div className='kp_sidebar_widget_content_container'>
            {children}			
					</div>
				</div>
			</div>
		</div>
  );
}

export default contentCard;

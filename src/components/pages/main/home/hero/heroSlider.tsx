import React from 'react';
import Slider from 'react-slick';
import SLIDE000 from '../../../../../assets/hero_004.png';
import IMG1 from '../../../../../assets/hero_tpl_001.png';
import KeenIcon from '../../../../icons';
import { AuthModalTypes } from '../../../../../state-management/models';
import { showAuthModal } from '../../../../../state-management/thunks';

interface ISlideAction {
  text: any;
  onClick: Function;
}

interface ISlide {
  titleText: any;
  descText: string;
  img: any;
  primaryAction?: ISlideAction;
  secondaryAction?: ISlideAction;
  actionVisibility: boolean;
}
const heroSlider = ({ loggedIn }) => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  }
  const slides: Array<ISlide> = [{
    titleText: <>Level Up</>,
    descText: 'Track your growth and see yourself leveling thru stats.',
    img: IMG1,
    actionVisibility: !loggedIn,
    primaryAction: {
      text: <>Log In  <KeenIcon icon='fa-sign-in' color={true} /></>,
      onClick: () => showAuthModal(AuthModalTypes.login)
    },
    secondaryAction: {
      text: <>Register <KeenIcon icon='fa-user-edit' color={true} /></>,
      onClick: () => showAuthModal(AuthModalTypes.register)
    }
  }, {
    titleText: 'Library',
    descText: 'Organize your library through lists, topics, and comments',
    img: IMG1,
    actionVisibility: !loggedIn,
    primaryAction: {
      text: <>Log In  <KeenIcon icon='fa-sign-in' color={true} /></>,
      onClick: () => showAuthModal(AuthModalTypes.login)
    },
    secondaryAction: {
      text: <>Register <KeenIcon icon='fa-user-edit' color={true} /></>,
      onClick: () => showAuthModal(AuthModalTypes.register)
    }
  }, {
    titleText: 'Questions',
    descText: 'Get suggestions for books/topics you want to learn about.. help others.',
    img: IMG1,
    actionVisibility: !loggedIn,
    primaryAction: {
      text: <>Log In  <KeenIcon icon='fa-sign-in' color={true} /></>,
      onClick: () => showAuthModal(AuthModalTypes.login)
    },
    secondaryAction: {
      text: <>Register <KeenIcon icon='fa-user-edit' color={true} /></>,
      onClick: () => showAuthModal(AuthModalTypes.register)
    }
  }]
  return (
    <div className='heroSliderWrapper' style={{ backgroundImage: `url(${SLIDE000})`}}>
      <Slider
        {...sliderSettings}
        autoplay={false}
        speed={800}
        autoplaySpeed={8000}
        lazyLoad='progressive'
        // fade={true}
        arrows={false}
        className='heroSliderStyle'
      >
        {slides.map((slide, i) => (
          <div key={i}>
            <div className='heroSlider_slide'>
              <div className='container'>
                <div className='heroSlider_content_container'>
                  <div className='heroSlider_content_text'>
                    <h2 className='hero_slider_title'>{slide.titleText}</h2>
                    <p className='heroSlider_desc'>{slide.descText}</p>
                    {slide.actionVisibility && (
                      <div className='heroSlider_actions'>
                        {slide.primaryAction && (
                          <button className='heroSlider_actions_primary' onClick={() => slide.primaryAction.onClick()}>{slide.primaryAction.text}</button>
                        )}
                        {slide.secondaryAction && (
                          <button className='heroSlider_actions_secondary' onClick={() => slide.secondaryAction.onClick()}>{slide.secondaryAction.text}</button>
                        )}
                      </div>
                    )}
                  </div>
                  <div className='heroSlider_content_img'>
                    <img src={IMG1} alt='omage' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default heroSlider;

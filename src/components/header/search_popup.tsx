import React, { useState, useEffect } from 'react';
import { InputGroup } from '@blueprintjs/core';
import { useDispatch } from 'react-redux';

import Icon, { IconTypeEnum } from '../icons';
import { appActionTypes } from '../../state-management/actions';
import { debounce } from 'lodash'


interface IProps {
  searchText: string;
  performSearch: Function;
}
const searchPopup = (props: IProps) => {
  const { searchText, performSearch } = props;
  const [active, setActive] = useState<boolean>(false);
  const dispatch = useDispatch();
  const setSearchText = payload => dispatch({ type: appActionTypes.updateSearchText, payload });
  
  let timer;

  useEffect(() => {
    if (!active) {
      return;
    }
    timer = setTimeout(() => {
      (() => {
        if (!searchText || !searchText.trim().length && active) {
          setSearchText(' ');
        }
      })();
    }, 1750);
  }, [active])
  
  return (
    <div
      className={`kp_search_popup_wrapper ${active ? 'kp_search_popup_wrapper_active' : ''}`}
    >
      {!active && (
        <span
          className='kp_search_popup kp_search_popup_inactive'
          onClick={() => setActive(true)}
        >
          <Icon icon='fa-search' />
          <span className='kp_search_popup_text'>
            Search Keenpages
          </span>
        </span>
      )}
      {active && (
        <div className='kp_search_popup'>
          <InputGroup
            onKeyUp={$event => {
              if ($event.keyCode === 13) {
                performSearch();
              }
            }}
            rightElement={searchText.length > 0 ? (
              <>
                <span
                  className='kp_search_popup_inner_btn'
                  onClick={() => {
                    setActive(false);
                    setSearchText('');
                    clearTimeout(timer)
                  }}
                >
                  <Icon icon='fa-times' type={IconTypeEnum.regular} />
                </span>
              </>
            ) : undefined}
            className='kp_search_popup_input'
            inputRef={input => {
              if (input && active) {
                input.focus();
              }
            }}
            placeholder='Type here'
            onChange={e => {
              const val = e.target.value || '';
              setSearchText(val.length > 1 && val.charAt(0) === ' ' ? val.trim() : val);
            }}
            value={searchText}
          />
          {searchText.length < 1 && (
            <span
              className='kp_search_popup_btn'
              onClick={() => {
                setActive(false);
                setSearchText('');
                clearTimeout(timer)
              }}
            >
              <Icon icon='fa-times' type={IconTypeEnum.regular} />
            </span>
          )}
          
          {searchText.length > 0 && (
            <span
              className='kp_search_popup_btn popup_btn_primary'
            >
              <Icon icon='fa-search' type={IconTypeEnum.regular} />
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default searchPopup;

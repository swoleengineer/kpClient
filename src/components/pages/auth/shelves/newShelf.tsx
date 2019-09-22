import React, { useState } from 'react';
import { InputGroup, Button } from '@blueprintjs/core';
import Icon from '../../../icons';
import { createNewShelf } from '../../../../state-management/thunks';

const newShelf = (props: {
  goToNext: boolean;
  nextPayload?: {
    type: string;
    payload?: any;
  };
  callBack?: Function;
}) => {
  const [propError, setError] = useState<string>('')
  const [shelfTitle, setTitle] = useState<string>('')
  const { callBack } = props;
  const processNewShelf = () => {
    if (!shelfTitle.length) {
      console.log('There is no title');
      return;
    }
    createNewShelf(shelfTitle).then(
      () => callBack(),
      (err) => {
        let message;
        console.error(err)
        try {
          message = err.response.data.message
        } catch {
          message = 'Could not create shelf';
        }
        setError(message);
      }
      
    )
  }
  return (
    <>
      {propError.length > 0 && <div style={{ color: '#c23030'}}>
        <p>{propError}</p>
      </div>}

      <div>
        <InputGroup
          fill={true}
          placeholder='New Shelf Name'
          rightElement={(
            <Button
              icon={<Icon icon='fa-check' />}
              minimal={true}
              onClick={() => processNewShelf()}
            />
          )}
          large={true}
          value={shelfTitle}
          onChange={$e => setTitle($e.target.value)}
          onKeyUp={$e => {
            const value = $e.target.value;
            setTitle(value);
            if ($e.keyCode === 13) {
              processNewShelf();
            }
          }}
        />
      </div>
    </>
  );
}

export default newShelf;

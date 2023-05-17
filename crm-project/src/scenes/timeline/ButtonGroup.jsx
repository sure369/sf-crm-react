import React from 'react';
import { Button } from '@mui/material';

const ButtonGroup = ({ buttons, highlightedButton, onButtonClick }) => {

  return (
    <div style={{ display: 'flex' }}>
      {buttons.map((button) => (
        <Button
          key={button.id}
          variant={button === highlightedButton ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => onButtonClick(button)}
          style={{ marginRight: '10px' }}
        >
          {button.value}
        </Button>
      ))}
    </div>
  );
};

export default ButtonGroup;

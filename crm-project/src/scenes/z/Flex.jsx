import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import AccountDetailPage from '../recordDetailPage/AccountDetailPage';
import EventForm from '../formik/EventForm';
import AccountForm from '../formik/AccountForm';

function Item(props) {
    console.log('props',props)
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        p: 1,
        m: 1,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : 'grey.100'),
        color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
        border: '1px solid',
        borderColor: (theme) =>
          theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
        borderRadius: 2,
        fontSize: '0.875rem',
        fontWeight: '700',
        ...sx,
      }}
      {...other}
    />
  );
}

Item.propTypes = {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
    ),
    PropTypes.func,
    PropTypes.object,
  ]),
};

export default function FlexShrink() {
  return (
    <div style={{ width: '100%' }}>
      <Box
        sx={{ display: 'flex', p: 1, bgcolor: 'background.paper', borderRadius: 1 }}
      >
      {/* <AccountDetailPage item={undefined} /> */}
      {/* <AccountForm/> */}
      <Item sx={{ width: '100%' }}><AccountForm/></Item>
        <Item sx={{ flexShrink: 1 }}><EventForm/></Item>
      </Box>
    </div>
  );
}
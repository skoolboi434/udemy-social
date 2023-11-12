import React from 'react';
import Page from './Page';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Page title='Not Found'>
      <div className='text-center'>
        <h2>Post cannot be found.</h2>
        <p className='lead text-muted'>
          You can always visit the <Link to='/'>homepage</Link> to get a fresh start.
        </p>
      </div>
    </Page>
  );
};

export default NotFound;

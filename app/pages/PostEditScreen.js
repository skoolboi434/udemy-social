import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Page from '../components/Page';
import Axios from 'axios';
import Loader from '../components/Loader';
import { useImmerReducer } from 'use-immer';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';
import NotFound from '../components/NotFound';

const PostEditScreen = () => {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const navigate = useNavigate();

  const originalState = {
    title: {
      value: '',
      hasErrors: false,
      message: ''
    },
    body: {
      value: '',
      hasErrors: false,
      message: ''
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false
  };

  const ourReducer = (draft, action) => {
    switch (action.type) {
      case 'fetchComplete':
        draft.title.value = action.value.title;
        draft.body.value = action.value.body;
        draft.isFetching = false;
        return;
      case 'titleChange':
        draft.title.value = action.value;
        draft.title.hasErrors = false;
        return;
      case 'titleRules':
        if (!action.value.trim()) {
          draft.title.hasErrors = true;
          draft.title.message = 'You must provide a title.';
        }
        return;
      case 'bodyChange':
        draft.body.value = action.value;
        draft.body.hasErrors = false;
        return;
      case 'bodyRules':
        if (!action.value.trim()) {
          draft.title.hasErrors = true;
          draft.title.message = 'You must provide a body.';
        }
        return;
      case 'submitRequest':
        if (!draft.title.hasErrors && !draft.body.hasErrors) {
          draft.sendCount++;
        }
        return;
      case 'saveRequestStarted':
        draft.isSaving = true;
        return;
      case 'saveRequestFinished':
        draft.isSaving = false;
        return;
      case 'notFound':
        draft.notFound = true;
        return;
    }
  };

  const [state, dispatch] = useImmerReducer(ourReducer, originalState);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function fetchPost() {
      try {
        const res = await Axios.get(`/post/${state.id}`, { cancelToken: ourRequest.token });
        if (res.data) {
          dispatch({ type: 'fetchComplete', value: res.data });
          if (appState.user.username != res.data.author.username) {
            appDispatch({ type: 'flashMessage', value: 'You do not have permission to edit this post.' });
            navigate('/');
          }
        } else {
          dispatch({ type: 'notFound' });
        }
      } catch (error) {
        console.log('There was a problem or the request was canceled.');
      }
    }
    fetchPost();
    return () => {
      ourRequest.cancel();
    };
  }, []);

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: 'saveRequestStarted' });
      const ourRequest = Axios.CancelToken.source();
      async function fetchPost() {
        try {
          const res = await Axios.post(`/post/${state.id}/edit`, { title: state.title.value, body: state.body.value, token: appState.user.token }, { cancelToken: ourRequest.token });
          dispatch({ type: 'saveRequestFinished' });
          appDispatch({ type: 'flashMessage', value: 'Post was updated.' });
          navigate(`/post/${state.id}`);
        } catch (error) {
          console.log('There was a problem or the request was canceled.');
        }
      }
      fetchPost();
      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.sendCount]);

  const handleSubmit = e => {
    e.preventDefault();
    dispatch({ type: 'titleRules', value: state.title.value });
    dispatch({ type: 'bodyRules', value: state.body.value });
    dispatch({ type: 'submitRequest' });
  };

  if (state.notFound) {
    return <NotFound />;
  }

  if (state.isFetching) {
    return (
      <Page title='...'>
        <Loader />
      </Page>
    );
  }

  return (
    <Page title='Edit Post'>
      <Link to={`/post/${state.id}`} className='small font-weight-bold'>
        &laquo; Back to Post
      </Link>
      <form onSubmit={handleSubmit} className='mt-3'>
        <div className='form-group'>
          <label htmlFor='post-title' className='text-muted mb-1'>
            <small>Title</small>
          </label>
          <input onChange={e => dispatch({ type: 'titleChange', value: e.target.value })} onBlur={e => dispatch({ type: 'titleRules', value: e.target.value })} autoFocus name='title' id='post-title' className='form-control form-control-lg form-control-title' type='text' placeholder='' autoComplete='off' value={state.title.value} />
          {state.title.hasErrors && <div className='alert alert-danger small liveValidateMessage'>{state.title.message}</div>}
        </div>

        <div className='form-group'>
          <label htmlFor='post-body' className='text-muted mb-1 d-block'>
            <small>Body Content</small>
          </label>
          <textarea onBlur={e => dispatch({ type: 'bodyRules', value: e.target.value })} onChange={e => dispatch({ type: 'bodyChange', value: e.target.value })} name='body' id='post-body' className='body-content tall-textarea form-control' type='text' value={state.body.value} />
          {state.body.hasErrors && <div className='alert alert-danger small liveValidateMessage'>{state.body.message}</div>}
        </div>

        <button className='btn btn-primary' disabled={state.isSaving}>
          Update Post
        </button>
      </form>
    </Page>
  );
};

export default PostEditScreen;

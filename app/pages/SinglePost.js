import React, { useEffect, useState, useContext } from 'react';
import Page from '../components/Page';
import Axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import ReactMarkDown from 'react-markdown';
import { Tooltip } from 'react-tooltip';
import NotFound from '../components/NotFound';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';

const SinglePost = () => {
  const { id } = useParams();
  const [isloading, setIsLoading] = useState(true);
  const [post, setPost] = useState([]);

  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const navigate = useNavigate();

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function fetchPost() {
      try {
        const res = await Axios.get(`/post/${id}`, { cancelToken: ourRequest.token });
        setPost(res.data);
        setIsLoading(false);
      } catch (error) {
        console.log('There was a problem or the request was canceled.');
      }
    }
    fetchPost();
    return () => {
      ourRequest.cancel();
    };
  }, [id]);

  if (!isloading && !post) {
    return <NotFound />;
  }

  if (isloading) {
    return (
      <Page title='...'>
        <Loader />
      </Page>
    );
  }

  const date = new Date(post.createdDate);
  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

  const isOwner = () => {
    if (appState.loggedIn) {
      return appState.user.username == post.author.username;
    }
    return false;
  };

  const deleteHandler = async () => {
    const areYouSure = window.confirm('Are you sure you want to delete this post?');

    if (areYouSure) {
      try {
        const res = await Axios.delete(`/post/${id}`, { data: { token: appState.user.token } });

        if (res.data == 'Success') {
          // 1. Display flash message
          appDispatch({ type: 'flashMessage', value: 'Post was successfully deleted.' });

          // 2. Redirect back to current user's profile
          navigate(`/profile/${appState.user.username}`);
        }
      } catch (error) {
        console.log('There was a problem.');
      }
    }
  };

  return (
    <Page title={post.title}>
      <div className='d-flex justify-content-between'>
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className='pt-2'>
            <Link to={`/post/${id}/edit`} data-tooltip-content='Edit' data-tooltip-id='edit' className='text-primary mr-2'>
              <i className='fas fa-edit'></i>
            </Link>
            <Tooltip id='edit' className='custom-tooltip' />{' '}
            <Link onClick={deleteHandler} className='delete-post-button text-danger' data-tooltip-content='Delete' data-tooltip-id='delete'>
              <i className='fas fa-trash'></i>
            </Link>
            <Tooltip className='custom-tooltip' id='delete' />
          </span>
        )}
      </div>

      <p className='text-muted small mb-4'>
        <Link to={`/profile/${post.author.username}`}>
          <img className='avatar-tiny' src={post.author.avatar} />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {dateFormatted}
      </p>

      <div className='body-content'>
        <ReactMarkDown children={post.body} allowedElements={['p', 'br', 'strong', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li']} />
      </div>
    </Page>
  );
};

export default SinglePost;

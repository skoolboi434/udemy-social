import React, { useEffect, useState } from 'react';
import Page from '../components/Page';
import Axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Loader from '../components/Loader';
import ReactMarkDown from 'react-markdown';

const SinglePost = () => {
  const { id } = useParams();
  const [isloading, setIsLoading] = useState(true);
  const [post, setPost] = useState([]);

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
  }, []);

  if (isloading) {
    return (
      <Page title='...'>
        <Loader />
      </Page>
    );
  }

  const date = new Date(post.createdDate);
  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

  return (
    <Page title={post.title}>
      <div className='d-flex justify-content-between'>
        <h2>{post.title}</h2>
        <span className='pt-2'>
          <Link to='#' className='text-primary mr-2' title='Edit'>
            <i className='fas fa-edit'></i>
          </Link>
          <a className='delete-post-button text-danger' title='Delete'>
            <i className='fas fa-trash'></i>
          </a>
        </span>
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

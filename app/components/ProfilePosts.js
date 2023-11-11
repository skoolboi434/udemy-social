import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Loader from './Loader';

const ProfilePosts = () => {
  const { username } = useParams();
  const [isloading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function fetchPosts() {
      try {
        const res = await Axios.get(`/profile/${username}/posts`, { cancelToken: ourRequest.token });
        setPosts(res.data);
        setIsLoading(false);
      } catch (error) {
        console.log('There was a problem');
      }
    }
    fetchPosts();
    return () => {
      ourRequest.cancel();
    };
  }, []);

  if (isloading) {
    return <Loader />;
  }

  return (
    <div className='list-group'>
      {posts.map(post => {
        const date = new Date(post.createdDate);
        const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        return (
          <Link key={post._id} to={`/post/${post._id}`} className='list-group-item list-group-item-action'>
            <img className='avatar-tiny' src={post.author.avatar} /> <strong>{post.title} </strong>
            <span className='text-muted small'>on {dateFormatted} </span>
          </Link>
        );
      })}
    </div>
  );
};

export default ProfilePosts;

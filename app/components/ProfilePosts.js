import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Loader from './Loader';
import Post from './Post';

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
  }, [username]);

  if (isloading) {
    return <Loader />;
  }

  return (
    <div className='list-group'>
      {posts.map(post => {
        return <Post key={post._id} post={post} noAuthor={true} />;
      })}
    </div>
  );
};

export default ProfilePosts;

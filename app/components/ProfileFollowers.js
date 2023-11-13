import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Loader from './Loader';

const ProfileFollowers = () => {
  const { username } = useParams();
  const [isloading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function fetchPosts() {
      try {
        const res = await Axios.get(`/profile/${username}/followers`, { cancelToken: ourRequest.token });
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
      {posts.map((follower, index) => {
        return (
          <Link key={index} to={`/profile/${follower.username}`} className='list-group-item list-group-item-action'>
            <img className='avatar-tiny' src={follower.avatar} /> {follower.username}
          </Link>
        );
      })}
    </div>
  );
};

export default ProfileFollowers;

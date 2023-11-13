import React, { useEffect, useContext, useState } from 'react';
import { useParams, NavLink, Routes, Route } from 'react-router-dom';
import Page from '../components/Page';
import StateContext from '../StateContext';
import Axios from 'axios';
import ProfilePosts from '../components/ProfilePosts';
import ProfileFollowers from '../components/ProfileFollowers';
import ProfileFollowing from '../components/ProfileFollowing';
import { useImmer } from 'use-immer';

const ProfileScreen = () => {
  const { username } = useParams();
  const appState = useContext(StateContext);

  const [state, setState] = useImmer({
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      profileUsername: '...',
      profileAvatar: 'https://gravatar.com/avatar/placeholder?s=128',
      isFollowing: false,
      counts: { postCount: '', followerCount: '', followingCount: '' }
    }
  });

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();
    async function fetchData() {
      try {
        const res = await Axios.post(`/profile/${username}`, { token: appState.user.token }, { cancelToken: ourRequest.token });
        setState(draft => {
          draft.profileData = res.data;
        });
      } catch (error) {
        console.log('There was a problem');
      }
    }
    fetchData();
    return () => {
      ourRequest.cancel();
    };
  }, [username]);

  const startFollowing = () => {
    setState(draft => {
      draft.startFollowingRequestCount++;
    });
  };

  useEffect(() => {
    if (state.startFollowingRequestCount > 0) {
      setState(draft => {
        draft.followActionLoading = true;
      });
      const ourRequest = Axios.CancelToken.source();
      async function fetchData() {
        try {
          const res = await Axios.post(`/addFollow/${state.profileData.profileUsername}`, { token: appState.user.token }, { cancelToken: ourRequest.token });
          setState(draft => {
            draft.profileData.isFollowing = true;
            draft.profileData.counts.followerCount++;
            draft.followActionLoading = false;
          });
        } catch (error) {
          console.log('There was a problem');
        }
      }
      fetchData();
      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.startFollowingRequestCount]);

  const stopFollowing = () => {
    setState(draft => {
      draft.stopFollowingRequestCount++;
    });
  };

  useEffect(() => {
    if (state.stopFollowingRequestCount > 0) {
      setState(draft => {
        draft.followActionLoading = true;
      });
      const ourRequest = Axios.CancelToken.source();
      async function fetchData() {
        try {
          const res = await Axios.post(`/removeFollow/${state.profileData.profileUsername}`, { token: appState.user.token }, { cancelToken: ourRequest.token });
          setState(draft => {
            draft.profileData.isFollowing = false;
            draft.profileData.counts.followerCount--;
            draft.followActionLoading = false;
          });
        } catch (error) {
          console.log('There was a problem');
        }
      }
      fetchData();
      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.stopFollowingRequestCount]);

  return (
    <Page title={`User Profile - ${appState.user.username}`}>
      <h2>
        <img className='avatar-small' src={state.profileData.profileAvatar} /> {state.profileData.profileUsername}
        {appState.loggedIn && !state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != '...' && (
          <button disabled={state.followActionLoading} onClick={startFollowing} className='btn btn-primary btn-sm ml-2'>
            Follow <i className='fas fa-user-plus'></i>
          </button>
        )}
        {appState.loggedIn && state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != '...' && (
          <button disabled={state.followActionLoading} onClick={stopFollowing} className='btn btn-danger btn-sm ml-2'>
            Stop Following <i className='fas fa-user-times'></i>
          </button>
        )}
      </h2>
      <div className='profile-nav nav nav-tabs pt-2 mb-4'>
        <NavLink to='' end className='nav-item nav-link'>
          Posts: {state.profileData.counts.postCount}
        </NavLink>
        <NavLink to='followers' className='nav-item nav-link'>
          Followers: {state.profileData.counts.followerCount}
        </NavLink>
        <NavLink to='following' className='nav-item nav-link'>
          Following: {state.profileData.counts.followingCount}
        </NavLink>
      </div>

      <Routes>
        <Route path='' element={<ProfilePosts />} />
        <Route path='followers' element={<ProfileFollowers />} />
        <Route path='following' element={<ProfileFollowing />} />
      </Routes>
    </Page>
  );
};

export default ProfileScreen;

import Axios from 'axios';
import React, { useEffect, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useImmerReducer } from 'use-immer';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeGuests from './pages/HomeGuests';
import AboutPage from './pages/AboutPage';
import TermsPage from './pages/TermsPage';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost.js';
import SinglePost from './pages/SinglePost.js';
import FlashMessages from './components/FlashMessages';
import StateContext from './StateContext';
import DispatchContext from './DispatchContext';
import ProfileScreen from './pages/ProfileScreen';
import PostEditScreen from './pages/PostEditScreen';
import NotFound from './components/NotFound';
import Search from './components/Search.js';
import Chat from './components/Chat.js';

import { CSSTransition } from 'react-transition-group';

import Loader from './components/Loader';

Axios.defaults.baseURL = process.env.BACKENDURL || 'https://social-backend-8lgk.onrender.com';

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem('complexappToken')),
    flashMessages: [],
    user: {
      token: localStorage.getItem('complexappToken'),
      username: localStorage.getItem('complexappUsername'),
      avatar: localStorage.getItem('complexappAvatar')
    },
    isSearchOpen: false,
    isChatOpen: false,
    unreadChatCount: 0
  };

  const ourReducer = (draft, action) => {
    switch (action.type) {
      case 'login':
        draft.loggedIn = true;
        draft.user = action.data;
        return;
      case 'logout':
        draft.loggedIn = false;
        return;
      case 'flashMessage':
        draft.flashMessages.push(action.value);
        return;
      case 'openSearch':
        draft.isSearchOpen = true;
        return;
      case 'closeSearch':
        draft.isSearchOpen = false;
        return;
      case 'toggleChat':
        draft.isChatOpen = !draft.isChatOpen;
        return;
      case 'closeChat':
        draft.isChatOpen = false;
        return;
      case 'incrementUnreadChatCount':
        draft.unreadChatCount++;
        return;
      case 'clearUnreadChatCount':
        draft.unreadChatCount = 0;
        return;
    }
  };
  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem('complexappToken', state.user.token);
      localStorage.setItem('complexappUsername', state.user.username);
      localStorage.setItem('complexappAvatar', state.user.avatar);
    } else {
      localStorage.removeItem('complexappToken');
      localStorage.removeItem('complexappUsername');
      localStorage.removeItem('complexappAvatar');
    }
  }, [state.loggedIn]);

  useEffect(() => {
    if (state.requestCount) {
      const ourRequest = Axios.CancelToken.source();
      const fetchResults = async () => {
        try {
          const res = await Axios.post('/search', { searchTerm: state.searchTerm }, { cancelToken: ourRequest.token });
          setState(draft => {
            draft.results = res.data;
            draft.show = 'results';
          });
        } catch (error) {
          console.log('There was a problem or the request was canceled.');
        }
      };
      fetchResults();
      return () => ourRequest.cancel();
    }
  }, [state.requestCount]);

  // Check if token has expired or not on first render
  useEffect(() => {
    if (state.loggedIn) {
      const ourRequest = Axios.CancelToken.source();
      const fetchResults = async () => {
        try {
          const res = await Axios.post('/checkToken', { token: state.user.token }, { cancelToken: ourRequest.token });
          if (!res.data) {
            dispatch({ type: 'logout' });
            dispatch({ type: 'flashMessage', value: 'Your session has expired. Please log in again.' });
          }
        } catch (error) {
          console.log('There was a problem or the request was canceled.');
        }
      };
      fetchResults();
      return () => ourRequest.cancel();
    }
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path='/' exact={true} element={state.loggedIn ? <Home /> : <HomeGuests />} />
              <Route path='/about-us' element={<AboutPage />} />
              <Route path='/terms' element={<TermsPage />} />
              <Route path='/create-post' element={state.loggedIn ? <CreatePost /> : <HomeGuests />} />
              <Route path='/post/:id' element={state.loggedIn ? <SinglePost /> : <HomeGuests />} />
              <Route path='/post/:id/edit' element={state.loggedIn ? <PostEditScreen /> : <HomeGuests />} />
              <Route path='/profile/:username/*' element={state.loggedIn ? <ProfileScreen /> : <HomeGuests />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </Suspense>

          <CSSTransition timeout={330} in={state.isSearchOpen} classNames='search-overlay' unmountOnExit>
            <div className='search-overlay'>
              <Suspense fallback=''>
                <Search />
              </Suspense>
            </div>
          </CSSTransition>
          <Suspense fallback=''>{state.loggedIn && <Chat />}</Suspense>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.querySelector('#app')).render(<Main />);

if (module.hot) {
  module.hot.accept();
}

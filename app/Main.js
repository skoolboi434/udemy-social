import Axios from 'axios';
import React, { useState, useReducer, useEffect } from 'react';
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
import CreatePost from './pages/CreatePost';
import SinglePost from './pages/SinglePost';
import FlashMessages from './components/FlashMessages';
import StateContext from './StateContext';
import DispatchContext from './DispatchContext';
import ProfileScreen from './pages/ProfileScreen';
import PostEditScreen from './pages/PostEditScreen';
import NotFound from './components/NotFound';

Axios.defaults.baseURL = 'http://localhost:8080';

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem('complexappToken')),
    flashMessages: [],
    user: {
      token: localStorage.getItem('complexappToken'),
      username: localStorage.getItem('complexappUsername'),
      avatar: localStorage.getItem('complexappAvatar')
    }
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

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />

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

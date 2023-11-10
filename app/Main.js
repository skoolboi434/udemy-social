import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeGuests from './pages/HomeGuests';
import AboutPage from './pages/AboutPage';
import TermsPage from './pages/TermsPage';
import Home from './pages/Home';

function Main() {
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem('complexappToken')));
  return (
    <BrowserRouter>
      <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <Routes>
        <Route path='/' exact={true} element={loggedIn ? <Home /> : <HomeGuests />} />
        <Route path='/about-us' element={<AboutPage />} />
        <Route path='/terms' element={<TermsPage />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.querySelector('#app'));
root.render(<Main />);

if (module.hot) {
  module.hot.accept();
}

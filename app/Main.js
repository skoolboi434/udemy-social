import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeGuests from './pages/HomeGuests';
import AboutPage from './pages/AboutPage';
import TermsPage from './pages/TermsPage';

function Main() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' exact={true} element={<HomeGuests />} />
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

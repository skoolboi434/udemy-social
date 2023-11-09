import React from 'react';
import ReactDOM from 'react-dom/client';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeGuests from './components/HomeGuests';

function Main() {
  return (
    <>
      <Header />
      <HomeGuests />
      <Footer />
    </>
  );
}

const root = ReactDOM.createRoot(document.querySelector('#app'));
root.render(<Main />);

if (module.hot) {
  module.hot.accept();
}

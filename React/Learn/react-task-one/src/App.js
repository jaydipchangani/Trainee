import './component/ProfileCard.css';
import React from 'react';
import ProfileCard from './component/ProfileCard';

function App() {
  return (
    <>
    <h1 className='heading'>Our Prestigious Team</h1>
    <div className='mainComponent'>
      <ProfileCard />
      <ProfileCard />
      <ProfileCard />
    </div>
    </>
  );
}

export default App;

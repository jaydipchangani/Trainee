import './component/ProfileCard.css';
import React from 'react';
import ProfileCard from './component/ProfileCard';
import ClickExample from './component/ClickExample';
import InputExample from './component/InputExample';

function App() {
  return (
    <>
    <h1 className='heading'>Our Prestigious Team</h1>
    <div className='mainComponent'>
      <ProfileCard />
      <ProfileCard />
      <ProfileCard />
      <ClickExample/>
      <InputExample />

      </div>
    </>
  );
}

export default App;

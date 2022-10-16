import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventsTab from './components/EventsTab';
import FAQ from './components/FAQ';
import HomePage from './components/HomePage';
import Sponsors from './components/Sponsors';
import TeamAvishkar from './components/TeamAvishkar';
import ProfilePage from './components/Teams';

function Simplistic() {
  const [WhatToDisplay, setWhatToDisplay] = useState('Home');
  const router = useNavigate();

  function onCrossPress() {
    setWhatToDisplay('Home');
  }

  // eslint-disable-next-line default-case
  function onRedirectPress(event: any) {
    console.log(event);
    setWhatToDisplay(event.target.id);
  }

  function decide(s: string) {
    switch (s) {
      case 'Home':
        return <HomePage onRedirectPress={onRedirectPress} />;
      case 'Events':
        return <EventsTab defaultDepartment="null" onCrossPress={onCrossPress} />;
      case 'Sponsors':
        return <Sponsors onCrossPress={onCrossPress} />;
      case 'TeamAvishkar':
        return <TeamAvishkar onCrossPress={onCrossPress} />;
      case 'FAQ':
        return <FAQ />;
      case 'Profile':
        return (
          <ProfilePage
            onCrossPress={onCrossPress}
            onInvalidToken={() => setWhatToDisplay('Home')}
          />
        );
      default:
        break;
    }
  }

  useEffect(() => {
    const token = Cookies.get('token');
    const preference = sessionStorage.getItem('game');
    if (token !== undefined && preference !== 'false') {
      router('/game');
      return;
    }
  }, []);

  return (
    <>
      <div
        className="absolute bottom-5 left-5 text-white text-2xl font-pfeffer"
        onClick={() => {
          sessionStorage.setItem('game', 'true');
          router('/game');
        }}>
        Continue in MNNIT Game Campus
      </div>
      {decide(WhatToDisplay)}
    </>
  );
}

export default Simplistic;

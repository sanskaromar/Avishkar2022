/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect } from 'react';
import Phaser from 'phaser';
import { GameInstance, IonPhaser } from '@ion-phaser/react';
import { gameConfig } from './config';
import { EVENTS_NAME, TELEPORT_LOCATIONS } from './consts';
import InfoPrompt from '../components/InfoPrompt';
import AuthPrompt from '../components/AuthPrompt';
import MiniMap from '../components/MiniMap';
import { npcData } from './npcData';
import Map from '../components/Map';
import Info from '../components/Info';
import InteractPrompt from '../components/Interact';
import Computer from '../components/Computer';

function debounce(fn: Function, ms: number) {
  let timer: any;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn(fn, []);
    }, ms);
  };
}

interface Props {
  viewport: string;
}

function GameComponent(props: Props) {
  const { viewport } = props;
  const gameRef = useRef(null);
  // Call `setInitialize` when you want to initialize your game! :)
  const [initialize, setInitialize] = useState(false);
  const [game, setGame] = useState<GameInstance>();
  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth
  });
  const destroy = () => {
    if (gameRef.current) {
      (gameRef.current as any).destroy();
    }
    setInitialize(false);
    setGame(undefined);
  };

  // Game States
  const [showInfoPrompt, setShowInfoPrompt] = useState(false);
  const [showInteractPrompt, setShowInteractPrompt] = useState(false);
  const [stopInteract, setStopInteract] = useState(false);
  const [infoPromptText, setInfoPromptText] = useState('');
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showComputer, setShowComputer] = useState(false);
  const [department, setDepartment] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0, rot: 0 });

  // Auto Initialize the game when the component is mounted
  // useEffect(() => {
  //   setInitialize(true);
  // }, []);

  useEffect(() => {
    if (game) {
      setTimeout(() => {
        // TODO: CHECK AUTH STATUS HERE
        const authenticated = false;
        if (authenticated) {
          game.instance?.events.emit(EVENTS_NAME.login);
        }
        game.instance?.events.on(EVENTS_NAME.infoPopup, (scene: string, gameObject: any) => {
          // console.log(gameObject.name);
          const key = scene + '-' + gameObject.name;
          // GET NPC DATA
          console.log(key);
          /* NICE 😈🥵6️⃣9️⃣ */
          const data = npcData[key];
          if (!data) {
            console.log('No data found for ' + key);
            return;
          }
          setInfoPromptText(data.text);
          setShowInfoPrompt(true);
        });
        game.instance?.events.on(EVENTS_NAME.interact, () => {
          setShowInteractPrompt(true);
          setStopInteract(false);
        });
        game.instance?.events.on(EVENTS_NAME.resetInteract, () => {
          // console.log('resetInteract', showInteractPrompt);
          if (showInteractPrompt) setStopInteract(true);
        });
        game.instance?.events.on(EVENTS_NAME.openComputer, (_department: string) => {
          setDepartment(_department);
          setShowComputer(true);
        });
        game.instance?.events.on(EVENTS_NAME.showAuth, () => {
          // console.log('show auth');
          setShowAuthPrompt(true);
          game.instance?.scene.pause('campus');
        });
        game.instance?.events.on(
          EVENTS_NAME.sendPlayerPosition,
          (
            playerX: any,
            playerY: any,
            worldWidth: any,
            worldHeight: any,
            velocityX: any,
            velocityY: any
          ) => {
            // console.log(playerX, playerY, worldWidth, worldHeight)
            const relativeX = (playerX / worldWidth) * 100;
            const relativeY = (playerY / worldHeight) * 100;
            const rotation = Math.atan2(velocityY, velocityX);
            // console.log(rotation, velocityX, velocityY);
            setPlayerPosition({ x: relativeX, y: relativeY, rot: rotation });
            // console.log(relativeX, relativeY);
          }
        );
        setInterval(() => {
          game.instance?.events.emit(EVENTS_NAME.getPlayerPosition);
        }, 100);
      }, 2500);
    }
  }, [game]);

  useEffect(() => {
    if (initialize) {
      setGame(Object.assign({}, gameConfig));
      // document.getElementById("canvas-div")?.appendChild(React.createElement(InfoPrompt));
    }
  }, [initialize]);

  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      });
      destroy();
    }, 1000);

    window.addEventListener('resize', debouncedHandleResize);

    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  });

  useEffect(() => {
    gameConfig.scale!.width = window.innerWidth;
    gameConfig.scale!.height = window.innerHeight;
    setInitialize(true);
  }, [dimensions]);

  const onAuthSuccess = () => {
    if (game) {
      game?.instance?.events.emit(EVENTS_NAME.login);
      game.instance?.scene.resume('campus');
      setTimeout(() => {
        setShowAuthPrompt(false);
      }, 1000);
    }
  };

  const closeAuthPrompt = () => {
    setShowAuthPrompt(false);
    if (game) game.instance?.scene.resume('campus');
  };

  const closeComputer = () => {
    setShowComputer(false);
  };

  const teleport = (location: TELEPORT_LOCATIONS) => {
    if (game) {
      game?.instance?.events.emit(EVENTS_NAME.teleport, location);
    }
  };

  const handleOnMapIconClick = () => {
    setShowMap(true);
  };
  const handleOnInfoIconClick = () => {
    setShowInfo(true);
  };

  return (
    <>
      <IonPhaser ref={gameRef} game={game} initialize={initialize} />
      <div className="absolute bottom-0 left-0 z-20 flex flex-col m-16 space-y-3">
        <div className="text-white">
          Dimensions : {dimensions.width} x {dimensions.height}
        </div>
        <button
          className="p-3 text-xl bg-gray-300 hover:bg-gray-400"
          onClick={() => setInitialize(true)}>
          Initialize game for {viewport}
        </button>
        <button
          className="p-3 text-xl bg-gray-300 hover:bg-gray-400"
          onClick={() => teleport(TELEPORT_LOCATIONS.cafe96)}>
          Teleport to Cafe96
        </button>
        <button className="p-3 text-xl bg-gray-300 hover:bg-gray-400" onClick={destroy}>
          Destroy
        </button>
      </div>
      {showAuthPrompt && (
        <AuthPrompt closePopup={closeAuthPrompt} authSuccessCallback={onAuthSuccess} />
      )}
      {showComputer && <Computer closePopup={closeComputer} department={department} />}
      {showInfoPrompt && (
        <InfoPrompt text={infoPromptText} setShowInfoPrompt={setShowInfoPrompt}></InfoPrompt>
      )}
      <MiniMap playerPosition={playerPosition} teleport={teleport} />
      {showMap && (
        <Map
          playerPosition={playerPosition}
          teleport={teleport}
          showMap={showMap}
          setShowMap={setShowMap}
        />
      )}
      {showInfo && <Info setShowInfo={setShowInfo} />}
      {showInteractPrompt && (
        <InteractPrompt
          stopInteract={stopInteract}
          setShowInteractPrompt={setShowInteractPrompt}
          setStopInteract={setStopInteract}
        />
      )}
      <img
        // eslint-disable-next-line no-undef
        src={require('../images/map-icon.png')}
        className={`absolute z-10 hover:scale-90 duration-200 transition ease-in-out right-2 bottom-[17.5rem] ${
          !showMap ? `cursor-zoom-in` : `cursor-zoom-out`
        }`}
        width={64}
        onClick={handleOnMapIconClick}
      />
      <img
        // eslint-disable-next-line no-undef
        src={require('../images/info-icon.png')}
        className={`absolute z-10 hover:scale-90 duration-200 transition ease-in-out right-20 bottom-[17.5rem] ${
          !showInfo ? `cursor-zoom-in` : `cursor-zoom-out`
        }`}
        width={64}
        onClick={handleOnInfoIconClick}
      />
    </>
  );
}

export default GameComponent;

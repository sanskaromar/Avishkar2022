import React, { useRef, useState, useEffect } from 'react';
// import Phaser from 'phaser';
import { IonPhaser } from '@ion-phaser/react';
import { gameConfig } from './config';

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

const game = gameConfig;

function GameComponent(props: Props) {
  const { viewport } = props;
  const gameRef = useRef(null);
  // Call `setInitialize` when you want to initialize your game! :)
  const [initialize, setInitialize] = useState(false);
  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth
  });
  const destroy = () => {
    if (gameRef.current) {
      (gameRef.current as any).destroy();
    }
    setInitialize(false);
  };

  // Auto Initialize the game when the component is mounted
  useEffect(() => {
    setInitialize(true);
  }, []);

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
    game.scale!.width = window.innerWidth;
    game.scale!.height = window.innerHeight;
    setInitialize(true);
  }, [dimensions]);

  return (
    <>
      <IonPhaser ref={gameRef} game={game} initialize={initialize} />
      <div className="flex flex-col absolute bottom-0 left-0 m-16 space-y-3 z-20">
        <div className="text-white">
          Dimensions : {dimensions.width} x {dimensions.height}
        </div>
        <button
          className="text-xl p-3 bg-gray-300 hover:bg-gray-400"
          onClick={() => setInitialize(true)}
        >
          Initialize game for {viewport}
        </button>
        <button className="text-xl p-3 bg-gray-300 hover:bg-gray-400" onClick={destroy}>
          Destroy
        </button>
      </div>
    </>
  );
}

export default GameComponent;
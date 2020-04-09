import Phaser from 'phaser';
import {InGame} from './in_game.js';

const config = {
  type: Phaser.CANVAS,
  parent: "game-page",
  backgroundColor: 0x75D5E3,
  physics:{
    default: 'matter',
    matter:{
      debug: {
        showBody: true,
        showStaticBody: true
      },
      debugBodyColor: 0x000000
    },
  },
  scale:{
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 720,
    height: 1280,
  },
  scene: InGame,
  audio: {
    disableWebAudio : true,
  }
};

const game = new Phaser.Game(config);

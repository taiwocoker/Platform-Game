/* eslint-disable import/no-cycle */
/* eslint-disable no-undef */
import 'phaser';
import Model from './Model';
import config from './Config/config';
import GameScene from './Scenes/GameScene';
import GameOverScene from './Scenes/GameOverScene';
import BootScene from './Scenes/BootScene';
import PreloaderScene from './Scenes/PreloaderScene';
import TitleScene from './Scenes/TitleScene';
import OptionsScene from './Scenes/OptionsScene';
import CreditsScene from './Scenes/CreditsScene';
import LeaderboardScene from './Scenes/LeaderboardScene';
import { setUser } from './user/user';
import './user/dom';

class Game extends Phaser.Game {
  constructor() {
    super(config);
    const model = new Model();
    this.globals = { model, bgMusic: null };
    this.scene.add('Boot', BootScene);
    this.scene.add('Preloader', PreloaderScene);
    this.scene.add('Title', TitleScene);
    this.scene.add('Options', OptionsScene);
    this.scene.add('Credits', CreditsScene);
    this.scene.add('Game', GameScene);
    this.scene.add('Leaderboard', LeaderboardScene);
    this.scene.add('GameOver', GameOverScene);
    this.scene.start('Boot');
  }
}


const startGame = (user) => {
  setUser(user);
  window.game = new Game();
};

export default startGame;

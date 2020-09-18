import 'phaser';
import config from '../config/config';
import Button from '../Objects/Button';
import { getScore, resetScore } from '../score/score';
import { postScore } from '../score/scoreApi';
import { getUser } from '../user/user';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  preload() {
    this.load.image("background", "../src/assets/forest-bg.png");
    
  }

  create() {
    // this.add.image("background", "../src/assets/forest-bg.png");
    this.add.image(750, 400,'background');

    this.title = this.add.text(0, 0, 'Game Over', { fontSize: '40px', fontStyle: 'bold', fill: '#fff' });
    this.score = this.add.text(0, 0, `Score: ${getScore()}`, { fontSize: '30px', fill: '#fff' });
    this.zone = this.add.zone(config.width / 2, config.height / 2, config.width, config.height);

    Phaser.Display.Align.In.Center(
      this.title,
      this.zone,
    );

    Phaser.Display.Align.In.Center(
      this.score,
      this.zone,
    );

    this.title.displayOriginY = 50;
    this.score.displayOriginY = -50;

    const user = getUser();
    const finalScore = getScore();

    postScore(user, finalScore);

    // this.menuButton = new Button(this, 400, 530, 'button1', 'button2', 'Menu', 'Title');
    this.menuButton = new Button(this, 400, 500, 'blueButton1', 'blueButton2', 'Menu', 'Title');

    resetScore();
  }
}
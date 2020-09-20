/* eslint-disable no-undef */
import 'phaser';
import config from '../Config/config';
import Button from '../Objects/Button';
import { getScores } from '../score/scoreApi';

export default class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super('Leaderboard');
  }

  preload() {
    this.load.image('background', '../src/assets/forest-bg.png');
  }

  create() {
    this.add.image(450, 400, 'background');

    this.title = this.add.text(0, 0, 'Scoreboard', {
      fontSize: '30px',
      fontStyle: 'bold',
      fill: '#fff',
    });
    this.zone = this.add.zone(
      config.width / 2,
      config.height / 2,
      config.width,
      config.height,
    );

    Phaser.Display.Align.In.Center(this.title, this.zone);

    this.title.displayOriginY = 280;

    getScores().then((scores) => {
      const arr = [];
      scores.map((user, i) => {
        arr.push(
          `${(i + 1).toString()}. ${
            user[0]
          }                      ${user[1].toString()}`,
        );
        return true;
      });

      const graphics = this.add.graphics();
      graphics.fillRect(235, 133, 320, 250);

      const mask = new Phaser.Display.Masks.GeometryMask(this, graphics);

      const text = this.add
        .text(250, 150, arr, {
          fontFamily: 'Arial',
          color: '#fff',
          wordWrap: { width: 310 },
        })
        .setOrigin(0);

      text.setMask(mask);


      const zone = this.add
        .zone(100, 300, 320, 256)
        .setOrigin(1)
        .setInteractive();

      zone.on('pointermove', (pointer) => {
        if (pointer.isDown) {
          text.y += pointer.velocity.y / 10;

          text.y = Phaser.Math.Clamp(text.y, -400, 300);
        }
      });
    });

    this.menuButton = new Button(
      this,
      400,
      530,
      'blueButton1',
      'blueButton2',
      'Menu',
      'Title',
    );
  }
}

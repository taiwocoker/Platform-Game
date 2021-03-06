/* eslint-disable no-undef,import/extensions */
import 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.load.image('logo', '../src/assets/ms_logo.png');
  }

  create() {
    this.scene.start('Preloader');
  }
}
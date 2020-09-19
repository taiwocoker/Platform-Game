import 'phaser';
 
export default {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 900,
  height: 800,
  backgroundColor: 0x34495e,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
};
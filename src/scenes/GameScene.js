import 'phaser';
import config from '../Config/config';

let game;
 
// global game options
let gameOptions = {
    platformSpeedRange: [300, 300],
    spawnRange: [80, 300],
    platformSizeRange: [90, 300],
    platformHeightRange: [-5, 10],
    platformHeighScale: 20,
    platformVerticalLimit: [0.4, 0.8],
    playerGravity: 900,
    jumpForce: 400,
    playerStartPosition: 200,
    jumps: 2,
    coinPercent: 25,
    firePercent: 25
}

export default class GameScene extends Phaser.Scene {
  constructor () {
    super('Game');
  }

  preload () {
    // load images
    this.load.image('platform', '../src/assets/ground.png');
    this.load.spritesheet('player', '../src/assets/player.png',{frameWidth: 24, frameHeight: 48});
    this.load.spritesheet("coin", "../src/assets/star.png", {
      frameWidth: 20,
      frameHeight: 20
  });
    this.load.spritesheet("fire", "../src/assets/fire.png", {
      frameWidth: 40,
      frameHeight: 70
});
  }

  create () {
    // keeping track of added platforms
    this.addedPlatforms = 0;

    this.platformGroup = this.add.group({
 
      // once a platform is removed, it's added to the pool
      removeCallback: function(platform){
          platform.scene.platformPool.add(platform)
      }
  });

  // pool
  this.platformPool = this.add.group({
 
    // once a platform is removed from the pool, it's added to the active platforms group
    removeCallback: function(platform){
        platform.scene.platformGroup.add(platform)
    }
});

// group with all active coins.
this.coinGroup = this.add.group({
 
  // once a coin is removed, it's added to the pool
  removeCallback: function(coin){
      coin.scene.coinPool.add(coin)
  }
});

// coin pool
this.coinPool = this.add.group({

  // once a coin is removed from the pool, it's added to the active coins group
  removeCallback: function(coin){
      coin.scene.coinGroup.add(coin)
  }
});

// / group with all active firecamps.
        this.fireGroup = this.add.group({
 
            // once a firecamp is removed, it's added to the pool
            removeCallback: function(fire){
                fire.scene.firePool.add(fire)
            }
        });
 
        // fire pool
        this.firePool = this.add.group({
 
            // once a fire is removed from the pool, it's added to the active fire group
            removeCallback: function(fire){
                fire.scene.fireGroup.add(fire)
            }
        });

// number of consecutive jumps made by the player
this.playerJumps = 0;
 
// adding a platform to the game, the arguments are platform width and x position
this.addPlatform(config.width, config.width / 2, config.height * gameOptions.platformVerticalLimit[1]);

// adding the player;
this.player = this.physics.add.sprite(gameOptions.playerStartPosition, config.height * 0.7, "player");
this.player.setGravityY(gameOptions.playerGravity);
this.player.setDepth(2);
 
// the player is not dying
this.dying = false;
// setting player animation
this.anims.create({
  key: "run",
  frames: this.anims.generateFrameNumbers("player", {
      start: 0,
      end: 1
  }),
  frameRate: 8,
  repeat: -1
});

// setting coin animation
this.anims.create({
  key: "rotate",
  frames: this.anims.generateFrameNumbers("coin", {
      start: 0,
      end: 5
  }),
  frameRate: 15,
  yoyo: true,
  repeat: -1
});

// setting fire animation
this.anims.create({
  key: "burn",
  frames: this.anims.generateFrameNumbers("fire", {
      start: 0,
      end: 4
  }),
  frameRate: 15,
  repeat: -1
});


// setting collisions between the player and the platform group
this.platformCollider = this.physics.add.collider(this.player, this.platformGroup,function(){

// play "run" animation if the player is on a platform
            if(!this.player.anims.isPlaying){
                this.player.anims.play("run");
            }
        }, null, this);

        // setting collisions between the player and the coin group
        this.physics.add.overlap(this.player, this.coinGroup, function(player, coin){
          this.tweens.add({
              targets: coin,
              y: coin.y - 100,
              alpha: 0,
              duration: 800,
              ease: "Cubic.easeOut",
              callbackScope: this,
              onComplete: function(){
                  this.coinGroup.killAndHide(coin);
                  this.coinGroup.remove(coin);
              }
          });
      }, null, this);

      // setting collisions between the player and the fire group
      this.physics.add.overlap(this.player, this.fireGroup, function(player, fire){
 
        this.dying = true;
        this.player.anims.stop();
        this.player.setFrame(2);
        this.player.body.setVelocityY(-200);
        this.physics.world.removeCollider(this.platformCollider);

    }, null, this);
 

// checking for input
this.input.on("pointerdown", this.jump, this);
}

// the core of the script: platform are added from the pool or created on the fly
addPlatform(platformWidth, posX, posY){
this.addedPlatforms++;
let platform;
if(this.platformPool.getLength()){
    platform = this.platformPool.getFirst();
    platform.x = posX;
    platform.y = posY;
    platform.active = true;
    platform.visible = true;
    this.platformPool.remove(platform);
    let newRatio =  platformWidth / platform.displayWidth;
    platform.displayWidth = platformWidth;
    platform.tileScaleX = 1 / platform.scaleX;
}
else{
  platform = this.add.tileSprite(posX, posY, platformWidth, 32, "platform");
  this.physics.add.existing(platform);
  platform.body.setImmovable(true);
  platform.body.setVelocityX(Phaser.Math.Between(gameOptions.platformSpeedRange[0], gameOptions.platformSpeedRange[1]) * -1);
  platform.setDepth(2);
  this.platformGroup.add(platform);
}
this.nextPlatformDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);

// is there a coin over the platform?
if(this.addedPlatforms > 1){
  if(Phaser.Math.Between(1, 100) <= gameOptions.coinPercent){
      if(this.coinPool.getLength()){
          let coin = this.coinPool.getFirst();
          coin.x = posX;
          coin.y = posY - 96;
          coin.alpha = 1;
          coin.active = true;
          coin.visible = true;
          this.coinPool.remove(coin);
      }
      else{
          let coin = this.physics.add.sprite(posX, posY - 96, "coin");
          coin.setImmovable(true);
          coin.setVelocityX(platform.body.velocity.x);
          coin.anims.play("rotate");
          coin.setDepth(2);
          this.coinGroup.add(coin);
      }
  }
    // is there a fire over the platform?
    if(Phaser.Math.Between(1, 100) <= gameOptions.firePercent){
      if(this.firePool.getLength()){
          let fire = this.firePool.getFirst();
          fire.x = posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth);
          fire.y = posY - 46;
          fire.alpha = 1;
          fire.active = true;
          fire.visible = true;
          this.firePool.remove(fire);
      }
      else{
          let fire = this.physics.add.sprite(posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth), posY - 46, "fire");
          fire.setImmovable(true);
          fire.setVelocityX(platform.body.velocity.x);
          fire.setSize(8, 2, true)
          fire.anims.play("burn");
          fire.setDepth(2);
          this.fireGroup.add(fire);
      }
  }
}
}

// the player jumps when on the ground, or once in the air as long as there are jumps left and the first jump was on the ground
jump(){
  if((!this.dying) && (this.player.body.touching.down || (this.playerJumps > 0 && this.playerJumps < gameOptions.jumps))){
    if(this.player.body.touching.down){
        this.playerJumps = 0;
    }
    this.player.setVelocityY(gameOptions.jumpForce * -1);
    this.playerJumps ++;

    // stops animation
    this.player.anims.stop();
}
  }

  update(){
 
    // game over
    if(this.player.y > config.height){
        this.scene.start("Game");
    }
    this.player.x = gameOptions.playerStartPosition;

    // recycling platforms
    let minDistance = config.width;
    let rightmostPlatformHeight = 0;
    this.platformGroup.getChildren().forEach(function(platform){
        let platformDistance = config.width - platform.x - platform.displayWidth / 2;
        if(platformDistance < minDistance){
            minDistance = platformDistance;
            rightmostPlatformHeight = platform.y;
        }
        if(platform.x < - platform.displayWidth / 2){
            this.platformGroup.killAndHide(platform);
            this.platformGroup.remove(platform);
        }
    }, this);

    // recycling coins
    this.coinGroup.getChildren().forEach(function(coin){
      if(coin.x < - coin.displayWidth / 2){
          this.coinGroup.killAndHide(coin);
          this.coinGroup.remove(coin);
      }
  }, this);

  // recycling fire
  this.fireGroup.getChildren().forEach(function(fire){
    if(fire.x < - fire.displayWidth / 2){
        this.fireGroup.killAndHide(fire);
        this.fireGroup.remove(fire);
    }
}, this);


    // adding new platforms
    if(minDistance > this.nextPlatformDistance){
        let nextPlatformWidth = Phaser.Math.Between(gameOptions.platformSizeRange[0], gameOptions.platformSizeRange[1]);
        let platformRandomHeight = gameOptions.platformHeighScale * Phaser.Math.Between(gameOptions.platformHeightRange[0], gameOptions.platformHeightRange[1]);
        console.log(rightmostPlatformHeight)
        let nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;
        let minPlatformHeight = config.height * gameOptions.platformVerticalLimit[0];
        let maxPlatformHeight = config.height * gameOptions.platformVerticalLimit[1];
        let nextPlatformHeight = Phaser.Math.Clamp(nextPlatformGap, minPlatformHeight, maxPlatformHeight);
        this.addPlatform(nextPlatformWidth, config.width + nextPlatformWidth / 2, nextPlatformHeight);
    }
}

};





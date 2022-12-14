import {Component, OnInit} from '@angular/core';
import Phaser from 'phaser';
import ImageFrameConfig = Phaser.Types.Loader.FileTypes.ImageFrameConfig;
import {Router} from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  static width = (window.innerWidth) * 0.8;
  static height = window.innerHeight - 200;
  static phaserGame: Phaser.Game;
  static route;
  config: Phaser.Types.Core.GameConfig;

  constructor(route: Router) {
    GameComponent.route = route;
    this.config = {
      type: Phaser.AUTO,
      height: GameComponent.height,
      width: GameComponent.width,
      scale: {
        autoCenter: Phaser.Scale.Center.CENTER_HORIZONTALLY
      },
      scene: [MainScene, SettingsMenu, MainGame, NextLevel, Lose],
      parent: 'gameContainer',
      physics: {
        default: 'arcade',
        arcade: {
          debug: false,
          gravity: { y: 1400 },
        }
      }
    };
  }

  ngOnInit(): void {
    // Init the game window.
    GameComponent.phaserGame = new Phaser.Game(this.config);
  }
}

class MainScene extends Phaser.Scene {
  gameSettings;
  // Music and sounds are on by default.
  defaultSettings = [
    { settings: 'music', value: true },
    { settings: 'sfx', value: true }
  ];

  constructor() {
    super({key: 'main'});
  }
  create() {
    // Reading the music and sounds settings from the previous game.
    this.gameSettings = JSON.parse(localStorage.getItem('myGameSettings'));

    // Init the game settings to default if we have never played.
    if (this.gameSettings === null || this.gameSettings.length <= 0) {
      localStorage.setItem('myGameSettings', JSON.stringify(this.defaultSettings));
      this.gameSettings = this.defaultSettings;
    }

    // The background color of the main menu.
    this.cameras.main.setBackgroundColor('#536DFE');

    // Set the "Jouer" button.
    const playButton = this.add.image(GameComponent.width / 2, (GameComponent.height / 2) - 100, 'button').setInteractive();
    const playButtonText = this.add.text(0, 0, 'Jouer', {
      color: '#000',
      fontSize: '28px'
    });

    // Centers the "Jouer" string in the middle of the button's texture.
    Phaser.Display.Align.In.Center(playButtonText, playButton);

    // Starts the 'game' scene when the "Jouer" button is pressed.
    playButton.on('pointerdown', () => {
      playButton.setTexture('button_pressed');
      this.sound.play('buttonSound');
      this.scene.launch('game', { level: 1 });
      this.scene.stop();
    }).on('pointerup', () => {
      playButton.setTexture('button');
    });

    // Set the "Param??tres" button.
    const settingsButton = this.add.image(GameComponent.width / 2, GameComponent.height / 2, 'button').setInteractive();
    const settingsButtonText = this.add.text(0, 0, 'Param??tres', {
      color: '#000',
      fontSize: '28px'
    });

    // Centers the "Param??tres" string in the middle of the button's texture.
    Phaser.Display.Align.In.Center(settingsButtonText, settingsButton);

    // Starts the 'settings' scene when the "Param??tres" button is pressed.
    settingsButton.on('pointerdown', () => {
      settingsButton.setTexture('button_pressed');
      this.sound.play('buttonSound');
      this.scene.launch('settings');
      this.scene.stop();
      if (this.gameSettings[1].value) {
        this.sound.play('buttonSound');
      }
    }).on('pointerup', () => {
      settingsButton.setTexture('button');
    });

    const backgroundMusic = this.sound.add('backgroundMusic', {
      mute: false,
      volume: 1,
      rate: 1,
      loop: true,
      delay: 200
    });
    if (this.gameSettings[0].value) {
      backgroundMusic.play();
    }
  }

  preload() {
    this.load.image('button', '../../assets/green_button02.png');
    this.load.image('button_pressed', '../../assets/green_button03.png');
    this.load.audio('buttonSound', '../../assets/switch33.wav');
    this.load.audio('backgroundMusic', '../../assets/bg_music.mp3');
  }

  update() {
    if (GameComponent.route.url !== '/game') {
      GameComponent.phaserGame.destroy(true);
    }
  }
}

class SettingsMenu extends Phaser.Scene {
  gameSettings;

  constructor() {
    super({key: 'settings'});
  }

  create() {
    this.cameras.main.setBackgroundColor('#536DFE');

    this.gameSettings = JSON.parse(localStorage.getItem('myGameSettings'));

    this.add.text(250, 40, 'Settings', {
      fontSize: '56px',
      color: '#fff'
    });

    this.add.text(200, 220, 'Sound Effects', {
      fontSize: '28px',
      color: '#fff'
    });

    const soundFxButton = this.add.image(550, 235, 'button').setInteractive();
    const soundFxText = this.add.text(0, 0, this.gameSettings[1].value === true ? 'On' : 'Off', {
      fontSize: '28px',
      color: '#000'
    });

    soundFxButton.on('pointerdown', () => {
      soundFxButton.setTexture('button_pressed');
    }).on('pointerup', () => {
      soundFxButton.setTexture('button');
      if (this.gameSettings[1].value) {
        this.gameSettings[1].value = false;
        soundFxText.text = 'Off';
      } else {
        this.gameSettings[1].value = true;
        soundFxText.text = 'On';
      }
      localStorage.setItem('myGameSettings', JSON.stringify(this.gameSettings));
    });

    Phaser.Display.Align.In.Center(soundFxText, soundFxButton);

    this.add.text(200, 350, 'Music', {
      fontSize: '28px',
      color: '#fff'
    });

    const musicButton = this.add.image(550, 365, 'button').setInteractive();
    const musicText = this.add.text(0, 0, this.gameSettings[0] === true ? 'On' : 'Off', {
      fontSize: '28px',
      color: '#000'
    });

    musicButton.on('pointerdown', () => {
      musicButton.setTexture('button_pressed');
    }).on('pointerup', () => {
      musicButton.setTexture('button');
      if (this.gameSettings[0].value) {
        this.gameSettings[0].value = false;
        musicText.text = 'Off';
      } else {
        this.gameSettings[0].value = true;
        musicText.text = 'On';
      }
      localStorage.setItem('myGameSettings',
        JSON.stringify(this.gameSettings));
    });

    Phaser.Display.Align.In.Center(musicText, musicButton);

    // Set the "Jouer" button.
    const playButton = this.add.image(550, 495, 'button').setInteractive();
    const playButtonText = this.add.text(0, 0, 'Jouer', {
      color: '#000',
      fontSize: '28px'
    });

    // Centers the "Jouer" string in the middle of the button's texture.
    Phaser.Display.Align.In.Center(playButtonText, playButton);

    // Starts the 'game' scene when the "Jouer" button is pressed.
    playButton.on('pointerdown', () => {
      playButton.setTexture('button_pressed');
      this.sound.play('buttonSound');
      this.scene.launch('game', { level : 1 });
      this.scene.stop();
    }).on('pointerup', () => {
      playButton.setTexture('button');
    });
  }

  update() {
    if (GameComponent.route.url !== '/game') {
      GameComponent.phaserGame.destroy(true);
    }
  }
}

class MainGame extends Phaser.Scene {
  private player;
  private cursors;
  private obstacles;
  private openedDoorTop;
  private openedDoorBottom;
  private closedDoorTop;
  private closedDoorBottom;
  private map;
  private platforms;
  private level;
  // private lifeBonus;
  // private speedBonus;
  // private slowBonus;
  // private hearths;
  // private slowed: boolean = false;

  constructor() {
    super({key: 'game'});
  }

  init(data) {
    if (data.level > 2) {
      console.log('Sc??ne de fin de niveaux');
      this.scene.launch('main');
      this.scene.stop();
    } else {
      this.level = data.level;
      if (this.level > 1 || !this.checkIfNewGame()) {
        this.destroyPreviousLevelData();
      }
    }
  }

  create() {
    const background = this.add.image(0, 0, 'background');
    background.setScale(15, 2);
    this.map = this.make.tilemap({key : 'map' + this.level});
    const ground = this.map.addTilesetImage('spritesheet_ground', 'ground');
    // const tiles = this.map.addTilesetImage('spritesheet_tiles', 'tiles');
    // const bridge = map.addTilesetImage('bridge2', 'bridge');
    if (this.platforms !== undefined) {
      this.platforms.destroy();
    }
    this.platforms = this.map.createStaticLayer('Platforms', ground, 0, 200);
    // const pont = map.createStaticLayer('Platforms', bridge, 0, 200);
    this.platforms.setCollisionByExclusion([-1], true);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.initPlayer();

    this.initObstacles();

    // this.initBonusMalus();

    this.initDoors();

    this.cameras.main.startFollow(this.player);

  }

  initPlayer() {
    this.player = this.physics.add.sprite(50, 300, 'player' + this.level, 9);
    // tslint:disable-next-line:max-line-length
    // this.hearths = this.add.image(this.player.x - (GameComponent.width / 2) + 64 , this.player.y - (GameComponent.height / 2) + 64, 'heart');
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(false);
    this.player.setSize(this.player.width - 20, this.player.height);
    // this.physics.add.collider(this.player,pont);
    // this.player.hasKey = false;
    this.player.life = 3;
    this.player.speed = 200;
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNames('player' + this.level, {
        start: 9,
        end: 10
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'jump',
      frames: [{key: 'player' + this.level, frame: 5}],
      frameRate: 10
    });
    this.physics.add.collider(this.player, this.platforms);
  }

  initObstacles() {
    this.obstacles = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });
    const obstaclesObjects = this.map.getObjectLayer('Obstacles').objects;
    obstaclesObjects.forEach(obstacleObject => {
      const obstacle = this.obstacles.create(obstacleObject.x, obstacleObject.y + 250 - (obstacleObject.height), 'spikes');
      obstacle.body.setSize(obstacle.width - 10, obstacle.height - 10).setOffset(5, 10);
    });

    this.physics.add.collider(this.player, this.obstacles, this.hitObstacle, null, this);
  }

  initDoors() {
    this.openedDoorTop = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });
    const openedDoorTop = this.map.getObjectLayer('OpenedDoorTop').objects;
    openedDoorTop.forEach(doorObject => {
      // tslint:disable-next-line:max-line-length
      this.openedDoorTop.create(doorObject.x + (doorObject.width / 2), doorObject.y + 232 - (doorObject.height), 'openedDoorTop');
    });

    this.openedDoorBottom = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });
    const openedDoorBottom = this.map.getObjectLayer('OpenedDoorBottom').objects;
    openedDoorBottom.forEach(doorObject => {
      // tslint:disable-next-line:max-line-length
      this.openedDoorBottom.create(doorObject.x + (doorObject.width / 2), doorObject.y + 232 - (doorObject.height), 'openedDoorBottom');
    });

    this.closedDoorTop = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });
    const closedDoorTop = this.map.getObjectLayer('ClosedDoorTop').objects;
    closedDoorTop.forEach(doorObject => {
      // tslint:disable-next-line:max-line-length
      this.closedDoorTop.create(doorObject.x + (doorObject.width / 2), doorObject.y + 232 - (doorObject.height), 'closedDoorTop');
    });

    this.closedDoorBottom = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });
    const closedDoorBottom = this.map.getObjectLayer('ClosedDoorBottom').objects;
    closedDoorBottom.forEach(doorObject => {
      // tslint:disable-next-line:max-line-length
      this.closedDoorBottom.create(doorObject.x + (doorObject.width / 2), doorObject.y + 232 - (doorObject.height), 'closedDoorBottom');
    });
    this.physics.add.collider(this.player, this.closedDoorBottom, this.hitClosedDoor, null, this);
  }

  initBonusMalus() {
/*    this.speedBonus = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });
    const speedBonusObjects = this.map.getObjectLayer('Fast').objects;
    speedBonusObjects.forEach(speedBonusObject => {
      const obstacle = this.speedBonus.create(speedBonusObject.x, speedBonusObject.y + 215 - (speedBonusObject.height / 2), 'fast');
    });

    this.physics.add.collider(this.player, this.speedBonus, this.hitSpeedBonus, null, this);

    this.lifeBonus = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });
    const lifeBonusObjects = this.map.getObjectLayer('Heart').objects;
    lifeBonusObjects.forEach(lifeBonusObject => {
      const obstacle = this.lifeBonus.create(lifeBonusObject.x, lifeBonusObject.y + 215 - (lifeBonusObject.height / 2), 'heart');
    });

    this.physics.add.collider(this.player, this.lifeBonus, this.hitLifeBonus, null, this);*/
  }

  destroyPreviousLevelData() {
    this.anims.remove('walk');
    this.anims.remove('jump');
    this.player.destroy();
    this.obstacles.destroy();
    this.openedDoorTop.destroy();
    this.openedDoorBottom.destroy();
    this.closedDoorTop.destroy();
    this.closedDoorBottom.destroy();
    this.map.destroy();
    this.platforms.destroy();
  }

  checkIfNewGame() {
    return (this.player === undefined || this.obstacles === undefined);
  }

  preload() {
    this.load.image('background', '../../assets/map_levels/tiles/background.png');
    this.load.image('ground', '../../assets/map_levels/tiles/spritesheet_ground.png');
    this.load.image('tiles', '../../assets/map_levels/tiles/spritesheet_tiles.png');
    this.load.image('spikes', '../../assets/map_levels/tiles/spikes.png');
    this.load.image('openedDoorTop', '../../assets/map_levels/tiles/opened_door_top.png');
    this.load.image('openedDoorBottom', '../../assets/map_levels/tiles/opened_door_bottom.png');
    this.load.image('closedDoorTop', '../../assets/map_levels/tiles/closed_door_top.png');
    this.load.image('closedDoorBottom', '../../assets/map_levels/tiles/closed_door_bottom.png');
    this.load.image('heart', '../../assets/map_levels/tiles/heart.png');
    this.load.image('fast', '../../assets/map_levels/tiles/fast_bonus.png');
    // this.load.image('slow','../../assets/map_levels/tiles/slow_bonus.png');
    // this.load.image('bridge','../../assets/map_levels/tiles/bridge2.png');

    const playerConfig: ImageFrameConfig = {
      frameWidth: 64,
      frameHeight: 74,
    };
    this.load.spritesheet('player1', '../../assets/players/player1.png', playerConfig);
    this.load.spritesheet('player2', '../../assets/players/player2.png', playerConfig);
    this.load.audio('jumpSound', '../../assets/jump_sound.wav');
    this.load.tilemapTiledJSON('map1', '../../assets/map_levels/level1.json');
    this.load.tilemapTiledJSON('map2', '../../assets/map_levels/level2.json');
  }

  update() {
    if (GameComponent.route.url !== '/game') {
      GameComponent.phaserGame.destroy(true);
    } else {
      if ((this.cursors.up.isDown || this.cursors.space.isDown) && this.player.body.onFloor()) {
        this.player.setVelocityY(-500);
        this.player.play('jump', true);
        this.sound.play('jumpSound');
      } else if (this.player.body.onFloor()) {
        this.player.setVelocityX(this.player.speed);
        this.player.play('walk', true);
      }
      /*
      this.hearths.x = this.player.x;
      this.hearths.y = this.player.y - 64;
       */
    }
  }

  hitObstacle(player) {
    this.player.life--;
    if (this.player.life === 0) {
      // player.setX(50);
      // this.player.life = 3;
      this.scene.launch('lose');
      this.scene.stop();
    } else {
      player.setX(this.player.x);
    }
    player.setVelocity(0, 0);
    player.setX(this.player.x - 160);
    player.setY(300);
    player.setAlpha(0);
    this.tweens.add({
      targets: player,
      alpha: 1,
      duration: 100,
      easy: 'Linear',
      repeat: 5
    });
  }

  hitClosedDoor() {
    this.scene.launch('nextLevel', { level : this.level + 1});
    this.scene.stop();
  }

/*  hitSlowBonus() {
    this.player.speed -= 20;
  }

  hitSpeedBonus() {
    this.player.speed += 20;
  }

  hitLifeBonus() {
    if (this.player.life < 3) {
      this.player.life++;
    }
  }*/
}

class NextLevel extends Phaser.Scene {
  private level;

  constructor() {
    super({key: 'nextLevel'});
  }

  init(data) {
    this.level = data.level;
  }

  create() {
    // The background color of the lose scene.
    this.cameras.main.setBackgroundColor('#536DFE');
    console.log('nextLevel : ' + this.level);

    // Set the "Niveau suivant" button.
    if ( this.level <= 4) {
      // tslint:disable-next-line:max-line-length
      const nextLevelButton = this.add.image(GameComponent.width / 2, GameComponent.height / 2 - 100, 'button').setInteractive().setScale(1.5);
      const nextLevelButtonText = this.add.text(0, 0, 'Niveau ' + this.level, {
        color: '#000',
        fontSize: '28px'
      });

      Phaser.Display.Align.In.Center(nextLevelButtonText, nextLevelButton);

      // Starts the 'game' scene when the "Jouer" button is pressed.
      nextLevelButton.on('pointerdown', () => {
        nextLevelButton.setTexture('button_pressed');
        this.scene.launch('game', {level: this.level});
        this.scene.stop();
      }).on('pointerup', () => {
        nextLevelButton.setTexture('button');
      });
    }

    // Set the "Retour au menu" button.
    const returnButton = this.add.image(GameComponent.width / 2, GameComponent.height / 2, 'button').setInteractive().setScale(1.5);
    const returnButtonText = this.add.text(0, 0, 'Retour au menu', {
      color: '#000',
      fontSize: '28px'
    });

    Phaser.Display.Align.In.Center(returnButtonText, returnButton);

    // Starts the 'game' scene when the "Jouer" button is pressed.
    returnButton.on('pointerdown', () => {
      returnButton.setTexture('button_pressed');
      this.scene.launch('main');
      this.scene.stop();
    }).on('pointerup', () => {
      returnButton.setTexture('button');
    });
  }

  preload() {
    this.load.image('button', '../../assets/green_button02.png');
    this.load.image('button_pressed', '../../assets/green_button03.png');
  }

  update() {
    if (GameComponent.route.url !== '/game') {
      GameComponent.phaserGame.destroy(true);
    }
  }
}

class Lose extends Phaser.Scene {

  constructor() {
    super({key: 'lose'});
  }
  create() {
    // The background color of the lose scene.
    this.cameras.main.setBackgroundColor('#536DFE');

    // Set the "Retour au menu" button.
    const returnButton = this.add.image(GameComponent.width / 2, GameComponent.height / 2, 'button').setInteractive().setScale(1.5);
    const returnButtonText = this.add.text(0, 0, 'Retour au menu', {
      color: '#000',
      fontSize: '28px'
    });

    Phaser.Display.Align.In.Center(returnButtonText, returnButton);

    // Starts the 'game' scene when the "Jouer" button is pressed.
    returnButton.on('pointerdown', () => {
      returnButton.setTexture('button_pressed');
      this.scene.launch('main');
      this.scene.stop();
    }).on('pointerup', () => {
      returnButton.setTexture('button');
    });
  }

  preload() {
    this.load.image('button', '../../assets/green_button02.png');
    this.load.image('button_pressed', '../../assets/green_button03.png');
  }

  update() {
    if (GameComponent.route.url !== '/game') {
      GameComponent.phaserGame.destroy(true);
    }
  }
}

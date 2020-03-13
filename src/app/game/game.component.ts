import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
import ImageFrameConfig = Phaser.Types.Loader.FileTypes.ImageFrameConfig;
import Game = Phaser.Game;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  static width = window.innerWidth - 50;
  static height = window.innerHeight - 100;
  phaserGame: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor() {
    this.config = {
      type: Phaser.AUTO,
      height: GameComponent.height,
      width: GameComponent.width,
      scene: [MainScene, SettingsMenu, MainGame],
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
    this.phaserGame = new Phaser.Game(this.config);
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
      this.scene.launch('game');
      this.scene.stop();
    }).on('pointerup', () => {
      playButton.setTexture('button');
    });

    // Set the "Paramètres" button.
    const settingsButton = this.add.image(GameComponent.width / 2, GameComponent.height / 2, 'button').setInteractive();
    const settingsButtonText = this.add.text(0, 0, 'Paramètres', {
      color: '#000',
      fontSize: '28px'
    });

    // Centers the "Paramètres" string in the middle of the button's texture.
    Phaser.Display.Align.In.Center(settingsButtonText, settingsButton);

    // Starts the 'settings' scene when the "Paramètres" button is pressed.
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
    console.log('update method');
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
  }
}

class MainGame extends Phaser.Scene {
  private player;
  private cursors;
  private obstacles;

  constructor() {
    super({key: 'game'});
  }

  create() {
    const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
    background.setScale(2, 0.8);
    const map = this.make.tilemap({key : 'map'});
    const ground = map.addTilesetImage('spritesheet_ground', 'ground');
    const tiles = map.addTilesetImage('spritesheet_tiles', 'tiles');
    const platforms = map.createStaticLayer('Platforms', ground, 0, 200);
    platforms.setCollisionByExclusion([-1], true);

    this.player = this.physics.add.sprite(10, 300, 'yellowPlayer', 9);
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    this.player.setSize(this.player.width - 20, this.player.height);
    this.physics.add.collider(this.player, platforms);
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNames('yellowPlayer', {
        start: 9,
        end: 10
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'jump',
      frames: [{key: 'yellowPlayer', frame: 5}],
      frameRate: 10
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    this.obstacles = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });
    const obstaclesObjects = map.getObjectLayer('Obstacles').objects;
    obstaclesObjects.forEach(obstacleObject => {
      const obstacle = this.obstacles.create(obstacleObject.x, obstacleObject.y + 250 - (obstacleObject.height), 'spikes');
      obstacle.body.setSize(obstacle.width - 10, obstacle.height - 10).setOffset(5, 10);
    });
    this.physics.add.collider(this.player, this.obstacles, this.hitObstacle, null, this);
  }

  preload() {
    this.load.image('background', '../../assets/map_levels/tiles/background.png');
    this.load.image('ground', '../../assets/map_levels/tiles/spritesheet_ground.png');
    this.load.image('tiles', '../../assets/map_levels/tiles/spritesheet_tiles.png');
    this.load.image('spikes', '../../assets/map_levels/tiles/spikes.png');
    const playerConfig: ImageFrameConfig = {
      frameWidth: 64,
      frameHeight: 74,
    };
    this.load.spritesheet('yellowPlayer', '../../assets/players/yellow_spritesheet.png', playerConfig);
    this.load.tilemapTiledJSON('map', '../../assets/map_levels/level1.json');
  }

  update() {
    if ((this.cursors.up.isDown || this.cursors.space.isDown) && this.player.body.onFloor()) {
      this.player.setVelocityY(-500);
      this.player.play('jump', true);
    } else if (this.player.body.onFloor()) {
      this.player.setVelocityX(200);
      this.player.play('walk', true);
    }
  }

  hitObstacle(player, obstacle) {
    player.setVelocity(0, 0);
    player.setX(10);
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
}

class SceneLevel2 extends Phaser.Scene {
  private player;
  private cursors;
  private obstacles;

  constructor() {
    super({key: 'game'});
  }

  create() {
    const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
    background.setScale(2, 0.8);
    const map = this.make.tilemap({key : 'map'});
    const ground = map.addTilesetImage('spritesheet_ground', 'ground');
    const tiles = map.addTilesetImage('spritesheet_tiles', 'tiles');
    const platforms = map.createStaticLayer('Platforms', ground, 0, 200);
    platforms.setCollisionByExclusion([-1], true);

    this.player = this.physics.add.sprite(10, 300, 'yellowPlayer', 9);
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    this.player.setSize(this.player.width - 20, this.player.height);
    this.physics.add.collider(this.player, platforms);
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNames('yellowPlayer', {
        start: 9,
        end: 10
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'jump',
      frames: [{key: 'yellowPlayer', frame: 5}],
      frameRate: 10
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    this.obstacles = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });
    const obstaclesObjects = map.getObjectLayer('Obstacles').objects;
    obstaclesObjects.forEach(obstacleObject => {
      const obstacle = this.obstacles.create(obstacleObject.x, obstacleObject.y + 250 - (obstacleObject.height), 'spikes');
      obstacle.body.setSize(obstacle.width - 10, obstacle.height - 10).setOffset(5, 10);
    });
    this.physics.add.collider(this.player, this.obstacles, this.hitObstacle, null, this);
  }

  preload() {
    this.load.image('background', '../../assets/map_levels/tiles/background.png');
    this.load.image('ground', '../../assets/map_levels/tiles/spritesheet_ground.png');
    this.load.image('tiles', '../../assets/map_levels/tiles/spritesheet_tiles.png');
    this.load.image('spikes', '../../assets/map_levels/tiles/spikes.png');
    const playerConfig: ImageFrameConfig = {
      frameWidth: 64,
      frameHeight: 74,
    };
    this.load.spritesheet('yellowPlayer', '../../assets/players/yellow_spritesheet.png', playerConfig);
    this.load.tilemapTiledJSON('map', '../../assets/map_levels/level2.json');
  }

  update() {
    if ((this.cursors.up.isDown || this.cursors.space.isDown) && this.player.body.onFloor()) {
      this.player.setVelocityY(-500);
      this.player.play('jump', true);
    } else if (this.player.body.onFloor()) {
      this.player.setVelocityX(200);
      this.player.play('walk', true);
    }
  }

  hitObstacle(player, obstacle) {
    player.setVelocity(0, 0);
    player.setX(10);
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
}

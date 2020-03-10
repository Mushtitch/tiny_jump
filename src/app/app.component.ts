import {Component} from '@angular/core';
import * as Phaser from 'phaser';


class Game extends Phaser.Scene {
  helloWorld: Phaser.GameObjects.Text;

  init() {
    this.cameras.main.setBackgroundColor('#24252A');
  }

  create() {
    this.helloWorld = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'Hello World', {
        font: '40px Arial',
        fill: '#ffffff'
      }
    );
    this.helloWorld.setOrigin(0.5);

  }

  update() {
    this.helloWorld.angle += 1;
  }

  setAngle(angle: number) {
    this.helloWorld.angle = angle;
  }
}

interface GameInstance extends Phaser.Types.Core.GameConfig {
  instance: Phaser.Game;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  initialize = false;
  game: GameInstance = {
    width: '100%',
    height: '100%',
    type: Phaser.AUTO,
    scene: Game,
    instance: null
  };

  getInstance() {
    return this.game.instance;
  }

  initializeGame() {
    this.initialize = true;
  }

  changeAngle() {
    const instance = this.getInstance();
    instance.scene.scenes.forEach(scene => {
      if (scene.sys.isActive() && scene instanceof Game) {
        scene.setAngle(0);
      }
    });
  }
}


import MainMenuScene from '../scripts/scenes/menuScene.js';
import GameScene from '../scripts/scenes/gameScene.js';
import GameScene12 from '../scripts/scenes/gameScene1-2.js';
import GameScene2 from '../scripts/scenes/gameScene2.js';
import GameScene3 from '../scripts/scenes/gameScene3.js';
import GameOverScene from '../scripts/scenes/gameOverScene.js';
import CreditsScene from '../scripts/scenes/creditScene.js';
import EndScene from '../scripts/scenes/EndScene.js';
import EndScene2 from '../scripts/scenes/EndScene2.js';
import EndScene3 from '../scripts/scenes/EndScene3.js';

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }   
    },
    scene: [MainMenuScene, GameScene, GameScene12, GameScene2, GameScene3, GameOverScene, CreditsScene, EndScene, EndScene2, EndScene3]
};

const game = new Phaser.Game(config);



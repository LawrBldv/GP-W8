
import MainMenuScene from '../scripts/scenes/menuScene.js';
import GameScene from '../scripts/scenes/gameScene.js';
import GameOverScene from '../scripts/scenes/gameOverScene.js';
import CreditsScene from '../scripts/scenes/creditScene.js';
import EndScene from '../scripts/scenes/EndScene.js';

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
    scene: [MainMenuScene, GameScene, GameOverScene, CreditsScene, EndScene]
};

const game = new Phaser.Game(config);



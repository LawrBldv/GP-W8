export class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    preload() {
        
    }

    create(data) {
        this.add.text(640, 310, `Score: ${data.score}`, { fontFamily: 'OldEnglish3', fontSize: '32px', fill: '#FFFFFF' }).setOrigin(0.5);
        this.add.text(640, 370, `Coins Collected: ${data.coinsCollected}`, { fontFamily: 'OldEnglish3', fontSize: '32px', fill: '#FFFFFF' }).setOrigin(0.5);
        
        // Create buttons
        const retryButton = this.createButton(650, 600, 'Retry', () => this.scene.start('GameScene'));
    
        retryButton.setInteractive();
        retryButton.on('pointerdown', () => {
            this.scene.stop('GameOverScene');
            this.scene.start('GameScene');
            const gameScene = this.scene.get('GameScene');
            if (gameScene) {
                gameScene.resetState();
            }
        });
    
        this.createButton(400, 600, 'Next', () => console.log('no next level yet'));
        this.createButton(900, 600, 'Main Menu', () => this.scene.start('MainMenuScene'));
    }
    
    
    
    createButton(x, y, text, callback) {
        const button = this.add.text(x, y, text, { fontSize: '32px', fontFamily: 'OldEnglish3', fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', callback)
            .on('pointerover', () => button.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => button.setStyle({ fill: '#fff' }));
        
        return button; // Return the button
    }
    
}

export default GameOverScene;

export class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.levelKey = data.levelKey; // Store the key of the gameplay scene
    }

    create(data) {
        this.add.text(640, 310, `Score: ${data.score}`, { fontFamily: 'OldEnglish3', fontSize: '32px', fill: '#FFFFFF' }).setOrigin(0.5);
        this.add.text(640, 370, `Paper Scraps: ${data.coinsCollected}`, { fontFamily: 'OldEnglish3', fontSize: '32px', fill: '#FFFFFF' }).setOrigin(0.5);
        
        const retryButton = this.createButton(650, 600, 'Retry', () => this.scene.restart({ levelKey: this.levelKey }));
        retryButton.setInteractive();

        retryButton.on('pointerdown', () => {
            this.scene.stop(this.levelKey); // Stop the current gameplay scene
            this.scene.start(this.levelKey); // Restart the gameplay scene
            this.scene.stop('GameOverScene');
        });

        this.createButton(900, 600, 'Main Menu', () => this.scene.start('MainMenuScene'));
    }
    
    createButton(x, y, text, callback) {
        const button = this.add.text(x, y, text, { fontSize: '32px', fontFamily: 'OldEnglish3', fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', callback)
            .on('pointerover', () => button.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => button.setStyle({ fill: '#fff' }));
        
        return button; 
    }
}

export default GameOverScene;

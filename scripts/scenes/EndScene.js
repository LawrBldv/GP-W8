export default class EndScene extends Phaser.Scene {
    constructor() {
        super('EndScene');
    }

    preload() {
        
    }

    create(data) {
        this.add.text(640, 310, `Score: ${data.score}`, { fontFamily: 'OldEnglish3', fontSize: '32px', fill: '#FFFFFF' }).setOrigin(0.5);
        this.add.text(640, 370, `Paper Scraps: ${data.coinsCollected}`, { fontFamily: 'OldEnglish3', fontSize: '32px', fill: '#FFFFFF' }).setOrigin(0.5);
        
        
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
    
        const nextButton = this.createButton(400, 600, 'Next', () => {
            this.scene.stop('EndScene');
            this.scene.start('GameScene12');
            const gameScene = this.scene.get('GameScene12');
            if (gameScene) {
                gameScene.resetState();
            }
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
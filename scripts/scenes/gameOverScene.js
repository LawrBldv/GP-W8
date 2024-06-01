export class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    preload() {
        
    }

    create(data) {
        this.add.text(640, 310, `Score: ${data.score}`, { fontFamily: 'OldEnglish3', fontSize: '32px', fill: '#FFFFFF' }).setOrigin(0.5);
        this.add.text(640, 370, `Coins Collected: ${data.coinsCollected}`, { fontFamily: 'OldEnglish3', fontSize: '32px', fill: '#FFFFFF' }).setOrigin(0.5);
        
        
        const retryButton = this.createButton(650, 600, 'Retry', () => this.scene.start('GameScene'));
    
        retryButton.setInteractive();
        retryButton.on('pointerdown', () => {
            
            this.scene.restart();
            const gameScene = this.scene.get('GameScene');
            const gameScene1 = this.scene.get('GameScene12');
            const gameScene2 = this.scene.get('GameScene2');
            const gameScene3 = this.scene.get('GameScene3');

            if (gameScene) {
                gameScene.resetState();
            } else if (gameScene2){
                gameScene2.resetState();
            } else if (gameScene3){
                gameScene3.resetState();
            }
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

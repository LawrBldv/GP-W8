class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        
        this.load.image('newspaper', './assets/images/menu/NewsPaper.png');
        this.load.audio('menuMusic', './assets/Sounds/Music/Background.mp3');
        this.load.audio('buttonClick', './assets/Sounds/SFX/buttonClick.mp3');
    }

    create() {
        
        this.add.image(640, 360, 'newspaper');

        
        this.menuMusic = this.sound.add('menuMusic', { loop: true, volume: 0.3 });
        this.menuMusic.play();
        const playButton = this.add.text(790, 250, 'Start the Game', { fontFamily: 'OldEnglish3', fontSize: '50px', fill: '#8B0000' }).setOrigin(0.5);
        const creditsButton = this.add.text(380, 250, 'Credits', { fontFamily: 'OldEnglish3', fontSize: '46px', fill: '#8B0000' }).setOrigin(0.5);
        const quitButton = this.add.text(670, 520, 'Quit the game, live a lie', { fontFamily: 'OldEnglish3', fontSize: '50px', fill: '#8B0000' }).setOrigin(0.5);

        
        const buttonClickSound = this.sound.add('buttonClick');

        
        playButton.setInteractive().on('pointerdown', () => {
            this.scene.start('GameScene2');
            const gameScene = this.scene.get('GameScene2');
            this.sound.stopAll();
            if (gameScene) {
                gameScene.resetState();
                buttonClickSound.play(); 
            }
        });

        creditsButton.setInteractive().on('pointerdown', () => {
            buttonClickSound.play(); 
            
            this.scene.launch('CreditsScene');
            this.scene.pause();
        });

        quitButton.setInteractive().on('pointerdown', () => {
            buttonClickSound.play(); 
            
            alert('Exiting the game');
        });
    }
}


export default MainMenuScene;

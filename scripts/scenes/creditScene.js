export default class CreditsScene extends Phaser.Scene {
    constructor() {
        super('CreditsScene');
    }

    create() {
        
        this.cameras.main.setBackgroundColor('#000');

        
        this.add.text(640, 200, 'Credits', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(640, 300, 'Developer: Lawrenzo Andrey Baldove', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(640, 350, 'Section: A223', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(640, 400, 'Program: EMC', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

        
        const backButton = this.add.text(100, 500, 'Back', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        backButton.setInteractive(); 
        backButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene'); 
        });
    }
}

export default class GameScene12 extends Phaser.Scene {
    constructor() {
        super('GameScene12');
        this.player;
        this.cursors;
        this.score = 0;
        this.coinsCollected = 0;
        this.scoreText;
        this.coinsText;
        this.handMobs;
        this.tileCooldowns = {};
        this.crossesLayer;
    }   

    preload() {
        
        this.load.image('tiles12', '../assets/images/tilesets/GP W8 Level 2 Tileset.png'); //tile
        this.load.tilemapTiledJSON('map12', '../assets/images/tilemaps/GP M8 1-2.json'); // map
        this.load.spritesheet('player1', '../assets/images/sprites/player.png', { frameWidth: 54, frameHeight: 156 });
        this.load.image('coin', '../assets/images/sprites/scrap.png');

        this.load.image('background2', '../assets/images/background/Background2.png');
        this.load.image('midground2', '../assets/images/background/Midground2.png');
        this.load.image('mist2', '../assets/images/background/Mist2.png');
        this.load.spritesheet('light', '../assets/images/background/Lights.png', { frameWidth: 1226, frameHeight: 482 });
        this.load.spritesheet('light2', '../assets/images/background/Light2.png', { frameWidth: 300, frameHeight: 502 });

        //Mob
        this.load.image('hand', '../assets/images/sprites/hand.png');
        this.load.image('cage', '../assets/images/sprites/Cage.png');


        this.load.audio('backgroundMusic2', './assets/Sounds/Music/Theme2.mp3');
        this.load.audio('ScrapSound', '../assets/Sounds/SFX/Rustle.mp3');
        this.load.audio('Scream', '../assets/Sounds/SFX/Scream.mp3');
        this.load.audio('Piano', '../assets/Sounds/SFX/DissonantPiano.mp3');

        
        this.load.spritesheet('interactPromptAnim', '../assets/images/sprites/TriggerAnim.png', { frameWidth: 80, frameHeight: 78 });
        this.load.image('interactPrompt', '../assets/images/sprites/Trigger.png');
        this.load.image('tape', '../assets/images/sprites/Tape.png');
        this.load.image('endingImage', '../assets/images/sprites/Letter.png');
        this.load.image('someObjectImage', '../assets/images/sprites/Tape.png');
        this.load.image('doorPaper', '../assets/images/sprites/doorPaper.png');
        this.load.image('Newspaper2', '../assets/images/sprites/L1Letter.png');
        this.load.image('checkpoint', '../assets/images/sprites/checkpoint.png');
    
    }

    create() {
        this.physics.world.gravity.y = 300;
    
        // Load background images
        this.background = this.add.tileSprite(0, 0, 8960, 720, 'background2').setOrigin(0, 0);
        this.midground = this.add.tileSprite(0, 0, 8960, 720, 'midground2').setOrigin(0, 0);
        this.mist = this.add.tileSprite(0, 0, 8960, 720, 'mist2').setOrigin(0, 0);
        this.mist.setDepth(1);

        const checkpoint = this.physics.add.sprite(200, 450, 'checkpoint');
        checkpoint.setImmovable(true);
        checkpoint.body.allowGravity = false;
    
        // Add player sprite
        this.player = this.physics.add.sprite(200, 500, 'player1');
        this.player.body.bounce.y = 0;
        this.player.body.setGravityY(400);
        this.player.body.setSize(54, 156);
        this.player.setDepth(10);
        this.player.setScale(0.75);
    
        // Create animations
        this.anims.create({
            key: 'lightAnim',
            frames: this.anims.generateFrameNumbers('light', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });
    
        this.anims.create({
            key: 'lightAnim2',
            frames: this.anims.generateFrameNumbers('light2', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });
    
        // Move mist
        this.time.addEvent({
            delay: 10,
            loop: true,
            callback: () => {
                this.mist.tilePositionX += 1;
            }
        });
    
        // Play background music
        this.backgroundMusic = this.sound.add('backgroundMusic2', { loop: true, volume: 0.3 });
        this.backgroundMusic.play();
    
        // Load the tilemap and tileset
        const map = this.make.tilemap({ key: 'map12' });
        const tileset = map.addTilesetImage('GP W8 Level 2 Tileset.png', 'tiles12');
    
        // Load layers from the tilemap
        const wallLayer = map.createLayer('Wall', tileset);
        const doorLayer = map.createLayer('Door', tileset);
        const grassLayer = map.createLayer('Grass Layer', tileset);
        const groundLayer = map.createLayer('Platforms', tileset);
    
        // Set collision properties
        groundLayer.setCollisionByProperty({ collides: true });
        groundLayer.setCollisionBetween(0, 93);
        this.physics.add.collider(this.player, groundLayer);
    
    
        // Adjust layer positions and scale
        wallLayer.setPosition(0, 80);
        doorLayer.setPosition(0, 80);
        groundLayer.setPosition(0,80);
        grassLayer.setPosition(0,80);
    
        map.layers.forEach((layer) => {
            if (layer.tilemapLayer) {
                layer.tilemapLayer.scale = 2;
            }
        });
    
        // Create player animations
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player1', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
    
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player1', { start: 4, end: 7 }),
            frameRate: 15,
            repeat: -1
        });
    
        this.anims.create({
            key: 'idle',
            frames: [{ key: 'player1', frame: 8 }],
            frameRate: 20
        });
    
        // Add collider for the player and ground layer
        this.physics.add.collider(this.player, groundLayer);
    
        // Create coins group
        this.coins = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
    
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
    
        // Setup input controls
        this.cursors = this.input.keyboard.createCursorKeys();
    
        // Setup score and coins text
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fontFamily: 'OldEnglish3', fill: '#fff' }).setScrollFactor(0);
        this.coinsText = this.add.text(16, 50, 'Paper Scraps: 0', { fontSize: '32px', fontFamily: 'OldEnglish3', fill: '#fff' }).setScrollFactor(0);
    
        // Setup camera
        this.cameras.main.startFollow(this.player, false, 0.1, 0, 0, 140);
        this.cameras.main.setBounds(0, 0, 2560, map.heightInPixels);
    
        // Add end object and interact prompt
        this.endObject = this.physics.add.sprite(2100, 450, 'someObjectImage');
        this.endObject.setScale(0.25);
        this.endObject.body.allowGravity = false;
        this.endObject.setImmovable(true);
        this.endObject.setDepth(1);
    
        console.log('Interactive Object Position:', this.endObject.x, this.endObject.y);
    
        this.interactPrompt = this.add.sprite(this.endObject.x, this.endObject.y - 100, 'interactPromptAnim');
        this.interactPrompt.setVisible(false);
    
        this.physics.add.overlap(this.player, this.endObject, this.showInteractPrompt, null, this);
    
        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    
        this.anims.create({
            key: 'interactAnim',
            frames: this.anims.generateFrameNumbers('interactPromptAnim', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });
    
        this.messageText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, '', {
            fontSize: '20px',
            fontFamily: 'OldEnglish3',
            fill: '#fff'
        }).setOrigin(0.5);
        this.messageText.setVisible(false);
        this.messageText.setScrollFactor(0);
        this.messageText.setDepth(11);
        this.add.sprite(8150, 550, 'doorPaper');
    }
    

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-300);
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(300);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('idle');
        }

        if (this.cursors.up.isDown && this.player.body.blocked.down) {
            this.player.setVelocityY(-600);
        }

        
        if (this.player.body.blocked.down) {
            this.isFalling = false;
            this.highestY = this.player.y;
        } else {
            if (!this.isFalling) {
                this.isFalling = true;
            } else {
                const fallDistance = this.highestY - this.player.y;
                if (fallDistance > this.fallDistanceThreshold) {
                    this.gameOver();
                }
            }
        }

        
        if (this.player.y > this.cameras.main.height + 1000) {
            this.gameOver();
        }

        
        if (Phaser.Math.Distance.Between(this.player.x, this.player.y, this.endObject.x, this.endObject.y) > 100) {
            this.interactPrompt.setVisible(false);
        } else {
            this.interactPrompt.setVisible(true);
            if (!this.interactPrompt.anims.isPlaying) {
                this.interactPrompt.anims.play('interactAnim');
            }
        }
    }

    gameOver() {

        console.log("Player went out of bounds and died");
        this.scene.start('GameOverScene', { score: this.score, coinsCollected: this.coinsCollected});
        this.sound.stopAll();
        this.Scream = this.sound.add('Scream', { loop: false, volume: 0.5 });
        this.Scream.play();
        this.scene.pause();
        this.resetState();
    }



  
    

collectCoin(player, coin) {
    coin.disableBody(true, true);

    // Check if the coin has a custom property or tag to identify it
    if (coin.customProperty === '2') {
        this.showMessage('caged voices... they long to sing.');
    } else if (coin.customProperty === '6') {
        this.showMessage('Youre not a terrorist, are you?');
    }

    this.coinsCollected += 1;
    this.coinsText.setText('Coins: ' + this.coinsCollected);
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);

    // Check if the 8th coin is collected
    if (coin.customProperty === '8') {
        // Iterate over all objects in the crossesLayer
        this.crossesLayer.forEachTile(tile => {
            // Flip the tile 180 degrees
            tile.rotation = Phaser.Math.DegToRad(180);
        });
        this.Piano = this.sound.add('Piano', { loop: false, volume: 5 });
        this.Piano.play();
        
    }

    this.scrapSound = this.sound.add('ScrapSound', { loop: false, volume: 1 });
    this.scrapSound.play();

    console.log(`Coins collected: ${this.coinsCollected}`);
    console.log(`Score: ${this.score}`);

   // if (this.coinsCollected === 1) {
    //    this.showMessage('Trial.');
    //}
}





    hitHand(player, hand) {
        console.log("Player hit by hand mob and died");
        this.gameOver();
    }

    showEnding() {
        this.messageText.setVisible(false);
        this.backgroundMusic.stop();
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.cameras.main.fadeIn(1000, 0, 0, 0);

            const endingImage = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'Newspaper2');
            endingImage.setOrigin(0.5).setScrollFactor(0);
            endingImage.setDepth(20);

            const nextButton = this.add.text(this.cameras.main.centerX + 250, this.cameras.main.centerY + 300, 'Next', {
                fontSize: '32px',
                fill: '#fff',
                backgroundColor: '#000'
            }).setOrigin(0.5).setScrollFactor(0);

            nextButton.setInteractive({ useHandCursor: true });
            nextButton.on('pointerdown', () => {
                this.cameras.main.fadeOut(1000, 0, 0, 0);
                this.cameras.main.fadeIn(1000, 0, 0, 0);
                this.sound.stopAll();
                this.scene.stop('GameScene12');
                //this.scene.start('EndScene', { score: this.score, coinsCollected: this.coinsCollected});
                this.scene.start('GameScene2');
                
            });


            
            nextButton.setDepth(30);
        });
    }
    
    createButton(x, y, text, callback) {
        const button = this.add.text(x, y, text, { fontSize: '32px', fontFamily: 'OldEnglish3', fill: '#fff' })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', callback)
            .on('pointerover', () => button.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => button.setStyle({ fill: '#fff' }));
    }
    

    showReminder() {
        const reminderText = this.add.text(this.player.x-300, this.player.y - 100, 'You are yet to remember. Collect more scraps', { fontSize: '32px', fontFamily: 'OldEnglish3', fill: '#fff' }).setOrigin(0.5);
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                reminderText.destroy();
            },
            callbackScope: this
        });
    }


    showInteractPrompt(player, endObject) {
        this.interactPrompt.setVisible(true);
        
        this.interactPrompt.anims.play('interactAnim');

        if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
            this.interactPrompt.setVisible(false);
            if (this.coinsCollected >= 0) {
                this.showEnding();
            } else {
                this.showReminder();
            }
        }
    }

    resetState() {
        this.score = 0;
        this.coinsCollected = 0;
    }

    showMessage(message) {
        
        this.messageText.setText(message);
        this.messageText.setVisible(true);
    
        
        this.time.delayedCall(4500, () => {
            this.messageText.setVisible(false);
        });
    }
}

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.player;
        this.cursors;
        this.score = 0;
        this.coinsCollected = 0;
        this.scoreText;
        this.coinsText;
        this.handMobs;
        this.tileCooldowns = {};
        this.stickTileLayer;
    }

    preload() {
        
        this.load.image('tiles', '../assets/images/tilesets/GP W8 Tileset.png');
        this.load.tilemapTiledJSON('map', '../assets/images/tilemaps/GP W8 Tilemap.json');
        this.load.spritesheet('player', '../assets/images/sprites/player.png', { frameWidth: 54, frameHeight: 156 });
        this.load.image('coin', '../assets/images/sprites/scrap.png');

        
        this.load.image('background', '../assets/images/background/Background.png');
        this.load.image('midground', '../assets/images/background/Midground.png');
        this.load.image('mist', '../assets/images/background/Mist.png');
        this.load.spritesheet('light', '../assets/images/background/Lights.png', { frameWidth: 1226, frameHeight: 482 });
        this.load.spritesheet('light2', '../assets/images/background/Light2.png', { frameWidth: 300, frameHeight: 502 });

        
        this.load.image('hand', '../assets/images/sprites/hand.png');

        
        this.load.audio('backgroundMusic', './assets/Sounds/Music/Theme.mp3');
        this.load.audio('ScrapSound', '../assets/Sounds/SFX/Rustle.mp3');
        this.load.audio('Scream', '../assets/Sounds/SFX/Scream.mp3');

        
        this.load.spritesheet('interactPromptAnim', '../assets/images/sprites/TriggerAnim.png', { frameWidth: 80, frameHeight: 78 });
        this.load.image('interactPrompt', '../assets/images/sprites/Trigger.png');
        this.load.image('tape', '../assets/images/sprites/Tape.png');
        this.load.image('endingImage', '../assets/images/sprites/Letter.png');
        this.load.image('someObjectImage', '../assets/images/sprites/Tape.png');
    }

    create() {
        
        this.physics.world.gravity.y = 300;

        
        this.background = this.add.tileSprite(0, 0, 6400, 720, 'background').setOrigin(0, 0);
        this.midground = this.add.tileSprite(0, 0, 6400, 720, 'midground').setOrigin(0, 0);
        this.mist = this.add.tileSprite(0, 0, 6400, 720, 'mist').setOrigin(0, 0);
        this.light = this.add.sprite(155, 190, 'light').setOrigin(0, 0);
        this.light2 = this.add.sprite(2200, 15, 'light2').setOrigin(0, 0);

        
        this.player = this.physics.add.sprite(600, 500, 'player');
        this.player.body.bounce.y = 0; 
        this.player.body.setGravityY(400);
        this.player.body.setSize(54, 156);

        
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

        
        this.light.play('lightAnim');
        this.light2.play('lightAnim2');

        
        this.time.addEvent({
            delay: 10,
            loop: true,
            callback: () => {
                this.mist.tilePositionX += 1;
            }
        });

        
        this.backgroundMusic = this.sound.add('backgroundMusic', { loop: true, volume: 0.3 });
        this.backgroundMusic.play();

        
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('GP W8 Tileset', 'tiles');

        const groundLayer = map.createLayer('Tile Layer 1', tileset);
        const grassLayer = map.createLayer('Grass Tile Layer', tileset);
        this.stickTileLayer = map.createLayer('Stick Tile', tileset); 

        
        groundLayer.setCollisionByProperty({ collides: true });
        groundLayer.setCollisionBetween(0, 59);
        this.physics.add.collider(this.player, groundLayer); 

        
        this.stickTileLayer.setCollisionBetween(27, 29); 
        this.physics.add.collider(this.player, this.stickTileLayer, this.handleStickTileCollision, null, this);

        
        groundLayer.setPosition(0, 20);
        grassLayer.setPosition(0, 20);
        this.stickTileLayer.setPosition(0, 20);

        map.layers.forEach((layer) => {
            layer.tilemapLayer.scale = 2;
        });

        
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: [{ key: 'player', frame: 8 }],
            frameRate: 20
        });

        
        this.physics.add.collider(this.player, groundLayer);

        
        this.coins = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);

        
        this.cursors = this.input.keyboard.createCursorKeys();

        
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fontFamily: 'OldEnglish3', fill: '#fff' }).setScrollFactor(0);
        this.coinsText = this.add.text(16, 50, 'Coins: 0', { fontSize: '32px', fontFamily: 'OldEnglish3', fill: '#fff' }).setScrollFactor(0);

        
        this.cameras.main.startFollow(this.player, false, 0.1, 0, 0, 140);
        this.cameras.main.setBounds(0, 0, 6400, map.heightInPixels);

        
        this.createCoins();

        
        this.createHandMobs();

        
        
        this.endObject = this.physics.add.sprite(6230, 500, 'someObjectImage');
        this.endObject.setScale(0.25);
        this.endObject.body.allowGravity = false; 
        this.endObject.setImmovable(true);

        
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

    createCoins() {
        const coin1 = this.coins.create(1000, 600, 'coin');
        const coin2 = this.coins.create(450, 200, 'coin');
        const coin3 = this.coins.create(1850, 300, 'coin');
        const coin4 = this.coins.create(4800, 200, 'coin');
        const coin5 = this.coins.create(2230, 40, 'coin');
        const coin6 = this.coins.create(3100, 500, 'coin');
        const coin7 = this.coins.create(3180, 100, 'coin');
        const coin8 = this.coins.create(4150, 100, 'coin');
        const coin9 = this.coins.create(4550, 50, 'coin');
        const coin10 = this.coins.create(5470, 100, 'coin');
        const coin11 = this.coins.create(6100, 100, 'coin');
        const coin12 = this.coins.create(5560, 610, 'coin');
    }

    createHandMobs() {
        this.handMobs = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });

        const hand = this.handMobs.create(1850, 800, 'hand');
        const scale = 1;
        hand.setScale(scale);

        this.tweens.add({
            targets: hand,
            y: hand.y - 300,
            ease: 'Linear',
            duration: 2000,
            yoyo: true,
            repeat: -1
        });

        
        const hand2 = this.handMobs.create(3500, 800, 'hand');
        hand2.setScale(1);

        this.tweens.add({
            targets: hand2,
            y: hand2.y - 300,
            ease: 'Linear',
            duration: 2000,
            yoyo: true,
            repeat: -1
        });

        const hand3 = this.handMobs.create(4800, 900, 'hand');
        hand2.setScale(1);

        this.tweens.add({
            targets: hand3,
            y: hand3.y - 300,
            ease: 'Linear',
            duration: 2000,
            yoyo: true,
            repeat: -1
        });

        this.physics.add.collider(this.player, this.handMobs, this.hitHand, null, this);
    }

    collectCoin(player, coin) {
        coin.disableBody(true, true);
        this.coinsCollected += 1;
        this.coinsText.setText('Coins: ' + this.coinsCollected);
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
        
        this.scrapSound = this.sound.add('ScrapSound', { loop: false, volume: 1 });
        this.scrapSound.play();


        console.log(`Coins collected: ${this.coinsCollected}`);
        console.log(`Score: ${this.score}`);

        
        if (this.coinsCollected === 1) {
            this.showMessage('in here, EVERYTHING FLOATS. step on sticks but DONT TRUST THEM.');
        } else if (this.coinsCollected === 2) {
            this.showMessage('beware THE HANDS. They yearn for what they lost.');
        } else if (this.coinsCollected === 5) {
            this.showMessage('will you REMEMBER? will you get out of here this time?');
        } else if (this.coinsCollected === 8) {
            this.showMessage('grief causes people to commit unspeakable things, but wasnt that too much?');
        } else if (this.coinsCollected === 10) {
            this.showMessage('Theres no turning back.');
        }
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

            const endingImage = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'endingImage');
            endingImage.setOrigin(0.5).setScrollFactor(0);
            this.add.text(640, 100, 'MISSING', { fontSize: '55px', fontFamily: 'OldEnglish3', fill: '#8B0000' }).setOrigin(0.5).setScrollFactor(0);
        this.add.text(640, 200, 'Lito Gomez', { fontSize: '40px', fontFamily: 'OldEnglish3', fill: '#000000' }).setOrigin(0.5).setScrollFactor(0);
        this.add.text(649, 260, '22 year old, Male', { fontSize: '25px', fontFamily: 'OldEnglish3', fill: '#000000' }).setOrigin(0.5).setScrollFactor(0);
        this.add.text(700, 500, 'Thats your name. You know it. Ill help you along the way. Just stay strong.', { fontSize: '15px', fontFamily: 'Conte', fill: '#000000' }).setOrigin(0.5).setScrollFactor(0);

            const nextButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 200, 'Next', {
                fontSize: '32px',
                fill: '#fff',
                backgroundColor: '#000'
            }).setOrigin(0.5).setScrollFactor(0);

            nextButton.setInteractive({ useHandCursor: true });
            nextButton.on('pointerdown', () => {
                this.sound.stopAll();
                this.scene.start('EndScene', { score: this.score, coinsCollected: this.coinsCollected});
                this.scene.stop();
            });


            
            nextButton.setDepth(10);
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
        const reminderText = this.add.text(this.player.x-300, this.player.y - 100, 'You are yet to remember. Collect all 12 scraps', { fontSize: '32px', fontFamily: 'OldEnglish3', fill: '#fff' }).setOrigin(0.5);
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                reminderText.destroy();
            },
            callbackScope: this
        });
    }

    handleStickTileCollision(player, tile) {
        
        if (tile.layer.name === 'Stick Tile') {
            const tileX = tile.x;
            const tileY = tile.y;
            const tileKey = `${tileX},${tileY}`;
            const currentTime = this.time.now;
            if (!this.tileCooldowns[tileKey] || (currentTime - this.tileCooldowns[tileKey] > 500)) {
                console.log('Detect');
                this.tileCooldowns[tileKey] = currentTime;
                this.time.delayedCall(500, () => {
                    this.stickTileLayer.removeTileAt(tileX, tileY); 
                    
                    
                    this.time.delayedCall(1000, () => {
                        this.stickTileLayer.putTileAt(tile.index, tileX, tileY);
                    }, [], this);
                }, [], this);
            }
        }
    }

    showInteractPrompt(player, endObject) {
        this.interactPrompt.setVisible(true);
        
        this.interactPrompt.anims.play('interactAnim');

        if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
            this.interactPrompt.setVisible(false);
            if (this.coinsCollected >= 12) {
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

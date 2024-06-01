export default class GameScene3 extends Phaser.Scene {
    constructor() {
        super('GameScene3');
        this.player;
        this.cursors;
        this.score = 0;
        this.coinsCollected = 0;
        this.scoreText;
        this.coinsText;
        this.handMobs;
        this.tileCooldowns = {};
        this.stickTileLayer;
        this.crossesLayer;
        this.enemy;
        this.enemies;
    }   

    preload() {
        
        this.load.image('tiles3', '../assets/images/tilesets/GP W8 Level 2 Tileset.png'); //tiles
        this.load.tilemapTiledJSON('map3', '../assets/images/tilemaps/GP W8 Lvl 3 Tilemap.json'); //map
        this.load.spritesheet('player3', '../assets/images/sprites/player.png', { frameWidth: 54, frameHeight: 156 });
        this.load.image('coin', '../assets/images/sprites/scrap.png');

        this.load.image('background2', '../assets/images/background/Background2.png');
        this.load.image('midground2', '../assets/images/background/Midground2.png');
        this.load.image('mist2', '../assets/images/background/Mist2.png');
        this.load.spritesheet('light', '../assets/images/background/Lights.png', { frameWidth: 1226, frameHeight: 482 });
        this.load.spritesheet('light2', '../assets/images/background/Light2.png', { frameWidth: 300, frameHeight: 502 });

        //Mob
        this.load.image('hand', '../assets/images/sprites/hand.png');
        this.load.image('cage', '../assets/images/sprites/Cage.png');
        this.load.image('enemy', '../assets/images/sprites/Enemy.png');



        this.load.audio('backgroundMusic', './assets/Sounds/Music/Theme.mp3');
        this.load.audio('chase', './assets/Sounds/Music/Chase.mp3');
        this.load.audio('ScrapSound', '../assets/Sounds/SFX/Rustle.mp3');
        this.load.audio('Scream', '../assets/Sounds/SFX/Scream.mp3');
        this.load.audio('Piano', '../assets/Sounds/SFX/DissonantPiano.mp3');

        
        this.load.spritesheet('interactPromptAnim', '../assets/images/sprites/TriggerAnim.png', { frameWidth: 80, frameHeight: 78 });
        this.load.image('interactPrompt', '../assets/images/sprites/Trigger.png');
        this.load.image('tape', '../assets/images/sprites/Tape.png');
        this.load.image('endingImage', '../assets/images/sprites/L1Letter.png');
        this.load.image('someObjectImage', '../assets/images/sprites/Tape.png');
        this.load.image('doorPaper', '../assets/images/sprites/doorPaper.png');
    }

    create() {
        
        this.physics.world.gravity.y = 300;

        
        this.background = this.add.tileSprite(0, 0, 8960, 720, 'background2').setOrigin(0, 0);
        this.midground = this.add.tileSprite(0, 0, 8960, 720, 'midground2').setOrigin(0, 0);
        this.mist = this.add.tileSprite(0, 0, 8960, 720, 'mist2').setOrigin(0, 0);
        this.mist.setDepth(1);
        

        
        this.player = this.physics.add.sprite(100, 570, 'player3');
        this.player.body.bounce.y = 0; 
        this.player.body.setGravityY(400);
        this.player.body.setSize(54, 156);
        this.player.setDepth(10);
        this.player.setScale(0.75);

        
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

        
        //this.light.play('lightAnim');
        //this.light2.play('lightAnim2');

        
        this.time.addEvent({
            delay: 10,
            loop: true,
            callback: () => {
                this.mist.tilePositionX += 1;
            }
        });

        
        this.backgroundMusic = this.sound.add('backgroundMusic', { loop: true, volume: 0.3 });
        this.backgroundMusic.play();

        
        const map = this.make.tilemap({ key: 'map3' });
        const tileset = map.addTilesetImage('GP W8 Lvl 3 Tileset', 'tiles3');

        
        const amakanLayer = map.createLayer('Behind Walls', tileset);
        const wallLayer = map.createLayer('Walls', tileset);
        const roofLayer = map.createLayer('Roof', tileset);
        const wallAdornLayer = map.createLayer('Wall Adornments', tileset);
        this.crossesLayer = map.createLayer('Crosses', tileset);
        const eCollideLayer = map.createLayer('Enemy Collider', tileset);
        this.eCollideLayer = eCollideLayer;  // Add this line to ensure it's available in the rest of the code



    

        this.stickTileLayer = map.createLayer('Stick Tile', tileset);
        const groundLayer = map.createLayer('Platforms', tileset);

        
        groundLayer.setCollisionByProperty({ collides: true });
        groundLayer.setCollisionBetween(0, 93);
        this.physics.add.collider(this.player, groundLayer); 

        
        this.stickTileLayer.setCollisionBetween(0, 4); 
        this.physics.add.collider(this.player, this.stickTileLayer, this.handleStickTileCollision, null, this);


        groundLayer.setPosition(0, 80);
        wallLayer.setPosition(0, 80);
        this.stickTileLayer.setPosition(0, 80);
        roofLayer.setPosition(0, 80);
        wallAdornLayer.setPosition(0, 80);
        this.crossesLayer.setPosition(0,80);
        amakanLayer.setPosition(0,80);
        eCollideLayer.setPosition(0,80);
        this.eCollideLayer.setCollisionByProperty({ collides: true });
        //this.physics.add.collider(this.enemy, this.eCollideLayer);
        
        

        map.layers.forEach((layer) => {
            if (layer.tilemapLayer) {
                layer.tilemapLayer.scale = 2;
            }
        });
        


        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player3', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player3', { start: 4, end: 7 }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: [{ key: 'player3', frame: 8 }],
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
        this.cameras.main.setBounds(0, 0, 8960, map.heightInPixels);

        
        this.createCoins();

        
        this.createHandMobs();

        
        
        this.endObject = this.physics.add.sprite(8530, 350, 'someObjectImage');
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

        this.add.sprite(8540, 350, 'doorPaper');

        this.enemies = this.physics.add.group({
            allowGravity: false,
            immovable: false
        });
        this.physics.add.collider(this.enemies, this.player, this.hitEnemy, null, this);

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
        this.enemies.children.iterate(enemy => {
            if (enemy) {
                enemy.setVelocityX(250); // Constantly move to the right
            }
        });
        
        
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
        // Create coins
        const coin1 = this.coins.create(250, 300, 'coin');
        const coin2 = this.coins.create(1200, 240, 'coin');
        const coin3 = this.coins.create(1400, 240, 'coin');
        const coin4 = this.coins.create(2080, 180, 'coin');

        const coin5 = this.coins.create(3500, 180, 'coin');
        const coin6 = this.coins.create(4500, 180, 'coin');
        const coin7 = this.coins.create(6300, 180, 'coin');
        const coin8 = this.coins.create(7750, 350, 'coin');

        // Set custom properties for specific coins
        coin1.customProperty = '1'; // This is a regular coin
        coin2.customProperty = '2'; // This is a special coin
        coin4.customProperty = '4';
    }

    createHandMobs() {
        this.handMobs = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
    
    
    
        // Add the second "cage" mob using a container
        const cageContainer2 = this.add.container(6800, -520);
        const cage2 = this.add.sprite(0, 0, 'cage');
        cage2.setOrigin(0, 0);
        cage2.setScale(1);
        cageContainer2.add(cage2);
    
        // Add a collider to the second container
        this.physics.add.existing(cageContainer2);
        cageContainer2.body.setSize(cage2.width, cage2.height);
        cageContainer2.body.allowGravity = false;
        cageContainer2.body.immovable = true;
    
        this.tweens.add({
            targets: cageContainer2,
            angle: { from: -90, to: 90 },
            ease: 'Sine.easeInOut',
            duration: 4000,
            yoyo: true,
            repeat: -1
        });
    
        // Add collision between player and hand mobs
        this.physics.add.collider(this.player, this.handMobs, this.hitHand, null, this);
    }

    spawnEnemy() {
        this.enemy = this.enemies.create(1000, 360, 'enemy');
        this.enemy.setScale(1); // Adjust size if needed
        this.enemy.setVelocityX(200); // Move to the right
        this.enemy.setDepth(10);
    
        // Despawn the enemy after 10 seconds
        this.time.delayedCall(19000, () => {
            this.enemy.destroy();
            this.backgroundMusic = this.sound.add('backgroundMusic', { loop: true, volume: 0.3 });
            this.backgroundMusic.play();    
        }, [], this);
    }
    

    hitEnemy(player, enemy) {
        console.log("Player hit by enemy and died");
        this.gameOver();
    }
    
    
    

collectCoin(player, coin) {
    coin.disableBody(true, true);

    // Check if the coin has a custom property or tag to identify it
    if (coin.customProperty === '2') {
        this.showMessage('caged voices... they long to sing.');
    }

    this.coinsCollected += 1;
    this.coinsText.setText('Coins: ' + this.coinsCollected);
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);

    // Check if the 8th coin is collected
    if (coin.customProperty === '4') {
        // Iterate over all objects in the crossesLayer
        this.crossesLayer.forEachTile(tile => {
            // Flip the tile 180 degrees
            tile.rotation = Phaser.Math.DegToRad(180);
        });
        this.sound.stopAll();
        this.Piano = this.sound.add('Piano', { loop: false, volume: 3 });
        this.Piano.play();

        this.chase = this.sound.add('chase', { loop: false, volume: 5 });
        this.chase.play();
        this.spawnEnemy();

        
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

            const endingImage = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'endingImage');
            endingImage.setOrigin(0.5).setScrollFactor(0);
            //endingImage.setDepth(20);

            const nextButton = this.add.text(this.cameras.main.centerX + 250, this.cameras.main.centerY + 300, 'Next', {
                fontSize: '32px',
                fill: '#fff',
                backgroundColor: '#000'
            }).setOrigin(0.5).setScrollFactor(0);

            nextButton.setInteractive({ useHandCursor: true });
            nextButton.on('pointerdown', () => {
                this.sound.stopAll();
                this.scene.stop('GameScene3');
                this.scene.start('EndScene', { score: this.score, coinsCollected: this.coinsCollected});
                
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
            if (this.coinsCollected >= 5) {
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

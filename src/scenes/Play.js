class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    preload() {
        // load the necessary images and tile sprites
        this.load.image('pixel_guy', './assets/sprites/pixel_guy.png'); //placeholder
        this.load.image('bounds', './assets/sprites/bounds.png'); //placeholder
        this.load.image('obstacle', './assets/sprites/obstacle.png'); //placeholder
        
    
    }

    create() {
        // define key codes
        var spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // spawn player and set its gravity
        this.player = this.physics.add.sprite(game.config.width/3, 400, 'pixel_guy');
        game.settings.gamePlayer = this.player;
        this.player.setVelocityY(-300);
        this.player.setGravityY(500);

        // spawn the floor and set it immovable
        let floor = this.physics.add.sprite(game.config.width/2, game.config.width/2 + 110, 'bounds').
            setScale(4, 0.5);
        floor.setImmovable();

        // spawn the roof and set it immovable
        let roof = this.physics.add.sprite(game.config.width/2, 40, 'bounds').
            setScale(4, 0.5);
        roof.setImmovable();

        /*
        // spawn first obstacle
        this.initObstacle = this.physics.add.sprite(game.config.width/3, 480, 'obstacle').
            setScale(1, 4);
        this.initObstacle.setImmovable();

        // spawn test obstacle
        this.initObstacle2 = this.physics.add.sprite(game.config.width, 480, 'obstacle').
        setScale(1, 4);
        this.initObstacle2.setImmovable();

        */

        this.initObstacle = new Obstacle(this, game.config.width/3, 480, 'obstacle').setScale(1, 4);
        this.add.existing(this.initObstacle);

        // set the collision property of player on floor and roof
        this.physics.add.collider(this.player, floor);
        this.physics.add.collider(this.player, roof);
        this.physics.add.collider(this.player, this.initObstacle);
       // this.physics.add.collider(this.player, this.initObstacle2); //testing

        // set up cursor keys
        controls = this.input.keyboard.createCursorKeys();

        // BOOLEAN VARS
        this.isSlamming = false; //keeps track of if player is ground slamming
        this.isGameOver = false; //keeps track of if game should go to game over scene

    }

    // Jump function
    jump() {
        this.player.setVelocityY(-500);
    }

    // Ground slam function
    groundSlam() {
        this.player.setVelocityY(850);
    }

    // Randomize the size of the obstacle
    spawnObstacle() {

    }

    update() {

        this.initObstacle.update();

        // jump functionality, single jump only
        if (Phaser.Input.Keyboard.JustDown(controls.up) && 
            this.player.body.touching.down) {
            this.jump();
        }

        // ground slam functionality
        if (Phaser.Input.Keyboard.JustDown(controls.down) && 
        !this.player.body.touching.down) {
            this.isSlamming = true;
            this.player.angle = 0;
            this.groundSlam();
        }

        // Spin the player whilst in the air
        if(!this.player.body.touching.down && !this.isSlamming) {
            this.player.angle += 10;
        }

        // reset the player angle when back on the ground
        if(this.player.body.touching.down) {
            this.player.angle = 0;
            if(this.isSlamming) {
                // shake the camera duration and intensity
                this.cameras.main.shake(50, 0.005);
                this.isSlamming = false;
            }
        }

        //check if out of bounds to the left
        if(this.player.x < 100 && !this.isGameOver) {
            console.log("GAME OVA");
            this.isGameOver = true;
            this.scene.start('gameOver');
        }   
    }    
}
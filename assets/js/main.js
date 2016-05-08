// Creates a new 'main' state that wil contain the game
var main_state = {

    preload: function() { 
		// Function called first to load all the assets
		// That's where we load the images and sounds


        // Set background color
        this.game.stage.backgroundColor = 'blue';

		/* Load the bird sprite */
		game.load.image('bird', 'assets/images/bird.png');

		// Load the pipe sprite
		game.load.image('pipe', 'assets/images/pipe.png');

        // Load the sounds sprite
        this.game.load.audio('jump','assets/jump.wav');
    },

    create: function() { 
    	// Fuction called after 'preload' to setup the game
    	// Here we set up the game, display sprites, etc.

    	// Change the background Color of the game to blue
    	game.state.backgroundColor = '#71c5cf';

		//Set the physic system
    	game.physics.startSystem(Phaser.Physics.ARCADE);

		//Display the brid at the posittion x = 100 and y = 245
		this.bird = game.add.sprite(100, 245, 'bird');

		// Add physics to the bird
		// Needed for: movements, gravity, collisions, etc.
		game.physics.arcade.enable(this.bird);

		//Add gravity to the bird to make it faill
		this.bird.body.gravity.y = 1000;

		//Call the 'jump' function when the spacekey is hit

		var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		spaceKey.onDown.add(this.jump, this);

		// Create an empty group
		this.pipes = game.add.group();

		// Add pipes in our game every 1.5 seconds
		this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

		// Add score and handling collisions
		this.score = 0;
		this.labelScore = game.add.text(20, 20, "0",{font: "30px Arial", fill: "#ffffff"});   

        // Move the anchor to the left and downward
        this.bird.anchor.setTo(-0.2, -0.5);

        // Add sound in the game
        this.jumpSound = game.add.audio('jump');
    },
    
    update: function() {
		// Function called 60 times per second
		// It contains the game's logic
		// If the bird is out of the screen (too high or too low)
		// Call the 'restartGame' function
		if(this.bird.y < 0 || this.bird.y > 490){
			this.restartGame();
		}
		// Call the 'restartGame' function each time the bird collides width a pipe from the pipes group.
		game.physics.arcade.overlap(this.bird, this.pipes, this.restartGame, null, this);

        // And animotion
        if(this.bird.angle < 20){
            this.bird.angle += 1;
        }

        // Add dead animotion
        game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);
    },

    // Make the bird jump
    jump: function() {
    	// Add a vertical velocity to the bird
    	this.bird.body.velocity.y = -350;

        // Create an animation on the bird
        var animation = game.add.tween(this.bird);

        //Change the angle of the bord to -20° in 100 milliseconds
        animation.to({'angle': -20}, 100);

        // And start the animotion
        animation.start();

        // If the bird has already hit a pipe, do nothing
        // It means the bird is already falling off the screen
        if(this.bird.alive = false){
            return;
        }
        // Play the sound effect.
        this.jumpSound.play();
    },

    // Restart the game
    restartGame: function() {
    	// Start the 'main' state, which restart the game
    	game.state.start('main');
    },

    addOnePipe: function(x,y){
    	// Create a pipe at the position x and y
    	var pipe = game.add.sprite(x, y, 'pipe');

    	// Add the pipe to our previously created group
    	this.pipes.add(pipe);

    	// Enable physics on the pipe
    	game.physics.arcade.enable(pipe);

    	// Addvelocity to the pipe to make it move left
    	pipe.body.velocity.x = -200;

    	// Automatically kill the pipe when it's no longer visible
    	pipe.checkWorldBounds = true;
    	pipe.outOfBoundsKill = true;
    },
    addRowOfPipes: function() {
    	// Randomly pick a number between 1 and 5
    	// This will be the hole position
    	var hole = Math.floor(Math.random() * 5) + 1;

    	// Add the 6 pipes
    	// With one big hole at position 'hole' and 'hole + 1'
    	for (var i =0; i < 8; i++){
    		if(i != hole && i != hole + 1){
    			this.addOnePipe(400, i * 60 + 10);
    		}
    	}

    	// Increase the score by 1 each time new pipes are created
    	this.score += 1;
    	this.labelScore.text = this.score;
    },
    hitPipe: function() {
        // set the alive property of the bird to fasle
        this.bird.alive = false;

        // Prevent new pipes form appearing
        game.time.events.remove(this.timer);

        // Go through all the pipes, and stop their movement
        this.pipes.forEach(function(p){
            p.body.velocity.x = 0;
        }, this);
    }
};

// Initialize Phaser, and creates a 400x490px game
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game_div');
// Add and start the 'main' state to start the game
game.state.add('main', main_state);  
game.state.start('main'); 
// define variables
var game;
var player;
var platforms;
var badges;
var items;
var cursors;
var jumpButton;
var text;
var winningMessage;
var won = false;
var lives;
var livesScore = 3;
var losingMessage;
var lose=false;
var currentScore = 0;
var winningScore = 100;


//add stars to the game
function addStars() {
  star = game.add.physicsGroup();
  createStar(425, 100, 'star');
  createStar(315, 100, 'star');
  createStar(175, 200, 'star');
  createStar(175, 500, 'star');
  createStar(175, 300, 'star');
 
}

//add poison to the game
function addPoison(){
  poison = game.add.physicsGroup();
  createPoison(675, 275, 'poison');
  createPoison(450, 375, 'poison');            
  createPoison(375, 475, 'poison');     
}

// add platforms to the game
function addPlatforms() {
  platforms = game.add.physicsGroup();
  platforms.create(300, 150, 'platform2');
  platforms.create(400, 250, 'platform2');
  platforms.create(100, 250, 'platform2');
  platforms.create(500, 350, 'platform2');
  platforms.create(400, 450, 'platform2');
  platforms.create(300, 550, 'platform2');

  platforms.setAll('body.immovable', true);
}


function createStar(left, top, image) {
  var item = star.create(left, top, image);
  item.animations.add('spin');
  item.animations.play('spin', 10, true);
}

function createPoison(left, top, image){
 var item = poison.create(left, top, image);
  item.animations.add('spin');
  item.animations.play('spin', 10, true);
}
// create the winning badge and add to screen
function createBadge() {
  badges = game.add.physicsGroup();
  var badge = badges.create(750, 400, 'badge');
  badge.animations.add('spin');
  badge.animations.play('spin', 10, true);
}

// when the player collects a star on the screen
function starCollect(player, item) {
  item.kill();
  
  currentScore = currentScore + 25;
  if (currentScore === winningScore) {
      createBadge();
  }
}

function poisonCollect(player, item) {
  item.kill();
  
  livesScore = livesScore - 1;
  if (livesScore === 0) {
      lose = true;
  }
}

// when the player collects the badge at the end of the game
function badgeHandler(player, badge) {
  badge.kill();
  won = true;
}

// setup game when the web page loads
window.onload = function () {
  game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
  
  // before the game begins
  function preload() {
    game.stage.backgroundColor = '#B78DFD';
    
    //Load image
    game.load.image('platform2', 'platform_2.png');
    
    //Load spritesheets to load animated images
    game.load.spritesheet('player', 'mikethefrog.png', 32, 32); 
    game.load.spritesheet('badge', 'badge.png', 42, 54);
    game.load.spritesheet('poison', 'poison.png', 32, 32); //w, h in last 2 fields
    game.load.spritesheet('star', 'star.png', 32, 32);
  }

  // initial game set up
  function create() {
    player = game.add.sprite(50, 600, 'player');
    player.animations.add('walk');
    player.anchor.setTo(0.5, 1);
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 500;

    addStars();
    addPlatforms();
    addPoison();

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    text = game.add.text(16, 16, "SCORE: " + currentScore, { font: "bold 24px Arial", fill: "white" });
    lives = game.add.text(685, 16, "LIVES: " + lives, { font: "bold 24px Arial", fill: "white" });
    winningMessage = game.add.text(game.world.centerX, 275, "", { font: "bold 48px Arial", fill: "white" });
    winningMessage.anchor.setTo(0.5, 1);
    losingMessage = game.add.text(game.world.centerX, 275, "", { font: "bold 48px Arial", fill: "white" });
    losingMessage.anchor.setTo(0.5, 1);
  }

  // while the game is running
  function update() {
    text.text = "SCORE: " + currentScore;
    lives.text = "LIVES: " + livesScore;
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.overlap(player, star, starCollect);
    game.physics.arcade.overlap(player, poison, poisonCollect);
    game.physics.arcade.overlap(player, badges, badgeHandler);
    player.body.velocity.x = 0;

    // is the left cursor key presssed?
    if (cursors.left.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.x = -300;
      player.scale.x = - 1;
    }
    // is the right cursor key pressed?
    else if (cursors.right.isDown) {
      player.animations.play('walk', 10, true);
      player.body.velocity.x = 300;
      player.scale.x = 1;
    }
    // player doesn't move
    else {
      player.animations.stop();
    }
    
    if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down)) {
      player.body.velocity.y = -400;
    }
    // when the player wins the game
    if (won) {
      winningMessage.text = "YOU WIN!!!";
      game.paused = true;
    }
    
    if(lose) {
      losingMessage.text = "YOU LOSE!!!";
      lives.text = "LIVES: " + livesScore;
       game.paused = true;
  }
 }

  function render() {

  }

};

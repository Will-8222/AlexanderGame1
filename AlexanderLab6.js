/* Will Alexander Lab6 */

// ====================================================== //
// ==================Variables========================== //
// ====================================================== //

var MAX_LIVES = 3;
var MAX_TARGETS = 15;
var MIN_TARGET_RADIUS = 10;
var MAX_TARGET_RADIUS = 150;
var STARTING_TARGET_SPEED = 1;
var TARGET_DROP_RATE = 2;
var MAX_PROJECTILES = 50;
var PROJECTILE_SPEED = 15;
var TIME_BETWEEN_SPEEDUPS = 1000;
//
// Global Variables
//
var lives = MAX_LIVES;
var canvas;
var context;
var targets = new Array();
var projectiles = new Array();
var curTarget = 0;
var curProjectile = 0;
var bossSpawned = false;

var newlife = 0;
var level = 1;
var level2 = 1;
var gameStarted = false;

var score = 0;
var curTargetSpeed = STARTING_TARGET_SPEED;
var gamePaused = false;
var timer = 0;
var projectileDamage = 20;

weakEnemy = new Image();
weakEnemy.src = "Images/spaceship/ship2.png";
mediumEnemy = new Image();
mediumEnemy.src = "Images/spaceship/shipMedium.png";
hardEnemy = new Image();
hardEnemy.src = "Images/spaceship/shipLarge.png";
extraHardEnemy = new Image();
extraHardEnemy.src = "Images/spaceship/shipBoss.png";
bossEnemy = new Image();
bossEnemy.src = "Images/spaceship/boss.png";
base_image = new Image();
base_image.src = "Images/spaceship/ship9b.png";
projectile_image = new Image();
projectile_image.src = "Images/spaceship/laser.png";

hitEnemy = new Image();
hitEnemy.src = "Images/spaceship/shipcolored.png";

var context, controller, avatar, loop;
var gravity = 1.5;
var noGravity = 0;

var jumpHeight = 20;
var speed = 5;
var velocity = 1;
var runningVelocity = 2;

var playing = false;
var victory = false;

canvas = document.getElementById("canvas");
context = canvas.getContext("2d");

context.canvas.height = 600;
context.canvas.width = 800;

var laserSound = document.getElementById("laserSound");

avatar = {
  height: 60, // was 32
  jumping: true,
  width: 60, // was 32
  x: 400, // was 144, // center of the canvas
  x_velocity: 0,
  y: 0,
  y_velocity: 0,
  dead: false,
  flying: false
};

controller = {
  left: false,
  right: false,
  up: false,
  running: false,

  keyListener: function(event) {
    var key_state = event.type == "keydown" ? true : false;

    switch (event.keyCode) {
      case 37: // left key
        controller.left = key_state;
        break;
      case 38: // up key
        controller.up = key_state;
        flying = true;
        break;
      case 39: // right key
        controller.right = key_state;
        break;
      case 65: // a key
        controller.left = key_state;
        break;
      case 87: // w key
        controller.up = key_state;
        flying = true;
        break;
      case 68: // d key
        controller.right = key_state;
        break;
      case 32: // space key
        controller.up = key_state;

        break;
      case 16: // shift key
        controller.running = key_state; // Activate running
        break;
      case 27: // esc key
        document.exitPointerLock =
          document.exitPointerLock ||
          document.mozExitPointerLock ||
          document.webkitExitPointerLock;
        document.exitPointerLock();
        break;
      case 71:
        //levelUp();
        if(lives >= 2){         
          projectileDamage = projectileDamage + 20;
          PROJECTILE_SPEED = PROJECTILE_SPEED + 2;
        if ((level = 1)) {
          base_image.src = "Images/spaceship/shiplevel2.png";
          level = 2;
        } else if ((level = 2)) {
          base_image.src = "Images/spaceship/shiplevel3.png";
          level = 3;
        } else if ((level = 3)) {
          base_image.src = "Images/spaceship/shiplevel4.png";
          level = 4;
        } else if ((level = 4)) {
          base_image.src = "Images/spaceship/shiplevel5.png";
          level = 5;
        } else if ((level = 5)) {
          base_image.src = "Images/spaceship/shiplevel6.png";
          level = 6;
        }
        break;
      }
    }
  }
};

// ##################################################################### //
// ##############################Functions############################## //
// ##################################################################### //

$(document).ready(function() {
  $("canvas").click(function() {
    if (gameStarted == false) {
      gameStarted = true;
	canvas.requestPointerLock =
        canvas.requestPointerLock ||
        canvas.mozRequestPointerLock ||
        canvas.webkitRequestPointerLock;
      canvas.requestPointerLock();
      restartGame();
    } else {
      stoplaserSound();
      //gamePaused = falSSse;
      avatarShoot();
      canvas.requestPointerLock =
        canvas.requestPointerLock ||
        canvas.mozRequestPointerLock ||
        canvas.webkitRequestPointerLock;
      canvas.requestPointerLock();
      playlaserSound();
    }
  });
});

// ====================================================== //

function gameTutorial() {
  // clear the canvas

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#202020";
  context.fillRect(0, 0, 800, 600); // x, y, width, height  */
  context.font = "30px Verdana";
  context.fillStyle = "#f1f1f1";
  context.fillText("Use the W,A,S,D keys to move the avatar.", 100, 150);
  context.fillText("Shift to Run and mouse click to shoot.", 100, 200);
  context.fillText("Click to Begin", 300, 300);
  context.fillText("note: Clicking G boosts speed and damage", 100, 400);
  //context.onClick = loop();
}

// ====================================================== //

function endGame() {
  gameStarted = false;

  if (victory == true) {
    // clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#202020";
    context.fillRect(0, 0, 800, 600); // x, y, width, height  */
    context.font = "30px Verdana";
    context.fillStyle = "#f1f1f1";
    context.fillText("Congratulations! You defeated the Boss", 100, 280);
    context.fillText("and you defeated " + score + " Enemies", 160, 320);
    context.fillText("Click to Retry or ESC to Exit", 175, 350);
  } else {
    // clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#202020";
    context.fillRect(0, 0, 800, 600); // x, y, width, height  */
    context.font = "30px Verdana";
    context.fillStyle = "#f1f1f1";
    context.fillText("Game Over! You defeated " + score + " Enemies", 130, 300);
    context.fillText("Click to Retry or ESC to Exit", 175, 350);
  }
}

// ====================================================== //

function loop() {
  // clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "#202020";
  context.fillRect(0, 0, 800, 600); // x, y, width, height  */

  showScore();
  //
  // if there are no more lives, pause the game.
  //
  if (lives <= 0) {
    endGame();
    if (gamePaused) {
      /* playDeathAudio();
        endGame(); */
    } else gamePaused = true;
  }
  // if the game is paused, just loop.
  if (gamePaused) {
    return;
  }
  // speed up the target fall rate over time.
  timer++;
  if (timer >= TIME_BETWEEN_SPEEDUPS) {
    curTargetSpeed++;
    timer = 0;
  }

  if (controller.up && avatar.jumping == false) {
    avatar.y_velocity -= 20;
    avatar.jumping = true;
  }

  if (controller.left) {
    if (controller.running) {
      avatar.x_velocity -= runningVelocity;
    } else {
      avatar.x_velocity -= velocity;
    }
  }

  if (controller.right) {
    if (controller.running) {
      avatar.x_velocity += runningVelocity;
    } else {
      avatar.x_velocity += velocity;
    }
  }
  // avatar.y_velocity += gravity; // gravity 1.5
  if ((avatar.flying = true)) {
    avatar.y_velocity -= noGravity; // gravity 0
  }
  avatar.y_velocity += gravity; // gravity 1.5

  avatar.x += avatar.x_velocity;
  avatar.y += avatar.y_velocity;
  avatar.x_velocity *= 0.9; // friction
  avatar.y_velocity *= 0.9; // friction

  // if avatar is falling below floor line
  if (avatar.y > 600 - 16 - 60) {
    avatar.jumping = false;
    avatar.y = 600 - 16 - 60;
    avatar.y_velocity = 0;
  }

  // if avatar is going off the left of the screen
  if (avatar.x < -60) {
    avatar.x = 800;
  } else if (avatar.x > 800) {
    // if avatar goes past right boundary

    avatar.x = -60;
  }

  //
  // draw the avatar, targets and projectiles.
  //
  /*  drawAvatar(); */

  context.drawImage(
    base_image,
    avatar.x,
    avatar.y,
    avatar.width,
    avatar.height
  );

  for (i = 0; i < targets.length; i++) {
    moveTarget(targets[i]);
    drawTarget(targets[i]);
  }
  for (i = 0; i < projectiles.length; i++) {
    moveProjectile(projectiles[i]);
    drawProjectile(projectiles[i]);
  }
  // release targets randomly
  releaseTarget();

  context.fillStyle = "#ff0000"; // hex for red */
  context.beginPath();

  context.drawImage(
    base_image,
    avatar.x,
    avatar.y,
    avatar.width,
    avatar.height
  );

  //context.drawImage(avatar.x, avatar.y, avatar.width, avatar.height);
  context.fill();
  context.strokeStyle = "#d11414";
  context.lineWidth = 4;
  context.beginPath();
  context.moveTo(0, 580); // was 164
  context.lineTo(800, 580); // was 164
  context.stroke();

  // call update when the browser is ready to draw again
  window.requestAnimationFrame(loop);
}
// ====================================================== //

$("canvas").click(function() {
  window.addEventListener("keydown", controller.keyListener);
  window.addEventListener("keyup", controller.keyListener);
});

// ====================================================== //

function levelUp() {
  if (lives > 1 && level <= 6) {
    lives--;
    level = level + 1;
  }
}

// ====================================================== //

function getLevel() {
  switch (level) {
    case 1:
      base_image.src = "Images/spaceship/ship9b.png";
      // level = 2;
      break;
    case 2:
      base_image.src = "Images/spaceship/shiplevel2.png";
      //level = 3;
      break;
    case 3:
      base_image.src = "Images/spaceship/shiplevel3.png";
      // level = 4
      break;
    case 4:
      base_image.src = "Images/spaceship/shiplevel4.png";
      // level = 5
      break;
    case 5:
      base_image.src = "Images/spaceship/shiplevel5.png";
      //level = 6
      break;
    case 6:
      base_image.src = "Images/spaceship/shiplevel6.png";
      break;
  }
}

// ====================================================== //

function showScore() {
  context.font = "30px Verdana";
  $("#score")
    .last()
    .html("Score: " + score + " Lives: " + lives, 20, 30);
}

// ====================================================== //

function releaseTarget() {
  if (Math.random() * 100 < TARGET_DROP_RATE) {
    //releaseTarget(targets[curTarget]);
    targets[curTarget] = createTarget();
    targets[curTarget].visible = true;
    curTarget++;
    if (curTarget == MAX_TARGETS) curTarget = 0;
  }
}

// ====================================================== //

function createTarget() {
  if (score >= 20 && bossSpawned == false) {
    var b = new Object();

    b.radius = 300;
    b.x = 300;
    b.y = 0;
    b.speed = 0.1;
    b.visible = false;
    b.width = b.radius;
    b.height = b.radius;
    b.health = 500;
    b.points = 1;
    bossSpawned = true;
  } else {
    var b = new Object();

    b.radius =
      MIN_TARGET_RADIUS +
      Math.random() * (MAX_TARGET_RADIUS - MIN_TARGET_RADIUS);
    b.x = Math.random() * (canvas.width - b.radius) + b.radius / 2;
    b.y = 0;
    b.speed = Math.random() * curTargetSpeed + 1;
    b.visible = false;
    // from: http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
    b.fillStyle = "#" + ((Math.random() * 0xffffff) << 0).toString(16);
    b.width = b.radius; //Math.floor(Math.random() * 600) + 10;
    b.height = b.radius; //Math.floor(Math.random() * 100) + 10;
    b.health = Math.floor(Math.random() * 99) + 1;
    b.points = 1;
    b.image = weakEnemy;
    b.ranked = false;
  }
  return b;
}

// ====================================================== //

function drawTarget(b) {
  if (b.visible) drawEnemy(b);
}

// ====================================================== //

function moveTarget(b) {
  if (b.visible) {
    b.y += b.speed;
    if (b.y > screen.height + b.radius / 2) b.visible = false;
    checkForCrash(b);
  }
}
// ====================================================== //

function checkForCrash(b) {
  if (lives <= 0 || !b.visible) return;

  r = b.radius;
  if (
    isWithin(b.x - r, b.y - r, avatar.x + 25, avatar.y + 25, 25) ||
    isWithin(b.x - r, b.y + r, avatar.x + 25, avatar.y + 25, 25) ||
    isWithin(b.x + r, b.y + r, avatar.x + 25, avatar.y + 25, 25) ||
    isWithin(b.x + r - r, b.y - r, avatar.x + 25, avatar.y + 25, 25)
  ) {
    b.visible = false;
    lives--;
  }
}

// ====================================================== //

function drawAvatar() {
  drawImage(base_image, avatar.x, avatar.y, avatar.width, avatar.height);
}

// ====================================================== //

function avatarShoot() {
  projectiles[curProjectile] = createProjectile(avatar.x + 25, avatar.y);
  projectiles[curProjectile].visible = true;
  curProjectile++;
  if (curProjectile == MAX_PROJECTILES) curProjectile = 0;
}

// ====================================================== //

function drawProjectile(p) {
  if (p.visible)
    //drawCircle(p.x,p.y,5,"#000000");
    context.drawImage(projectile_image, p.x, p.y, p.width, p.height);
}

// ====================================================== //

function moveProjectile(p) {
  if (!p.visible) return;
  p.y -= PROJECTILE_SPEED;
  if (p.y < 0) p.visible = false;

  checkForHit(p);
}

// ====================================================== //

function checkForHit(p) {
  for (var i = 0; i < targets.length; i++) {
    b = targets[i];
    if (!b.visible) continue;
    if (isWithin(p.x, p.y, b.x, b.y, b.width)) {
      b.health -= p.damage;

      if (b.health <= 0) {
        b.visible = false;
        p.visible = false;
        score += b.points;
        if (newlife >= 10) {
          lives++;
          newlife = 0;
        } else {
          newlife++;
        }
      } else {
        p.visible = false;
      }
      break;
    }
  }
}

// ====================================================== //

function isWithin(x, y, x1, y1, r) {
  return x >= x1 - r && x <= x1 + r && y >= y1 - r && y <= y1 + r;
}

// ====================================================== //

function drawEnemy(enemy) {
  rankEnemy(enemy);
  try {
    context.drawImage(enemy.image, enemy.x, enemy.y, enemy.width, enemy.height);
  } catch (err) {}
}

// ====================================================== //

function rankEnemy(b) {
  if (b.ranked == false) {
    if (b.health >= 500) {
      b.image = bossEnemy;
      b.points = 1;
    } else if (b.health <= 20) {
      b.image = weakEnemy;
      b.points = 1;
    } else if (b.health > 20 && b.health <= 40) {
      b.image = mediumEnemy;
      b.points = 1;
    } else if (b.health > 40 && b.health <= 60) {
      b.image = hardEnemy;
      b.points = 1;
    } else if (b.health > 60 && b.health <= 499) {
      b.image = extraHardEnemy;
      b.points = 1;
    }
    b.ranked = true;
  }
}

// ====================================================== //

function restartGame() {
  $("#restart")
    .last()
    .html("Restart Game");

  lives = MAX_LIVES;
  score = 0;
  gamePaused = false;
  for (i = 0; i < targets.length; i++) {
    targets[i].visible = false;
  }
  curTarget = 0;
  for (i = 0; i < projectiles.length; i++) {
    projectiles[i].visible = false;
  }
  curProjectile = 0;
  curTargetSpeed = STARTING_TARGET_SPEED;

  window.requestAnimationFrame(loop);
}

// ====================================================== //

function playlaserSound() {
  laserSound.play();
}

// ====================================================== //

function stoplaserSound() {
  laserSound.pause();
}

// ====================================================== //

function createProjectile(x, y) {
  var p = new Object();
  p.x = x;
  p.y = y;
  p.width = 20;
  p.height = 20;
  p.visible = false;
  p.damage = projectileDamage;
  return p;
}

// ====================================================== //
